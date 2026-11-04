import assert from 'node:assert/strict';
import {
    existsSync, mkdirSync, readFileSync, writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from './dependency-http.mjs';

import { completedRemediation } from './dependency-execution.mjs';

const lifetimeMs = 6 * 86400_000; // Shorter than the report artifact's seven-day retention.
export async function shouldRun(input, previous, { force = false, now = Date.now(), readPR } = {
}) {
    if (force || !input.registryComplete || !previous || previous.schemaVersion !== 1
        || previous.fingerprint !== input.fingerprint || previous.repository !== input.repository
        || previous.baselineSha !== input.baselineSha || previous.validated !== true || previous.analysisComplete !== true || previous.reviewAccepted !== true || !completedRemediation(previous.remediationStatus)
        || !Number.isFinite(Date.parse(previous.completedAt)) || now < Date.parse(previous.completedAt)
        || now - Date.parse(previous.completedAt) >= lifetimeMs) return true;
    if (previous.prNumber) {
        try {
            const pr = await readPR(previous.prNumber);
            if (pr.state !== 'open' || pr.user?.login !== 'github-actions[bot]'
                || pr.head?.repo?.full_name !== input.repository
                || !previous.prHeadSha || pr.head?.sha !== previous.prHeadSha
                || !pr.body?.includes('<!-- dotcom-dependency-maintenance:v1 -->')) return true;
        } catch { return true; }
    } else if (!['noop', 'staged'].includes(previous.outcome)) return true;
    return false;
}

export function completedState(input, validation, { prNumber = '', prHeadSha = '', staged = false, runId, now = Date.now() }) {
    assert.equal(validation.passed, true);
    assert.equal(validation.analysisComplete, true, 'Incomplete analysis must not suppress future runs');
    assert.equal(validation.reviewAccepted, true, 'Only a host-verified review may enter the success cache');
    assert.ok(completedRemediation(validation.remediationStatus), 'Failed or unverified remediation must not enter the success cache');
    assert.equal(validation.fingerprint, input.fingerprint);
    assert.equal(validation.base, input.baselineSha);
    assert.equal(input.registryComplete, true, 'Incomplete registry evidence must not suppress future runs');
    assert.ok(Array.isArray(validation.changed));
    if (validation.changed.length) {
        assert.equal(validation.testsRun, true);
        assert.ok(prNumber || staged, 'Unpublished changes are not a completed result');
    }
    assert.match(String(runId), /^[1-9]\d*$/);
    if (prNumber) {
        assert.match(String(prNumber), /^[1-9]\d*$/);
        assert.match(prHeadSha, /^[a-f0-9]{40}$/);
    }
    return {
        schemaVersion: 1,
        repository: input.repository,
        baselineSha: input.baselineSha,
        fingerprint: input.fingerprint,
        completedAt: new Date(now).toISOString(),
        validated: true,
        analysisComplete: true,
        reviewAccepted: true,
        remediationStatus: validation.remediationStatus,
        runId: String(runId),
        prNumber: String(prNumber),
        prHeadSha,
        outcome: prNumber ? 'pr' : validation.changed.length ? 'staged' : 'noop',
    };
}

export async function main(command) {
    const input = JSON.parse(readFileSync('triage-results/agent-input.json', 'utf8'));
    const statePath = 'triage-results/completed-state/completed.json';
    const readPR = async(number) => {
        assert.match(String(number), /^[1-9]\d*$/);
        assert.match(input.repository, /^[\w.-]+\/[\w.-]+$/);
        return (await readJson(`https://api.github.com/repos/${input.repository}/pulls/${number}`, {
            headers: {
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                Accept: 'application/vnd.github+json',
            },
        })).data;
    };
    if (command === 'check') {
        let previous = null;
        try { previous = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : null; } catch { /* Corrupt cache is a miss. */ }
        const run = await shouldRun(input, previous, {
            force: process.env.FORCE_MAINTENANCE === 'true',
            readPR,
        });
        writeFileSync(process.env.GITHUB_OUTPUT, `should_run=${run}\n`, {
            flag: 'a',
        });
        const summary = run ? 'Dependency maintenance: new, incomplete, expired or forced inputs; agent required.'
            : `Dependency maintenance: unchanged inputs; reusing validated report from run ${previous.runId}.`;
        console.log(summary);
        if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`, {
            flag: 'a',
        });
    } else if (command === 'complete') {
        if (!input.registryComplete) {
            console.log('Registry evidence incomplete; leaving future agent attempts enabled.');
            return;
        }
        const prNumber = process.env.REPLACEMENT_PR || '';
        const prHeadSha = prNumber ? (await readPR(prNumber)).head?.sha : '';
        const state = completedState(input, JSON.parse(readFileSync('triage-results/validation.json', 'utf8')), {
            prNumber,
            prHeadSha,
            staged: process.env.MAINTENANCE_STAGED === 'true',
            runId: process.env.GITHUB_RUN_ID,
        });
        mkdirSync('triage-results/completed-state', {
            recursive: true,
        });
        writeFileSync(statePath, `${JSON.stringify(state)}\n`);
        writeFileSync(process.env.GITHUB_OUTPUT, 'save=true\n', {
            flag: 'a',
        });
    } else throw new Error('Use check or complete');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main(process.argv[2]).catch(() => { console.error('Maintenance state check failed; no completed result recorded'); process.exitCode = 1; });
}
