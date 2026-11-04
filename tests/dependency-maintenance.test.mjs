import test from 'node:test';
import assert from 'node:assert/strict';
import {
    readFile, mkdtemp, writeFile, mkdir, rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';
import { collect } from '../.github/skills/dependency-triage/scripts/collect.mjs';
import { readJson } from '../ci/dependency-http.mjs';
import {
    inventory, prepare, fingerprint, advisoryRanges, pinTarget, releaseCandidates, releaseDisposition, agentContextPages, writeAgentContext,
} from '../ci/prepare-dependency-maintenance.mjs';
import { planGroups, proposalFor } from '../ci/dependency-plan.mjs';
import { shouldRun, completedState } from '../ci/dependency-maintenance-state.mjs';
import {
    assess, applyProposal, renderReport, renderBody,
} from '../ci/dependency-maintenance.mjs';
import { owned, replaceOld } from '../ci/replace-maintenance-pr.mjs';

const now = Date.parse('2026-10-29T12:00:00Z');
const base = 'a'.repeat(40);
const head = 'b'.repeat(40);
function sample() {
    const manifest = {
        dependencies: {
            parent: '2.0.0',
            thing: '^1.0.0',
        },
        resolutions: {
            thing: '1.0.0',
            'parent/thing': '1.0.0',
            '@scope/name': '1.0.0',
        },
        overrides: {
            inactive: '9.0.0',
        },
    };
    const lock = YAML.stringify({
        __metadata: {
            version: 8,
        },
        'parent@npm:2.0.0': {
            version: '2.0.0',
            resolution: 'parent@npm:2.0.0',
            dependencies: {
                thing: 'npm:^1.0.1',
            },
        },
        'thing@npm:^1.0.1, thing@npm:1.0.0': {
            version: '1.0.0',
            resolution: 'thing@npm:1.0.0',
        },
        '@scope/name@npm:1.0.0': {
            version: '1.0.0',
            resolution: '@scope/name@npm:1.0.0',
        },
    });
    const alert = (number, range, severity) => ({
        number,
        html_url: `https://github.com/example/demo/security/dependabot/${number}`,
        dependency: {
            package: {
                ecosystem: 'npm',
                name: 'thing',
            },
        },
        security_advisory: {
            severity,
        },
        security_vulnerability: {
            package: {
                ecosystem: 'npm',
                name: 'thing',
            },
            vulnerable_version_range: range,
            first_patched_version: {
                identifier: '1.0.2',
            },
        },
    });
    return {
        schemaVersion: 1,
        repository: 'example/demo',
        status: 'complete',
        mode: 'live',
        collectedAt: new Date(now).toISOString(),
        baseline: {
            data: {
                sha: base,
            },
        },
        files: {
            'package.json': {
                data: {
                    content: manifest,
                },
            },
            'yarn.lock': {
                data: {
                    content: lock,
                },
            },
        },
        alerts: {
            data: [alert(1, '< 1.0.1', 'medium'), alert(2, '>= 1.0.0, < 1.0.2', 'critical')],
        },
    };
}
function metadata() {
    const versions = ['1.0.0', '1.0.1', '1.0.2', '1.1.0', '2.0.0', '3.0.0', '4.0.0', '5.0.0', '6.0.0-beta.1'];
    return {
        versions: Object.fromEntries(versions.map((v) => [v, {
            engines: {
                node: v === '3.0.0' ? '>=30' : '>=20',
            },
            ...(v === '4.0.0' ? {
                deprecated: 'withdrawn',
            } : {
            }),
        }])),
        time: Object.fromEntries(versions.map((v) => [v, v === '5.0.0' ? '2026-10-28T00:00:00Z' : '2026-09-01T00:00:00Z'])),
    };
}
const options = {
    now,
    nodeVersion: '24.4.1',
    policyHash: 'policy',
    registryRead: async() => metadata(),
};

test('maintenance collection omits every PR endpoint while keeping full alerts and baseline', async() => {
    const fixture = JSON.parse(await readFile(new URL('../.github/skills/dependency-triage/references/sample-api.json', import.meta.url)));
    const calls = [];
    const e = await collect('example/demo', async(path) => { calls.push(path); return structuredClone(fixture[path]); }, {
        profile: 'maintenance',
    });
    assert.equal(e.status, 'complete');
    assert.equal(e.alerts.data.length, 3);
    assert.equal(e.pullRequests.status, 'not-requested');
    assert.equal(calls.length, 5);
    assert.ok(calls.every((path) => !path.includes('/pulls')));
});

test('inventory groups advisories, normalizes intersections, preserves scoped-pin gaps and inactive overrides', () => {
    const result = inventory(sample());
    assert.equal(result.triage.packages.length, 1);
    assert.equal(result.triage.packages[0].highestSeverity, 'critical');
    assert.deepEqual(result.triage.packages[0].affectedVersions, ['1.0.0']);
    assert.equal(result.triage.laggingPins[0].evidenceLevel, 'Parent requires newer');
    assert.deepEqual(result.triage.laggingPins[0].unpinnedVersions, []);
    assert.equal(result.pins.find((p) => p.selector === 'parent/thing').status, 'parent-requires-newer');
    assert.deepEqual(result.triage.inactiveOverrides, ['inactive']);
    assert.equal(pinTarget('parent/@scope/name@npm:^1', ['name', '@scope/name']), '@scope/name');
    assert.deepEqual(advisoryRanges(sample().alerts.data[1]), ['>= 1.0.0 < 1.0.2']);
});

test('invalid or missing advisory ranges remain unknown and never establish fixes', () => {
    const e = sample();
    e.alerts.data[0].security_vulnerability.vulnerable_version_range = 'unparseable';
    const triage = inventory(e).triage;
    assert.deepEqual(triage.packages[0].affectedVersions, []);
    assert.ok(assess(e, triage, e.files['yarn.lock'].data.content).some((o) => o.outcome === 'unresolved'));
    delete e.alerts.data[1].security_vulnerability;
    assert.deepEqual(advisoryRanges(e.alerts.data[1]), ['']);
});

test('registry candidates cover all advisories and respect release age, Node, deprecation and prerelease gates', () => {
    const candidates = releaseCandidates('thing', metadata(), ['1.0.0'], ['<1.0.2'], {
        now,
        nodeVersion: '24.4.1',
    });
    assert.deepEqual(candidates.map((c) => c.version), ['1.0.2']);
    assert.ok(candidates.every((c) => c.source.includes('registry.npmjs.org/thing/')));
});

test('unfixed reports distinguish unpublished fixes from age-deferred and otherwise ineligible releases', async() => {
    for (const [status, release, expected] of [
        ['no-published-fix', null, /manually investigate upstream/],
        ['age-gated', {
        }, /1\.0\.2 eligible 2026-11-05T12:00:00\.000Z.*Wait until eligible.*critical issues/],
        ['other-policy-blocked', {
            engines: {
                node: '<10',
            },
        }, /fails another eligibility rule/],
    ]) {
        const m = {
            versions: {
                '1.0.0': {
                },
            },
            time: {
                '1.0.0': '2026-01-01T00:00:00Z',
            },
        };
        if (release) { m.versions['1.0.2'] = release; m.time['1.0.2'] = new Date(now).toISOString(); }
        const input = await prepare(sample(), {
            ...options,
            registryRead: async() => m,
        });
        assert.equal(input.releaseDispositions.thing.status, status);
        const plan = planGroups(input);
        assert.equal(plan.groups.length, 0);
        const proposal = proposalFor(plan, []);
        const triage = applyProposal(input, proposal, input.manifest);
        const evidence = sample();
        const body = renderBody(evidence, renderReport(triage), assess(evidence, triage, evidence.files['yarn.lock'].data.content));
        assert.match(body, expected);
        assert.ok(!body.includes('no-patch;'));
        if (status === 'age-gated') {
            const matured = await prepare(sample(), {
                ...options,
                now: now + 7 * 86400_000,
                registryRead: async() => m,
            });
            assert.equal(matured.releaseDispositions.thing.status, 'eligible');
            assert.equal(matured.releases.thing[0].version, '1.0.2');
            assert.notEqual(matured.fingerprint, input.fingerprint, 'Age eligibility must invalidate a cached deferral');
        }
    }
    const diagnostic = releaseDisposition('thing', {
        versions: {
        },
        time: {
        },
    }, ['1.0.0'], ['invalid'], {
        now,
    }, []);
    assert.equal(diagnostic.status, 'unknown');
});

test('preparation deduplicates registry reads; timestamps do not invalidate fingerprints but advisories and releases do', async() => {
    const calls = [];
    const first = await prepare(sample(), {
        ...options,
        registryRead: async(name) => { calls.push(name); return metadata(); },
    });
    assert.equal(calls.length, new Set(calls).size);
    const e = sample();
    e.collectedAt = '2026-10-29T13:00:00Z';
    assert.equal((await prepare(e, {
        ...options,
        now: now + 1000,
    })).fingerprint, first.fingerprint);
    e.alerts.data[0].security_vulnerability.vulnerable_version_range = '<1.1.0';
    assert.notEqual((await prepare(e, options)).fingerprint, first.fingerprint);
    const changed = await prepare(sample(), {
        ...options,
        registryRead: async() => {
            const m = metadata(); m.versions['1.0.2'].deprecated = 'Withdrawn'; return m;
        },
    });
    assert.notEqual(changed.fingerprint, first.fingerprint);
    const irrelevantRelease = await prepare(sample(), {
        ...options,
        registryRead: async() => {
            const m = metadata();
            m.versions['2.1.0'] = {
            };
            m.time['2.1.0'] = '2026-09-01T00:00:00Z';
            return m;
        },
    });
    assert.equal(irrelevantRelease.fingerprint, first.fingerprint, 'Unselected releases must not trigger more Copilot runs');
    assert.equal(fingerprint({
        b: 2,
        a: 1,
    }), fingerprint({
        a: 1,
        b: 2,
    }));
});

test('registry failures remain explicit and cannot suppress subsequent runs', async() => {
    const input = await prepare(sample(), {
        ...options,
        registryRead: async() => { throw new Error('private error'); },
    });
    assert.equal(input.registryComplete, false);
    assert.ok(input.triage.gaps.some((gap) => gap.includes('Registry evidence unavailable')));
    assert.ok(!JSON.stringify(input).includes('private error'));
    assert.throws(() => completedState(input, {
        passed: true,
        analysisComplete: true,
        reviewAccepted: true,
        remediationStatus: 'not-attempted',
        base,
        fingerprint: input.fingerprint,
        changed: [],
    }, {
        runId: '1',
        now,
    }));
});

test('workspace roots are not queried as registry packages and direct dependencies stay direct', async() => {
    const e = sample();
    const lock = YAML.parse(e.files['yarn.lock'].data.content);
    delete lock['parent@npm:2.0.0'];
    lock['app@workspace:.'] = {
        version: '0.0.0-use.local',
        resolution: 'app@workspace:.',
        dependencies: {
            thing: 'npm:1.0.0',
        },
    };
    e.files['yarn.lock'].data.content = YAML.stringify(lock);
    const calls = [];
    const input = await prepare(e, {
        ...options,
        registryRead: async(name) => { calls.push(name); return metadata(); },
    });
    assert.equal(input.triage.packages[0].relationship, 'direct');
    assert.ok(calls.every((name) => !name.includes('workspace:')));
});

test('malformed registry evidence is a gap, never an empty successful release list', async() => {
    const input = await prepare(sample(), {
        ...options,
        registryRead: async() => ({
            versions: [],
        }),
    });
    assert.equal(input.registryComplete, false);
});

test('manifest changes must admit a verified candidate even without package recommendations', async() => {
    const input = await prepare(sample(), options);
    const manifest = structuredClone(input.manifest);
    manifest.resolutions.thing = '99.0.0';
    const proposal = {
        schemaVersion: 1,
        packages: [{
            name: 'thing',
            ecosystem: 'npm',
            recommendations: [{
                action: 'Review thing parent compatibility',
            }],
        }],
        changes: [{
            field: 'resolutions',
            name: 'thing',
            reason: 'Attempt upgrade',
            compatibility: 'Review requested',
        }],
    };
    assert.throws(() => applyProposal(input, proposal, manifest), /prepared registry candidate/);
});

test('unchanged gate reuses only recent successful identical results and honours force', async() => {
    const input = await prepare(sample(), options);
    const validation = {
        passed: true,
        analysisComplete: true,
        reviewAccepted: true,
        remediationStatus: 'not-attempted',
        base,
        fingerprint: input.fingerprint,
        changed: [],
        testsRun: false,
    };
    const previous = completedState(input, validation, {
        runId: '1',
        now,
    });
    assert.equal(await shouldRun(input, previous, {
        now,
    }), false);
    for (const variant of [null, {
        ...previous,
        validated: false,
    }, {
        ...previous,
        fingerprint: 'changed',
    },
    {
        ...previous,
        baselineSha: head,
    }, {
        ...previous,
        completedAt: 'invalid',
    }]) {
        assert.equal(await shouldRun(input, variant, {
            now,
        }), true);
    }
    assert.equal(await shouldRun(input, previous, {
        now,
        force: true,
    }), true);
    assert.equal(await shouldRun(input, previous, {
        now: now + 6 * 86400_000,
    }), true);
    assert.equal(await shouldRun({
        ...input,
        registryComplete: false,
    }, previous, {
        now,
    }), true);
    assert.throws(() => completedState(input, {
        ...validation,
        passed: false,
    }, {
        runId: '1',
        now,
    }));
    assert.throws(() => completedState(input, {
        ...validation,
        changed: ['yarn.lock'],
    }, {
        runId: '1',
        staged: true,
        now,
    }));
});

test('closed, modified or inaccessible maintenance PRs never suppress a fresh run', async() => {
    const input = await prepare(sample(), options);
    const previous = completedState(input, {
        passed: true,
        analysisComplete: true,
        reviewAccepted: true,
        remediationStatus: 'not-attempted',
        base,
        fingerprint: input.fingerprint,
        changed: ['yarn.lock'],
        testsRun: true,
    }, {
        runId: '1',
        prNumber: '2',
        prHeadSha: head,
        now,
    });
    const pr = {
        base: {
            ref: 'main',
        },
        state: 'open',
        user: {
            login: 'github-actions[bot]',
        },
        head: {
            sha: head,
            repo: {
                full_name: input.repository,
            },
        },
        body: '<!-- dotcom-dependency-maintenance:v1 -->',
    };
    assert.equal(await shouldRun(input, previous, {
        now,
        baseBranch: 'main',
        readPR: async() => pr,
    }), false);
    assert.equal(await shouldRun(input, previous, {
        now,
        baseBranch: 'main',
        readPR: async() => ({
            ...pr,
            state: 'closed',
        }),
    }), true);
    assert.equal(await shouldRun(input, previous, {
        now,
        baseBranch: 'main',
        readPR: async() => ({
            ...pr,
            head: {
                ...pr.head,
                sha: base,
            },
        }),
    }), true);
    assert.equal(await shouldRun(input, previous, {
        now,
        baseBranch: 'main',
        readPR: async() => { throw new Error('Unavailable'); },
    }), true);
});

test('retargeted or unspecified maintenance bases never suppress a run', async() => {
    const input = await prepare(sample(), options);
    const previous = completedState(input, {
        passed: true,
        analysisComplete: true,
        reviewAccepted: true,
        remediationStatus: 'not-attempted',
        base,
        fingerprint: input.fingerprint,
        changed: ['yarn.lock'],
        testsRun: true,
    }, {
        runId: '1',
        prNumber: '2',
        prHeadSha: head,
        now,
    });
    const pr = {
        state: 'open',
        user: {
            login: 'github-actions[bot]',
        },
        head: {
            sha: head,
            repo: {
                full_name: input.repository,
            },
        },
        base: {
            ref: 'release',
        },
        body: '<!-- dotcom-dependency-maintenance:v1 -->',
    };
    assert.equal(await shouldRun(input, previous, {
        now,
        baseBranch: 'main',
        readPR: async() => pr,
    }), true);
    assert.equal(await shouldRun(input, previous, {
        now,
        readPR: async() => pr,
    }), true);
});

test('structured decisions cannot change inventory and must explain changed pins and evidence targets', async() => {
    const input = await prepare(sample(), options);
    const proposal = {
        schemaVersion: 1,
        packages: [{
            name: 'thing',
            ecosystem: 'npm',
            recommendations: [{
                targetVersion: '1.0.2',
                pinVersion: '1.0.2',
                compatibility: 'Within parent constraint',
                action: 'Upgrade pin',
            }],
        }],
        changes: [{
            field: 'resolutions',
            name: 'thing',
            reason: 'Both advisories',
            compatibility: 'Review parent paths',
        }],
    };
    const manifest = structuredClone(input.manifest);
    manifest.resolutions.thing = '1.0.2';
    const t = applyProposal(input, proposal, manifest);
    assert.equal(t.packages[0].highestSeverity, 'critical');
    assert.equal(t.packages[0].alerts.length, 2);
    assert.ok(t.upgradeNotes[0].includes('1.0.0 → 1.0.2'));
    proposal.packages[0].recommendations[0].targetVersion = '99.0.0';
    assert.throws(() => applyProposal(input, proposal, manifest), /registry evidence/);
    proposal.packages[0].recommendations[0].targetVersion = '1.0.2';
    proposal.packages[0].recommendations[0].applicableFromVersions = ['2.0.0'];
    assert.throws(() => applyProposal(input, proposal, manifest), /forward-fix branch/);
    assert.throws(() => applyProposal(input, {
        schemaVersion: 1,
    }, manifest), /missing explicit decisions/);
});

test('reports include every unresolved alert and assess all lockfile copies', async() => {
    const e = sample();
    const input = await prepare(e, options);
    const t = applyProposal(input, {
        schemaVersion: 1,
        packages: [{
            name: 'thing',
            ecosystem: 'npm',
            recommendations: [{
                action: 'Defer thing pending parent compatibility review',
            }],
        }],
    }, input.manifest);
    const unchanged = assess(e, t, e.files['yarn.lock'].data.content);
    const body = renderBody(e, renderReport(t), unchanged);
    assert.ok(body.includes('**2 findings are NOT fixed'));
    assert.ok(body.includes('/dependabot/1'));
    assert.ok(body.includes('/dependabot/2'));
    const fixedLock = e.files['yarn.lock'].data.content.replaceAll('1.0.0', '1.0.2');
    assert.ok(assess(e, t, fixedLock).every((o) => o.outcome === 'expected-fixed'));
    const mixed = `${fixedLock}\n${YAML.stringify({
        'thing@npm:old': {
            version: '1.0.0',
            resolution: 'thing@npm:1.0.0',
        },
    })}`;
    assert.ok(assess(e, t, mixed).every((o) => o.outcome === 'unresolved'));
});

test('render CLI generates JSON, Markdown and exact PR body from one proposal', async() => {
    const directory = await mkdtemp(join(tmpdir(), 'maintenance-report-'));
    try {
        const e = sample();
        const input = await prepare(e, options);
        await mkdir(join(directory, 'triage-results'));
        for (const [name, value] of Object.entries({
            'evidence.json': e,
            'agent-input.json': input,
            'proposal.json': {
                schemaVersion: 1,
                packages: input.triage.packages.map((p) => ({
                    name: p.name,
                    ecosystem: p.ecosystem,
                    recommendations: [{
                        action: 'Deferred thing upgrade: parent compatibility requires a separate review',
                    }],
                })),
                changes: [],
            },
        })) {
            await writeFile(join(directory, 'triage-results', name), JSON.stringify(value));
        }
        await writeFile(join(directory, 'package.json'), JSON.stringify(input.manifest));
        await writeFile(join(directory, 'yarn.lock'), e.files['yarn.lock'].data.content);
        const result = spawnSync(process.execPath, [fileURLToPath(new URL('../ci/dependency-maintenance.mjs', import.meta.url)), 'render'],
            {
                cwd: directory,
                encoding: 'utf8',
            });
        assert.equal(result.status, 0, result.stderr);
        const report = await readFile(join(directory, 'triage-results/weekly-report.md'), 'utf8');
        const t = JSON.parse(await readFile(join(directory, 'triage-results/triage.json'), 'utf8'));
        assert.equal(report, renderReport(t));
        assert.equal(await readFile(join(directory, 'triage-results/pr-body.md'), 'utf8'), renderBody(e, report, assess(e, t, e.files['yarn.lock'].data.content)));
    } finally { await rm(directory, {
        recursive: true,
        force: true,
    }); }
});

test('post-agent validation accepts a no-change report and rejects report tampering', async() => {
    const directory = await mkdtemp(join(tmpdir(), 'maintenance-validation-'));
    try {
        const e = sample();
        await writeFile(join(directory, 'package.json'), JSON.stringify(e.files['package.json'].data.content));
        await writeFile(join(directory, 'yarn.lock'), e.files['yarn.lock'].data.content);
        await writeFile(join(directory, '.gitignore'), 'triage-results/\n');
        const git = (args) => {
            const result = spawnSync('git', args, {
                cwd: directory,
                encoding: 'utf8',
            });
            assert.equal(result.status, 0, result.stderr);
            return result.stdout.trim();
        };
        git(['init', '--quiet']);
        git(['add', 'package.json', 'yarn.lock', '.gitignore']);
        git(['-c', 'user.name=Maintenance test', '-c', 'user.email=maintenance@example.invalid',
            '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Fixture baseline']);
        e.baseline.data.sha = git(['rev-parse', 'HEAD']);
        const input = await prepare(e, options);
        await mkdir(join(directory, 'triage-results'));
        for (const [name, value] of Object.entries({
            'evidence.json': e,
            'agent-input.json': input,
            'proposal.json': {
                schemaVersion: 1,
                packages: [{
                    name: 'thing',
                    ecosystem: 'npm',
                    recommendations: [{
                        action: 'Deferred thing: parent compatibility needs review',
                    }],
                }],
                changes: [],
            },
        })) {
            await writeFile(join(directory, 'triage-results', name), JSON.stringify(value));
        }
        const run = (command) => spawnSync(process.execPath,
            [fileURLToPath(new URL('../ci/dependency-maintenance.mjs', import.meta.url)), command],
            {
                cwd: directory,
                encoding: 'utf8',
                env: {
                    ...process.env,
                    GITHUB_SHA: input.baselineSha,
                },
            });
        let result = run('render');
        assert.equal(result.status, 0, result.stderr);
        result = run('validate');
        assert.equal(result.status, 0, result.stderr);
        const validation = JSON.parse(await readFile(join(directory, 'triage-results/validation.json'), 'utf8'));
        assert.equal(validation.passed, true);
        assert.equal(validation.testsRun, false);
        assert.equal(validation.remediationStatus, 'not-attempted');
        assert.equal(validation.fingerprint, input.fingerprint);
        await writeFile(join(directory, 'triage-results/weekly-report.md'), 'Invented success');
        assert.notEqual(run('validate').status, 0);
        assert.equal(JSON.parse(await readFile(join(directory, 'triage-results/validation.json'), 'utf8')).passed, false);
        await mkdir(join(directory, 'triage-results/candidate'));
        await writeFile(join(directory, 'triage-results/candidate/result.json'), JSON.stringify({
            passed: false,
            rolledBack: true,
            failureClass: 'network',
            diagnostic: 'ERR_SOCKET_CLOSED_BEFORE_CONNECTION',
        }));
        result = run('render');
        assert.equal(result.status, 0, result.stderr);
        result = run('validate');
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /Remediation did not complete/);
        const failed = JSON.parse(await readFile(join(directory, 'triage-results/validation.json'), 'utf8'));
        assert.equal(failed.remediationStatus, 'failed');
        assert.equal(failed.passed, false);
        assert.throws(() => completedState(input, {
            ...validation,
            remediationStatus: 'failed',
        }, {
            runId: '1',
        }), /success cache/);

    } finally { await rm(directory, {
        recursive: true,
        force: true,
    }); }
});

