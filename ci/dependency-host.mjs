import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint } from './prepare-dependency-maintenance.mjs';
import { planGroups, proposalFor } from './dependency-plan.mjs';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const files = ['package.json', 'yarn.lock', ...['proposal.json', 'triage.json', 'weekly-report.md', 'pr-body.md',
    'validation.json', 'status.json', 'planning.json', 'candidate/state.json', 'candidate/result.json', 'candidate/history.json']
    .map((p) => `triage-results/${p}`)];

export function snapshot(root) {
    return fingerprint(Object.fromEntries(files.map((p) => [p, existsSync(resolve(root, p)) ? readFileSync(resolve(root, p), 'utf8') : null])));
}

export function reviewCheck(root, expectedHash, outputTypes, hasPatch) {
    assert.match(expectedHash, /^[a-f0-9]{64}$/);
    assert.equal(snapshot(root), expectedHash, 'Reviewer changed the host-prepared plan, files or execution evidence');
    const validation = read(resolve(root, 'triage-results/validation.json'));
    assert.equal(validation.passed, true);
    const types = outputTypes.startsWith('[') ? JSON.parse(outputTypes) : outputTypes.split(',').map((s) => s.trim()).filter(Boolean);
    const changed = spawnSync('git', ['diff', '--name-only', validation.base], {
        cwd: root,
        encoding: 'utf8',
    });
    assert.equal(changed.status, 0);
    assert.ok(changed.stdout.trim().split('\n').filter(Boolean).every((p) => ['package.json', 'yarn.lock'].includes(p)), 'Reviewer modified protected source files');
    const expected = validation.changed.length ? 'create_pull_request' : 'noop';
    if (hasPatch !== undefined) assert.equal(hasPatch, String(validation.changed.length > 0), 'Safe-output patch transport is missing or unexpected');
    assert.deepEqual(types, [expected], `Reviewed result requires exactly ${expected}; incomplete or misleading outputs cannot complete`);
    validation.reviewAccepted = true;
    writeFileSync(resolve(root, 'triage-results/validation.json'), JSON.stringify(validation, null, 2));
    writeFileSync(resolve(root, 'triage-results/status.json'), JSON.stringify({
        stage: 'review',
        status: 'accepted',
        output: expected,
        publication: validation.changed.length ? 'pending-exact-output-checks' : 'skipped-no-patch',
    }));
    return expected;
}

