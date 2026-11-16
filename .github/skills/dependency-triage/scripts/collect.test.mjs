import test from 'node:test';
import assert from 'node:assert/strict';
import {
    readFile, mkdtemp, writeFile, rm, 
} from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collect, githubReader } from './collect.mjs';

const fixture = JSON.parse(await readFile(new URL('../references/sample-api.json', import.meta.url), 'utf8'));
const reader = (responses) => async(path) => {
    if (!responses[path]) throw new Error('Unexpected request');
    if (responses[path].error) throw new Error(responses[path].error);
    return structuredClone(responses[path]);
};

test('collects all alerts, filters human PRs and pins baseline files', async() => {
    const evidence = await collect('example/demo', reader(fixture));
    assert.equal(evidence.status, 'complete');
    assert.equal(evidence.alerts.data.length, 3);
    assert.deepEqual(evidence.pullRequests.data.map((pr) => pr.number), [10]);
    assert.equal(evidence.files['package.json'].data.content.dependencies['example-direct'], '^1.0.0');
    assert.equal(evidence.baseline.data.sha, 'a'.repeat(40));
    assert.equal(evidence.pullRequests.data[0].files.data.length, 2);
    assert.equal(evidence.pullRequests.data[0].checkRuns.data[0].conclusion, 'success');
});

test('inaccessible alerts are unavailable, never an empty successful inventory', async() => {
    const responses = structuredClone(fixture);
    responses['/repos/example/demo/dependabot/alerts?state=open&per_page=100'] = {
        error: 'GitHub HTTP 403', 
    };
    const evidence = await collect('example/demo', reader(responses));
    assert.equal(evidence.status, 'incomplete');
    assert.equal(evidence.alerts.data, null);
    assert.equal(evidence.errors[0].message, 'GitHub HTTP 403');
    assert.equal(evidence.pullRequests.status, 'complete');
});

test('follows cursor pagination and rejects a missing later page without claiming completeness', async() => {
    const responses = structuredClone(fixture);
    const path = '/repos/example/demo/dependabot/alerts?state=open&per_page=100';
    const alerts = responses[path].data;
    responses[path] = {
        data: alerts.slice(0, 1),
        next: '/next-alert-page', 
    };
    responses['/next-alert-page'] = {
        data: alerts.slice(1), 
    };
    assert.equal((await collect('example/demo', reader(responses))).alerts.data.length, 3);
    delete responses['/next-alert-page'];
    assert.equal((await collect('example/demo', reader(responses))).alerts.status, 'unavailable');
});

test('empty alerts remain distinguishable from missing alerts', async() => {
    const responses = structuredClone(fixture);
    responses['/repos/example/demo/dependabot/alerts?state=open&per_page=100'] = {
        data: [], 
    };
    const evidence = await collect('example/demo', reader(responses));
    assert.equal(evidence.status, 'complete');
    assert.deepEqual(evidence.alerts.data, []);
});

test('records missing checks, changed heads and truncated file lists', async() => {
    for (const change of ['checks', 'head', 'files']) {
        const responses = structuredClone(fixture);
        if (change === 'checks') delete responses[`/repos/example/demo/commits/${'b'.repeat(40)}/check-runs?per_page=100`];
        if (change === 'head') responses['/repos/example/demo/pulls/10'].data.head.sha = 'c'.repeat(40);
        if (change === 'files') responses['/repos/example/demo/pulls/10'].data.changed_files = 3;
        const evidence = await collect('example/demo', reader(responses));
        assert.equal(evidence.status, 'incomplete', change);
        assert.equal(evidence.errors.length, 1);
    }
});

test('transport is GET-only and never sends credentials to another origin', async() => {
    let calls = 0;
    const read = githubReader('test-secret', async(url, options) => {
        calls += 1;
        assert.equal(url.origin, 'https://api.github.com');
        assert.equal(options.method, 'GET');
        assert.equal(options.redirect, 'error');
        return {
            ok: true,
            json: async() => [],
            headers: new Headers(), 
        };
    });
    await read('/repos/example/demo');
    await assert.rejects(read('https://elsewhere.example/'), /Unsupported API origin/);
    assert.equal(calls, 1);
});

test('unexpected error messages cannot leak tokens into evidence', async() => {
    const evidence = await collect('example/demo', async() => { throw new Error('secret-token'); });
    assert.equal(evidence.status, 'incomplete');
    assert.equal(JSON.stringify(evidence).includes('secret-token'), false);
});

test('CLI saves partial evidence and exits nonzero when alerts cannot be read', async() => {
    const directory = await mkdtemp(join(tmpdir(), 'dependency-triage-'));
    try {
        const responses = structuredClone(fixture);
        responses['/repos/example/demo/dependabot/alerts?state=open&per_page=100'] = {
            error: 'GitHub HTTP 403', 
        };
        const input = join(directory, 'api.json');
        const output = join(directory, 'evidence.json');
        await writeFile(input, JSON.stringify(responses));
        const result = spawnSync(process.execPath, [fileURLToPath(new URL('./collect.mjs', import.meta.url)),
            '--repo', 'example/demo', '--fixture', input, '--out', output], {
            encoding: 'utf8', 
        });
        assert.equal(result.status, 2, result.stderr);
        const evidence = JSON.parse(await readFile(output, 'utf8'));
        assert.equal(evidence.mode, 'fixture');
        assert.equal(evidence.status, 'incomplete');
        assert.equal(evidence.alerts.data, null);
    } finally {
        await rm(directory, {
            recursive: true,
            force: true, 
        });
    }
});