test('HTTP backoff honours server delay, adds jitter, and limits retries without retrying auth errors', async() => {
    const delays = [];
    let calls = 0;
    const dependencies = {
        sleep: async(ms) => delays.push(ms),
        random: () => 0.5,
        now: () => now,
        fetcher: async(_url, init) => {
            assert.equal(init.method, 'GET');
            assert.equal(init.redirect, 'error');
            calls += 1;
            return calls < 3 ? new Response('', {
                status: 429,
                headers: {
                    'retry-after': calls === 1 ? '10' : new Date(now + 15000).toUTCString(),
                },
            })
                : new Response('{"ok":true}');
        },
    };
    assert.deepEqual((await readJson('https://example.test', {
    }, dependencies)).data, {
        ok: true,
    });
    assert.deepEqual(delays, [10500, 15500]);
    let failures = 0;
    await assert.rejects(readJson('https://example.test', {
    }, {
        ...dependencies,
        fetcher: async() => { failures += 1; return new Response('', {
            status: 429,
        }); },
    }), /HTTP 429/);
    assert.equal(failures, 3);
    failures = 0;
    await assert.rejects(readJson('https://example.test', {
    }, {
        ...dependencies,
        fetcher: async() => { failures += 1; return new Response('', {
            status: 403,
        }); },
    }), /HTTP 403/);
    assert.equal(failures, 1);
    const before = delays.length;
    await assert.rejects(readJson('https://example.test', {
    }, {
        ...dependencies,
        fetcher: async() => new Response('', {
            status: 429,
            headers: {
                'retry-after': '120',
            },
        }),
    }), /HTTP 429/);
    assert.equal(delays.length, before, 'Never retry earlier than a long server reset');
});