export function prepareHost(root, run = spawnSync) {
    const directory = resolve(root, 'triage-results');
    mkdirSync(directory, {
        recursive: true,
    });
    const phase = (stage, status, detail = '') => writeFileSync(resolve(directory, 'status.json'), JSON.stringify({
        stage,
        status,
        detail,
    }, null, 2));
    const command = (script, argument) => {
        const result = run(process.execPath, [fileURLToPath(new URL(script, import.meta.url)), argument], {
            cwd: root,
            encoding: 'utf8',
            maxBuffer: 8 * 1024 * 1024,
        });
        if (result.status !== 0) throw new Error((result.stderr || result.stdout || result.error?.message || 'Command failed').slice(-4000));
    };
    try {
        phase('planning', 'started');
        const input = read(resolve(directory, 'agent-input.json'));
        const evidence = read(resolve(directory, 'evidence.json'));
        assert.equal(input.registryComplete, true, 'Incomplete registry evidence cannot establish a successful no-op');
        assert.deepEqual(read(resolve(root, 'package.json')), input.manifest, 'Start from the recorded baseline');
        assert.equal(readFileSync(resolve(root, 'yarn.lock'), 'utf8'), evidence.files['yarn.lock'].data.content);
        assert.ok(!existsSync(resolve(directory, 'candidate/history.json')), 'Start host execution in a fresh checkout');
        if (input.pathEvidence) {
            const proof = read(resolve(directory, 'dependency-paths.json'));
            assert.equal(proof.fingerprint, input.fingerprint);
            assert.equal(proof.baselineSha, input.baselineSha);
            assert.equal(fingerprint(proof.paths), input.pathEvidence.hash);
            input.paths = proof.paths;
        }
        const plan = planGroups(input);
        const blockers = plan.packages.filter((p) => ['unknown-path', 'conflicting-targets', 'conflicting-resolutions'].includes(p.disposition));
        writeFileSync(resolve(directory, 'planning.json'), JSON.stringify({
            packages: plan.packages,
            selectedGroups: plan.groups.slice(0, 3).map((g) => g.name),
            blockers: blockers.map((p) => ({
                name: p.name,
                reason: p.disposition,
            })),
        }, null, 2));
        if (blockers.length) console.warn(`Unresolved planning evidence: ${blockers.map((p) => `${p.name}: ${p.disposition}`).join('; ')}`);
        let groups = plan.groups.slice(0, 3);
        const failures = [];
        let installed = false;
        for (let call = 0; call < 3; call += 1) {
            writeFileSync(resolve(directory, 'proposal.json'), JSON.stringify(proposalFor(plan, groups, failures), null, 2));
            if (!groups.length) break;
            phase('candidate', 'started', groups.map((g) => g.name).join(', '));
            try { command('./dependency-candidate.mjs', 'apply'); installed = true; break; } catch (error) {
                failures.push(error.message);
                const resultPath = resolve(directory, 'candidate/result.json');
                const result = existsSync(resultPath) ? read(resultPath) : null;
                if (!result || ['network', 'timeout'].includes(result.failureClass)) break;
                // Only structured, attributable failures can remove a group.
                // Never guess which dependency caused an install or graph failure.
                const rejected = result.errors?.map((e) => e.group || e.package).filter(Boolean) || [];
                if (!rejected.length || !rejected.every((name) => groups.some((g) => g.name === name))) break;
                groups = groups.filter((g) => !rejected.includes(g.name));
            }
        }
        phase('reporting', 'started');
        command('./dependency-maintenance.mjs', 'render');
        assert.ok(plan.groups.length || !blockers.length, `No verified remediation available; unresolved planning evidence: ${blockers.map((p) => `${p.name}: ${p.disposition}`).join('; ')}`);
        assert.ok(installed || !plan.groups.length, `Remediation failed: ${failures.at(-1) || 'no candidate completed'}`);
        phase('validation', 'started');
        command('./dependency-maintenance.mjs', 'validate');
        const validation = read(resolve(directory, 'validation.json'));
        validation.noopMessage = `Dependency review complete: no eligible host-validated dependency changes. ${validation.outcomes.filter((o) => o.outcome === 'unresolved').length} findings remain unresolved; see the host report.`;
        writeFileSync(resolve(directory, 'validation.json'), JSON.stringify(validation, null, 2));
        if (validation.changed.length) assert.ok(groups.some((g) => g.name.startsWith('pin:')) || validation.outcomes.some((o) => o.remaining.length < o.before.length), 'Candidate changed files without reducing any vulnerable versions');
        if (validation.changed.length) {
            const suffix = process.env.GITHUB_RUN_ID || input.baselineSha.slice(0, 12);
            assert.match(suffix, /^[a-z0-9]+$/i);
            const branch = `dependency-maintenance-${suffix}-${process.env.GITHUB_RUN_ATTEMPT || '1'}`;
            assert.match(branch, /^dependency-maintenance-[a-zA-Z0-9]+-\d+$/);
            const git = (args) => {
                const result = run('git', args, {
                    cwd: root,
                    encoding: 'utf8',
                });
                assert.equal(result.status, 0, result.stderr || 'Host git operation failed');
            };
            git(['switch', '-c', branch]);
            git(['-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
                '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', 'commit', '--only', '-m', 'Dependency security and pin refresh', '--', 'package.json', 'yarn.lock']);
            validation.branch = branch;
            writeFileSync(resolve(directory, 'validation.json'), JSON.stringify(validation, null, 2));
        }
        phase('review', 'prepared');
        const hash = snapshot(root);
        if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `plan_hash=${hash}\n`);
        return hash;
    } catch (error) {
        phase('execution', 'failed', error.message);
        writeFileSync(resolve(directory, 'validation.json'), JSON.stringify({
            passed: false,
            remediationStatus: 'failed',
            diagnostic: error.message,
        }));
        // A report must exist even when JSON validation or rendering itself failed.
        if (!existsSync(resolve(directory, 'weekly-report.md'))) writeFileSync(resolve(directory, 'weekly-report.md'), `Dependency maintenance failed\n\n${error.message}\n`);
        throw error;
    }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        if (process.argv[2] === 'prepare') prepareHost(process.cwd());
        else if (process.argv[2] === 'review-check') reviewCheck(process.cwd(), process.argv[3], process.argv[4] || '', process.argv[5]);
        else throw new Error('Use prepare or review-check');
    } catch (error) {
        if (process.argv[2] === 'review-check') {
            writeFileSync('triage-results/status.json', JSON.stringify({
                stage: 'review',
                status: 'failed',
                diagnostic: error.message,
            }));
            writeFileSync('triage-results/validation.json', JSON.stringify({
                passed: false,
                reviewAccepted: false,
                remediationStatus: 'failed',
                diagnostic: error.message,
            }));
        }
        console.error(error.message); process.exitCode = 1;
    }
}
