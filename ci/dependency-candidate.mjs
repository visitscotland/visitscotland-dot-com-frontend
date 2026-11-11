import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    closeSync, existsSync, mkdirSync, openSync, readFileSync, writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';
import { yarnEnvironment, installDiagnostic } from './dependency-execution.mjs';
import {
    matchingPaths, resolutionConflicts, installedGraph, verifyGraphChanges,
} from './dependency-graph.mjs';
import { applyProposal } from './dependency-maintenance.mjs';
import { fingerprint, pinTarget } from './prepare-dependency-maintenance.mjs';

const fields = ['dependencies', 'devDependencies', 'resolutions', 'overrides'];
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));

export function candidateManifest(input, proposal, current) {
    const manifest = structuredClone(current);
    const seen = new Set();
    const errors = [];
    for (const edit of proposal.changes || []) {
        try {
            assert.ok(fields.includes(edit.field), 'Only dependency fields may change');
            assert.ok(typeof edit.name === 'string' && edit.name && !['__proto__', 'constructor', 'prototype'].includes(edit.name));
            const key = `${edit.field}:${edit.name}`;
            assert.ok(!seen.has(key), 'Duplicate manifest edit');
            seen.add(key);
            assert.ok(Object.hasOwn(edit, 'value'), 'Each edit needs value: an exact prepared version or null for removal');
            const target = ['dependencies', 'devDependencies'].includes(edit.field)
                ? edit.name : pinTarget(edit.name, Object.keys(input.releases));
            if (edit.value !== null) {
                assert.ok(semver.valid(edit.value), 'Use an exact version, never a range or latest');
                const candidate = input.releases[target]?.find((r) => r.version === edit.value);
                assert.ok(candidate, `No prepared candidate for ${key}`);
                assert.ok(candidate.applicableFromVersions?.length
                && candidate.applicableFromVersions.every((v) => semver.gte(edit.value, v)), 'No downgrade candidates');
                if (edit.field === 'resolutions') {
                    const paths = matchingPaths(edit.name, input.paths || []);
                    assert.ok(paths?.length && paths.every((p) => p.pathVerified && semver.validRange(p.constraint)
                        && semver.satisfies(edit.value, p.constraint)), 'Resolution target must satisfy every matched parent constraint');
                    const affected = input.triage.packages.find((p) => p.name === target)?.affectedVersions || [];
                    assert.ok(!affected.length || paths?.some((p) => p.effectiveVersions.some((v) => affected.includes(v))),
                        'Selector only targets already-safe copies; target the affected branch or update its parent');
                    assert.ok(paths && paths.every((p) => p.effectiveVersions.every((v) =>
                        semver.valid(v) && semver.gte(edit.value, v))), 'Selector would downgrade an installed branch; narrow the selector');
                }
                manifest[edit.field] ||= {
                };
                manifest[edit.field][edit.name] = edit.value;
            } else {
                assert.equal(edit.field, 'resolutions', 'Only evidenced resolution removals are supported');
                delete manifest.resolutions?.[edit.name];
            }
        } catch (error) {
            const target = pinTarget(edit.name, Object.keys(input.releases));
            const p = input.triage.packages.find((item) => item.name === target);
            errors.push({
                field: edit.field,
                selector: edit.name,
                package: target,
                group: edit.group,
                diagnostic: error.message,
                affectedVersions: p?.affectedVersions || [],
                matchedVersions: [...new Set((matchingPaths(edit.name, input.paths || []) || []).flatMap((path) => path.effectiveVersions))],
                candidates: (input.releases[target] || []).map((r) => r.version),
                parentCandidates: (p?.parents || []).flatMap((parent) => (input.releases[parent.name] || []).map((r) => ({
                    name: parent.name,
                    version: r.version,
                }))),
            });
        }
    }
    errors.push(...resolutionConflicts(input, manifest).map((e) => ({
        ...e,
        group: proposal.changes.find((edit) => edit.name === e.selector)?.group,
    })));
    if (errors.length) {
        const error = new Error(errors.map((e) => `${e.selector}: ${e.diagnostic}`).join('; '));
        error.details = errors;
        throw error;
    }
    applyProposal(input, proposal, manifest);
    return manifest;
}

// Persist before launching Yarn: crashes and timeouts consume an attempt too.
export function reserveAttempt(state, candidateHash) {
    assert.ok(state.attempts < 3, 'Candidate budget exhausted: one initial install plus two repairs. Render the retained result; do not retry.');
    assert.ok(!state.hashes.includes(candidateHash), 'Identical candidate already attempted; diagnose or render the retained result');
    return {
        ...state,
        attempts: state.attempts + 1,
        hashes: [...state.hashes, candidateHash],
    };
}

function preparedInput(root) {
    const input = read(resolve(root, 'triage-results/agent-input.json'));
    if (input.pathEvidence) {
        const proof = read(resolve(root, 'triage-results/dependency-paths.json'));
        assert.equal(proof.baselineSha, input.baselineSha);
        assert.equal(proof.fingerprint, input.fingerprint);
        assert.equal(fingerprint(proof.paths), input.pathEvidence.hash);
        input.paths = proof.paths;
    }
    return input;
}