test('replacement cleanup rechecks ownership and replacement before closing older PRs', async() => {
    const pr = (number) => ({
        number,
        state: 'open',
        user: {
            login: 'github-actions[bot]',
        },
        head: {
            repo: {
                full_name: 'example/demo',
            },
        },
        base: {
            ref: 'main',
        },
        title: '[dependency-maintenance] Update',
        body: '<!-- dotcom-dependency-maintenance:v1 -->\n' +
            '## Expected to be fixed by this PR (1)\n\n' +
            '| Package | Severity | Alert | Result / action |\n|---|---|---|---|\n' +
            '| thing | high | [#1](https://github.com/example/demo/security/dependabot/1) | fixed |\n\n## Validation\n',
    });
    const calls = [];
    const closed = await replaceOld('example/demo', 3, async(path, method) => {
        calls.push([path, method || 'GET']);
        if (path.includes('?')) return [pr(1), {
            ...pr(2),
            user: {
                login: 'human',
            },
        }, pr(3)];
        return pr(Number(path.split('/').at(-1)));
    });
    assert.deepEqual(closed, [1]);
    assert.equal(calls.filter(([, method]) => method === 'PATCH').length, 1);
    assert.equal(owned({
        ...pr(1),
        state: 'closed',
    }, 'example/demo', 'main'), false);
});


test('package context files are independently parseable, bounded and retain candidates and parent constraints', async() => {
    const input = await prepare(sample(), options);
    input.gaps = Array.from({
        length: 150,
    }, () => '界'.repeat(100));
    const pages = agentContextPages(input);
    assert.ok(pages.length > 2);
    assert.ok(pages.every((p) => Buffer.byteLength(p) <= 10000));
    const sections = pages.map((p) => JSON.parse(p));
    const records = sections.filter((p) => p.package === 'thing').flatMap((p) => p.records);
    assert.ok(records.some((r) => r.section === 'parent'));
    assert.ok(records.some((r) => r.section === 'candidate' && r.value.version === '1.0.2'));
    assert.equal(sections.flatMap((p) => p.records).filter((r) => r.section === 'gap').length, 150);
    const directory = await mkdtemp(join(tmpdir(), 'agent-context-'));
    try {
        writeAgentContext(input, directory);
        assert.match(await readFile(join(directory, 'index.md'), 'utf8'), /Required package decisions: thing/);
        assert.equal(await readFile(join(directory, 'context-001.json'), 'utf8'), pages[0]);
        input.gaps = ['界'.repeat(10000)];
        assert.throws(() => agentContextPages(input), /One evidence record exceeds/);
    } finally { await rm(directory, {
        recursive: true,
        force: true,
    }); }
});