export function installCandidate(root, state, run = spawnSync, verify = () => verifyGraphChanges(preparedInput(root), read(resolve(root, 'package.json')), installedGraph(root))) {
    const manifestPath = resolve(root, 'package.json');
    const lockPath = resolve(root, 'yarn.lock');
    const candidateHash = fingerprint(read(manifestPath));
    const reserved = reserveAttempt(state, candidateHash);
    const directory = resolve(root, 'triage-results/candidate');
    const statePath = resolve(directory, 'state.json');
    writeFileSync(statePath, JSON.stringify(reserved));
    const logPath = resolve(directory, `install-${reserved.attempts}.log`);
    const fd = openSync(logPath, 'w');
    let result;
    try {
        result = run(process.execPath, ['.yarn/releases/yarn-4.14.1.cjs', 'install', '--no-immutable', '--mode=skip-build'], {
            cwd: root,
            stdio: ['ignore', fd, fd],
            timeout: 180000,
            env: yarnEnvironment(),
        });
    } finally { closeSync(fd); }
    let graphError;
    if (result.status === 0 && !result.error) {
        try { verify(); } catch (error) { graphError = error; }
    }
    const passed = result.status === 0 && !result.error && !graphError;
    if (passed) {
        reserved.manifest = readFileSync(manifestPath, 'utf8');
        reserved.lock = readFileSync(lockPath, 'utf8');
    } else {
        writeFileSync(manifestPath, state.manifest);
        writeFileSync(lockPath, state.lock);
    }
    writeFileSync(statePath, JSON.stringify(reserved));
    const summary = {
        passed,
        attempt: reserved.attempts,
        remainingRepairs: 3 - reserved.attempts,
        exitCode: result.status,
        signal: result.signal || null,
        error: result.error?.code || null,
        rolledBack: !passed,
        log: logPath,
        ...installDiagnostic(readFileSync(logPath, 'utf8'), result.error?.code),
    };
    if (passed) summary.failureClass = null;
    if (graphError) {
        const proposal = read(resolve(root, 'triage-results/proposal.json'));
        summary.phase = 'graph';
        summary.failureClass = 'graph';
        summary.diagnostic = graphError.message.slice(0, 4000);
        summary.errors = (graphError.details || []).map((e) => ({
            ...e,
            group: proposal.changes.find((edit) => edit.name === e.selector)?.group,
        }));
    }
    writeFileSync(resolve(directory, 'result.json'), JSON.stringify(summary, null, 2));
    return summary;
}

function execute(command, root) {
    const directory = resolve(root, 'triage-results/candidate');
    const statePath = resolve(directory, 'state.json');
    const input = preparedInput(root);
    mkdirSync(directory, {
        recursive: true,
    });
    const hasState = existsSync(statePath);
    if (!hasState) assert.deepEqual(read(resolve(root, 'package.json')), input.manifest, 'Use the helper before editing the manifest');
    const state = hasState ? read(statePath) : {
        baselineSha: input.baselineSha,
        fingerprint: input.fingerprint,
        attempts: 0,
        hashes: [],
        manifest: readFileSync(resolve(root, 'package.json'), 'utf8'),
        lock: readFileSync(resolve(root, 'yarn.lock'), 'utf8'),
    };
    assert.equal(state.baselineSha, input.baselineSha);
    assert.equal(state.fingerprint, input.fingerprint);
    if (command === 'restore') {
        writeFileSync(resolve(root, 'package.json'), state.manifest);
        writeFileSync(resolve(root, 'yarn.lock'), state.lock);
        console.log('Restored the last installed candidate (or baseline); attempt budget retained. Update proposal decisions before rendering.');
        return;
    }
    assert.equal(command, 'apply', 'Use apply or restore');
    const manifest = candidateManifest(input, read(resolve(root, 'triage-results/proposal.json')), read(resolve(root, 'package.json')));
    // Invalid plans and exhausted budgets never modify package.json.
    reserveAttempt(state, fingerprint(manifest));
    writeFileSync(statePath, JSON.stringify(state));
    writeFileSync(resolve(root, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    const summary = installCandidate(root, state);
    console.log(JSON.stringify(summary));
    if (!summary.passed) process.exitCode = 1;
}

export function main(command, root = process.cwd()) {
    const directory = resolve(root, 'triage-results/candidate');
    mkdirSync(directory, {
        recursive: true,
    });
    const path = resolve(directory, 'history.json');
    const history = existsSync(path) ? read(path) : [];
    const record = {
        command,
        call: history.filter((h) => h.command !== 'restore').length + 1,
        outcome: 'started',
    };
    history.push(record);
    writeFileSync(path, JSON.stringify(history));
    try {
        assert.ok(command === 'restore' || record.call <= 3, 'Validation/recovery budget exhausted (three calls total)');
        execute(command, root);
        const result = existsSync(resolve(directory, 'result.json')) ? read(resolve(directory, 'result.json')) : null;
        record.outcome = result?.passed === false && command !== 'restore' ? 'failed' : 'success';
    } catch (error) {
        record.outcome = 'failed';
        record.diagnostic = error.message.slice(0, 3000);
        record.errors = error.details || [];
        writeFileSync(resolve(directory, 'result.json'), JSON.stringify({
            passed: false,
            rolledBack: true,
            phase: 'proposal',
            failureClass: 'proposal',
            diagnostic: record.diagnostic,
            errors: record.errors,
        }));
        throw error;
    } finally { writeFileSync(path, JSON.stringify(history)); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try { main(process.argv[2]); } catch (error) {
        console.error(JSON.stringify({
            passed: false,
            diagnostic: error.message.slice(0, 3000),
            errors: error.details || [],
        }));
        process.exitCode = 1;
    }
}