test('empty, missing and placeholder package decisions cannot establish complete analysis', async() => {
    const input = await prepare(sample(), options);
    for (const packages of [[], [{
        name: 'thing',
        ecosystem: 'npm',
        recommendations: [{
            action: 'Not attempted; requires human investigation',
        }],
    }]]) {
        assert.throws(() => applyProposal(input, {
            schemaVersion: 1,
            packages,
        }, input.manifest), /missing explicit decisions|package-specific decision/);
    }
    assert.throws(() => completedState(input, {
        passed: true,
    }, {
        runId: '1',
    }), /Incomplete analysis/);
    assert.equal(await shouldRun(input, {
        schemaVersion: 1,
        fingerprint: input.fingerprint,
        repository: input.repository,
        baselineSha: input.baselineSha,
        validated: true,
        completedAt: new Date(now).toISOString(),
        outcome: 'noop',
    }, {
        now,
    }), true);
});


test('HTTP retries transient connection failures and timeouts within the same bounded budget', async() => {
    for (const error of [Object.assign(new TypeError('fetch failed'), {
        cause: {
            code: 'ECONNRESET',
        },
    }),
    Object.assign(new Error('timed out'), {
        name: 'TimeoutError',
    })]) {
        let calls = 0;
        const delays = [];
        const deps = {
            fetcher: async() => { calls += 1; if (calls < 3) throw error; return new Response('{"ok":true}'); },
            sleep: async(ms) => delays.push(ms),
            random: () => 0,
        };
        assert.equal((await readJson('https://example.test', {
        }, deps)).data.ok, true);
        assert.deepEqual(delays, [2000, 4000]);
        calls = 0;
        await assert.rejects(readJson('https://example.test', {
        }, {
            ...deps,
            fetcher: async() => { calls += 1; throw error; },
        }), error);
        assert.equal(calls, 3);
    }
    let calls = 0;
    await assert.rejects(readJson('https://example.test', {
    }, {
        fetcher: async() => { calls += 1; throw new TypeError('Invalid URL'); },
        sleep: async() => assert.fail('Permanent request errors must not retry'),
    }), /Invalid URL/);
    assert.equal(calls, 1);
});

function parentUpgradeFixture(parentAlert = false) {
    const e = sample();
    e.files['package.json'].data.content = {
        dependencies: {
            parent: '^2.0.0',
        },
    };
    const entries = YAML.parse(e.files['yarn.lock'].data.content);
    entries['parent@npm:2.0.0'].dependencies.thing = 'npm:^1.0.0';
    e.files['yarn.lock'].data.content = YAML.stringify(entries);
    e.alerts.data = [e.alerts.data[0]];
    e.alerts.data[0].security_vulnerability.vulnerable_version_range = '<2.0.0';
    const paths = [{
        name: 'parent',
        version: '2.0.0',
        resolution: 'parent@npm:2.0.0',
        requestedName: 'thing',
        targetName: 'thing',
        declaredRange: 'npm:^1.0.0',
        constraint: '^1.0.0',
        effectiveVersions: ['1.0.0'],
        pathVerified: true,
        workspace: false,
    }, {
        name: 'app',
        version: '1.0.0',
        resolution: 'app@workspace:.',
        requestedName: 'parent',
        targetName: 'parent',
        declaredRange: 'npm:^2.0.0',
        constraint: '^2.0.0',
        effectiveVersions: ['2.0.0'],
        pathVerified: true,
        workspace: true,
    }];
    if (parentAlert) {
        const alert = structuredClone(e.alerts.data[0]);
        alert.number = 3;
        alert.dependency.package.name = 'parent';
        alert.security_vulnerability.package.name = 'parent';
        // The currently safe parent still needs another release to fix its child.
        alert.security_vulnerability.vulnerable_version_range = '<2.0.0';
        e.alerts.data.push(alert);
    }
    const reads = [];
    return {
        e,
        paths,
        reads,
        registryRead: async(name) => {
            reads.push(name);
            const versions = name === 'parent' ? ['2.0.0', '2.0.1', '2.0.2', '2.0.3'] : ['1.0.0', '2.0.0'];
            return {
                versions: Object.fromEntries(versions.map((v) => [v, {
                    dependencies: name === 'parent' ? {
                        thing: v === '2.0.2' ? '^2.0.0' : '^1.0.0',
                    } : {
                    },
                }])),
                time: Object.fromEntries(versions.map((v) => [v, '2026-09-01T00:00:00Z'])),
            };
        },
    };
}

test('preparation retains the only compatible middle parent release and the planner uses it', async() => {
    for (const parentAlert of [false, true]) {
        const { e, paths, reads, registryRead } = parentUpgradeFixture(parentAlert);
        const input = await prepare(e, {
            ...options,
            registryRead,
            graph: {
                complete: true,
                source: 'test',
                paths,
            },
        });
        assert.deepEqual(input.releases.parent.filter((r) => r.version !== '2.0.0').map((r) => r.version), ['2.0.1', '2.0.2', '2.0.3']);
        assert.equal(reads.filter((name) => name === 'parent').length, 1, 'Metadata is fetched once and evaluated for both purposes');
        const group = planGroups(input).groups.find((g) => g.name === 'thing');
        assert.ok(group, 'Prepared candidates must yield a remediation group');
        assert.equal(group.edits[0].name, 'parent');
        assert.equal(group.edits[0].value, '2.0.2');
    }
});
