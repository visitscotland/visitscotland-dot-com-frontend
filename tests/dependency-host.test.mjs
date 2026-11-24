import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import YAML from 'yaml';
import { planGroups, proposalFor } from '../ci/dependency-plan.mjs';
import { prepareHost, reviewCheck } from '../ci/dependency-host.mjs';
import { candidateManifest, main as candidateMain } from '../ci/dependency-candidate.mjs';

function inputFixture() {
    const path = {
        name: 'parent',
        version: '1.0.0',
        requestedName: 'thing',
        targetName: 'thing',
        constraint: '^1.0.0',
        declaredRange: 'npm:^1.0.0',
        effectiveVersions: ['1.0.0'],
        pathVerified: true,
    };
    return {
        repository: 'example/demo',
        registryComplete: true,
        fingerprint: 'prepared',
        preparedAt: '2026-11-02T10:00:00Z',
        manifest: {
            name: 'fixture',
            resolutions: {
            },
        },
        pins: [],
        paths: [path],
        releases: {
            thing: [{
                version: '1.0.2',
                applicableFromVersions: ['1.0.0'],
                dependencies: {
                },
                source: 'https://registry.npmjs.org/thing/1.0.2',
            }],
        },
        triage: {
            schemaVersion: 2,
            collectionStatus: 'complete',
            evidenceMode: 'live',
            repository: 'example/demo',
            gaps: [],
            laggingPins: [],
            packages: [{
                name: 'thing',
                ecosystem: 'npm',
                affectedVersions: ['1.0.0'],
                highestSeverity: 'high',
                relationship: 'transitive',
                parents: [path],
                alerts: [{
                    number: 1,
                }],
                sources: [],
                uncertainties: [],
                recommendations: [],
            }],
        },
    };
}

test('planner targets vulnerable descriptors and chooses a prepared parent upgrade instead of safe copies', () => {
    const input = inputFixture();
    input.paths.push({
        ...input.paths[0],
        name: 'safe-parent',
        constraint: '^2.0.0',
        declaredRange: 'npm:^2.0.0',
        effectiveVersions: ['2.0.1'],
    });
    let plan = planGroups(input);
    assert.equal(plan.groups[0].edits[0].name, 'thing@npm:^1.0.0');
    assert.equal(plan.groups[0].edits.length, 1);
    candidateManifest(input, proposalFor(plan, plan.groups), input.manifest);
    input.paths[0].constraint = '^0.9.0';
    input.paths[0].declaredRange = 'npm:^0.9.0';
    input.releases.parent = [{
        version: '1.0.1',
        dependencies: {
            thing: '^1.0.2',
        },
    }];
    input.paths.push({
        ...input.paths[0],
        name: 'app',
        requestedName: 'parent',
        targetName: 'parent',
        constraint: '^1.0.0',
        declaredRange: 'npm:^1.0.0',
        effectiveVersions: ['1.0.0'],
    });
    plan = planGroups(input);
    assert.equal(plan.groups[0].edits[0].name, 'parent');
    assert.equal(plan.groups[0].edits[0].value, '1.0.1');
    input.releases.parent[0].version = '2.0.0';
    assert.equal(planGroups(input).groups.length, 0, 'A parent upgrade must satisfy its own parents');
    input.releases.parent = [];
    assert.equal(planGroups(input).groups.length, 0);
    assert.equal(planGroups(input).packages[0].disposition, 'requires-parent-upgrade');
    input.paths = [];
    assert.equal(planGroups(input).packages[0].disposition, 'unknown-path');
});

function fixture() {
    const root = mkdtempSync(join(tmpdir(), 'maintenance-host-'));
    const git = (args) => {
        const result = spawnSync('git', args, {
            cwd: root,
            encoding: 'utf8',
        });
        assert.equal(result.status, 0, result.stderr);
        return result.stdout.trim();
    };
    const input = inputFixture();
    const lock = YAML.stringify({
        'thing@npm:^1.0.0': {
            version: '1.0.0',
            resolution: 'thing@npm:1.0.0',
        },
        'parent@npm:1.0.0': {
            version: '1.0.0',
            resolution: 'parent@npm:1.0.0',
            dependencies: {
                thing: 'npm:^1.0.0',
            },
        },
    });
    writeFileSync(join(root, '.gitignore'), 'triage-results/\n.yarn/\n');
    writeFileSync(join(root, 'package.json'), JSON.stringify(input.manifest));
    writeFileSync(join(root, 'yarn.lock'), lock);
    writeFileSync(join(root, 'app.vue'), 'protected source');
    git(['init', '--quiet']);
    git(['add', '.']);
    git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Baseline']);
    input.baselineSha = git(['rev-parse', 'HEAD']);
    input.triage.baselineSha = input.baselineSha;
    const evidence = {
        status: 'complete',
        mode: 'live',
        repository: input.repository,
        baseline: {
            data: {
                sha: input.baselineSha,
            },
        },
        files: {
            'package.json': {
                data: {
                    content: input.manifest,
                },
            },
            'yarn.lock': {
                data: {
                    content: lock,
                },
            },
        },
        alerts: {
            data: [{
                number: 1,
                html_url: 'https://example.invalid/1',
                dependency: {
                    package: {
                        name: 'thing',
                        ecosystem: 'npm',
                    },
                },
                security_advisory: {
                    severity: 'high',
                },
                security_vulnerability: {
                    vulnerable_version_range: '<1.0.2',
                },
            }],
        },
    };
    mkdirSync(join(root, 'triage-results'));
    writeFileSync(join(root, 'triage-results/agent-input.json'), JSON.stringify(input));
    writeFileSync(join(root, 'triage-results/evidence.json'), JSON.stringify(evidence));
    mkdirSync(join(root, '.yarn/releases'), {
        recursive: true,
    });
    // Exercise the actual candidate command and renderer; application smoke is
    // replaced at the validation seam, whose real implementation has separate tests.
    writeFileSync(join(root, '.yarn/releases/yarn-4.14.1.cjs'), `
const fs=require('node:fs');
if(process.argv[2]==='info') {
console.log(JSON.stringify({value:'parent@npm:1.0.0',children:{Version:'1.0.0',Dependencies:[{descriptor:'thing@npm:^1.0.0',locator:'thing@npm:1.0.2'}]}}));
console.log(JSON.stringify({value:'thing@npm:1.0.2',children:{Version:'1.0.2'}}));
} else fs.writeFileSync('yarn.lock',fs.readFileSync('yarn.lock','utf8').replaceAll('thing@npm:1.0.0','thing@npm:1.0.2').replace('version: 1.0.0','version: 1.0.2'));
`);
    const calls = [];
    const run = (executable, args, options) => {
        calls.push([executable, ...args]);
        if (args[0]?.endsWith('dependency-maintenance.mjs') && args[1] === 'validate') {
            writeFileSync(join(root, 'triage-results/validation.json'), JSON.stringify({
                passed: true,
                base: input.baselineSha,
                changed: ['package.json', 'yarn.lock'],
                analysisComplete: true,
                remediationStatus: 'succeeded',
                fingerprint: input.fingerprint,
                outcomes: [{
                    before: ['1.0.0'],
                    remaining: [],
                    outcome: 'expected-fixed',
                }],
                testsRun: true,
            }));
            return {
                status: 0,
            };
        }
        return spawnSync(executable, args, options);
    };
    return {
        root,
        input,
        run,
        calls,
    };
}

test('host applies, renders, validates and commits before review; wrong output or tampering cannot complete', () => {
    const { root, run, calls } = fixture();
    try {
        const hash = prepareHost(root, run);
        assert.match(hash, /^[a-f0-9]{64}$/);
        assert.ok(calls.find((args) => args[0] === 'git' && args.includes('commit')));
        assert.ok(readFileSync(join(root, 'triage-results/weekly-report.md'), 'utf8').includes('thing'));
        assert.throws(() => reviewCheck(root, hash, 'noop'), /exactly create_pull_request/);
        assert.throws(() => reviewCheck(root, hash, 'create_pull_request', 'false'), /transport is missing/);
        assert.equal(reviewCheck(root, hash, 'create_pull_request', 'true'), 'create_pull_request');
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/validation.json'))).reviewAccepted, true);
        assert.throws(() => reviewCheck(root, hash, 'create_pull_request'), /changed the host-prepared/);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('empty affected lists are not missing paths and genuine blockers do not suppress verified groups', () => {
    const { root, input, run } = fixture();
    try {
        const safe = structuredClone(input.triage.packages[0]);
        safe.name = 'already-safe';
        safe.affectedVersions = [];
        safe.alerts = [{
            number: 2,
        }];
        const blocked = structuredClone(input.triage.packages[0]);
        blocked.name = 'missing-path';
        blocked.alerts = [{
            number: 3,
        }];
        input.triage.packages.push(safe, blocked);
        const evidencePath = join(root, 'triage-results/evidence.json');
        const evidence = JSON.parse(readFileSync(evidencePath));
        for (const p of [safe, blocked]) {
            const alert = structuredClone(evidence.alerts.data[0]);
            alert.number = p.alerts[0].number;
            alert.dependency.package.name = p.name;
            evidence.alerts.data.push(alert);
        }
        writeFileSync(evidencePath, JSON.stringify(evidence));
        writeFileSync(join(root, 'triage-results/agent-input.json'), JSON.stringify(input));
        const plan = planGroups(input);
        assert.equal(plan.packages.find((p) => p.name === safe.name).disposition, 'not-affected');
        assert.equal(plan.packages.find((p) => p.name === blocked.name).disposition, 'unknown-path');
        prepareHost(root, run);
        const diagnostics = JSON.parse(readFileSync(join(root, 'triage-results/planning.json')));
        assert.deepEqual(diagnostics.blockers, [{
            name: 'missing-path',
            reason: 'unknown-path',
        }]);
        assert.deepEqual(diagnostics.selectedGroups, ['thing']);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('only blocked packages produce a diagnostic report and cannot claim a successful no-op', () => {
    const { root, input, run } = fixture();
    try {
        input.paths = [];
        writeFileSync(join(root, 'triage-results/agent-input.json'), JSON.stringify(input));
        assert.throws(() => prepareHost(root, run), /No verified remediation available.*thing: unknown-path/);
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/validation.json'))).passed, false);
        assert.ok(readFileSync(join(root, 'triage-results/weekly-report.md'), 'utf8').includes('unknown-path'));
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('overlapping selectors are deferred without reordering or changing installed-safe branches', () => {
    const input = inputFixture();
    input.manifest.resolutions = {
        thing: '1.0.0',
    };
    const plan = planGroups(input);
    assert.equal(plan.groups.length, 0);
    assert.equal(plan.packages[0].disposition, 'conflicting-resolutions');
    assert.match(plan.packages[0].recommendations[0].action, /thing@npm:\^1.0.0.*thing/);
    assert.deepEqual(input.manifest.resolutions, {
        thing: '1.0.0',
    });
    input.pins = [{
        name: 'thing',
        selector: 'thing',
    }];
    const reused = planGroups(input);
    assert.equal(reused.groups[0].edits[0].name, 'thing');
    input.paths.push({
        ...input.paths[0],
        name: 'other',
        constraint: '^2.0.0',
        effectiveVersions: ['2.0.1'],
    });
    assert.equal(planGroups(input).groups.length, 0);
});

test('host drops an attributed failed group and retains the independent verified fix', () => {
    const { root, input, run } = fixture();
    try {
        const deferred = structuredClone(input.triage.packages[0]);
        deferred.name = 'broken';
        deferred.alerts = [{
            number: 2,
        }];
        input.triage.packages.push(deferred);
        input.paths.push({
            ...input.paths[0],
            requestedName: 'broken',
            targetName: 'broken',
        });
        input.releases.broken = input.releases.thing;
        const evidencePath = join(root, 'triage-results/evidence.json');
        const evidence = JSON.parse(readFileSync(evidencePath));
        const alert = structuredClone(evidence.alerts.data[0]);
        alert.number = 2; alert.dependency.package.name = 'broken';
        evidence.alerts.data.push(alert);
        writeFileSync(evidencePath, JSON.stringify(evidence));
        writeFileSync(join(root, 'triage-results/agent-input.json'), JSON.stringify(input));
        let attempts = 0;
        prepareHost(root, (exe, args, opts) => {
            if (args[0]?.endsWith('dependency-candidate.mjs')) attempts += 1;
            if (args[0]?.endsWith('dependency-candidate.mjs') && attempts === 1) {
                mkdirSync(join(root, 'triage-results/candidate'), {
                    recursive: true,
                });
                writeFileSync(join(root, 'triage-results/candidate/result.json'), JSON.stringify({
                    passed: false,
                    rolledBack: true,
                    failureClass: 'graph',
                    errors: [{
                        group: 'broken',
                        selector: 'broken@npm:^1.0.0',
                    }],
                }));
                return {
                    status: 1,
                    stderr: 'attributed graph failure',
                };
            }
            return run(exe, args, opts);
        });
        assert.equal(attempts, 2);
        const proposal = JSON.parse(readFileSync(join(root, 'triage-results/proposal.json')));
        assert.deepEqual(proposal.changes.map((e) => e.group), ['thing']);
        assert.match(proposal.packages.find((p) => p.name === 'broken').recommendations[0].action, /deferred/);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('unattributable graph failures stop without guessing another candidate', () => {
    const { root, run } = fixture();
    let attempts = 0;
    try {
        assert.throws(() => prepareHost(root, (exe, args, opts) => {
            if (args[0]?.endsWith('dependency-candidate.mjs')) {
                attempts += 1;
                mkdirSync(join(root, 'triage-results/candidate'), {
                    recursive: true,
                });
                writeFileSync(join(root, 'triage-results/candidate/result.json'), JSON.stringify({
                    passed: false,
                    rolledBack: true,
                    failureClass: 'graph',
                    errors: [],
                    diagnostic: 'Unattributable graph failure',
                }));
                return {
                    status: 1,
                    stderr: 'Unattributable graph failure',
                };
            }
            return run(exe, args, opts);
        }), /Remediation failed/);
        assert.equal(attempts, 1);
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/validation.json'))).passed, false);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('failed host execution always records failure and produces a diagnostic report without invoking a model', () => {
    const { root } = fixture();
    try {
        assert.throws(() => prepareHost(root, () => ({
            status: 1,
            stderr: 'controlled dependency failure',
        })), /controlled dependency failure/);
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/validation.json'))).passed, false);
        assert.match(readFileSync(join(root, 'triage-results/weekly-report.md'), 'utf8'), /failed/);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('rejected selectors and unsupported render commands remain in persisted failure history', () => {
    const { root } = fixture();
    try {
        writeFileSync(join(root, 'triage-results/proposal.json'), '{"schemaVersion":1,"packages":[],"changes":[]}');
        assert.throws(() => candidateMain('apply', root), /missing explicit decisions/);
        assert.throws(() => candidateMain('render', root), /Use apply or restore/);
        assert.throws(() => candidateMain('render', root), /Use apply or restore/);
        assert.throws(() => candidateMain('apply', root), /budget exhausted/);
        const history = JSON.parse(readFileSync(join(root, 'triage-results/candidate/history.json')));
        assert.ok(history.every((entry) => entry.outcome === 'failed'));
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/candidate/result.json'))).passed, false);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('compiled publication skips AI detection and requires the host body; no-op claims must match host evidence', () => {
    const source = YAML.parse(readFileSync(new URL('../.github/workflows/dependency-maintenance-agent.md', import.meta.url), 'utf8').split('---')[1]);
    const compiled = YAML.parse(readFileSync(new URL('../.github/workflows/dependency-maintenance-agent.lock.yml', import.meta.url), 'utf8'));
    assert.equal(source.tools.bash, false);
    assert.equal(source.tools.edit, false);
    assert.equal(source['safe-outputs']['threat-detection'], false);
    assert.equal(compiled.jobs.detection, undefined);
    assert.ok(!compiled.jobs.safe_outputs.needs.includes('detection'));
    assert.match(compiled.jobs.safe_outputs.if, /has_patch == 'true'/);
    assert.match(compiled.jobs.safe_outputs.if, /needs.agent.result == 'success'/);
    const script = source.jobs.safe_outputs['pre-steps'].at(-1).with.script;
    const core = {
        info() {},
    };
    const hostBody = '<!-- dotcom-dependency-maintenance:v1 -->\nHost body: @nuxt/scripts@1.3.12\n';
    const transportedBody = 'Host body: @nuxt/scripts@1.3.12';
    let runtimeCore;
    const execute = (body, passed = true, overrides = {
    }) => runInNewContext(script, {
        core,
        github: {
        },
        context: {
        },
        exec: {
        },
        io: {
        },
        getOctokit() {},
        process: {
            env: {
                RUNNER_TEMP: '/runtime',
            },
        },
        require: (name) => {
            if (name === 'node:fs') return {
                readFileSync: (path) => path.endsWith('validation.json') ? JSON.stringify({
                    passed,
                    reviewAccepted: true,
                    changed: ['package.json'],
                    branch: 'host-branch',
                })
                    : path.endsWith('agent_output.json') ? JSON.stringify({
                        items: [{
                            type: 'create_pull_request',
                            title: 'Dependency security and pin refresh',
                            branch: 'host-branch',
                            ...overrides,
                            body,
                        }],
                    }) : hostBody,
            };
            if (name.endsWith('setup_globals.cjs')) return {
                setupGlobals: (providedCore) => { runtimeCore = providedCore; },
            };
            if (name.endsWith('sanitize_content.cjs')) return {
                sanitizeContent: (value, options) => {
                    assert.equal(runtimeCore, core, 'Sanitizer requires initialized framework globals');
                    runtimeCore.info('Sanitizing body');
                    assert.equal(options?.deferMentions, true, 'Collector preserves scoped package names until publication');
                    return value.replace(/<!--.*?-->/g, '').trim();
                },
            };
            if (name === 'node:assert/strict') return assert;
            if (name === 'node:path') return {
                join: (...parts) => parts.join('/'),
            };
            throw new Error(name);
        },
    });
    execute(hostBody);
    execute(transportedBody);
    assert.throws(() => execute('invented body'), /differs/);
    assert.throws(() => execute(transportedBody.replace('1.3.12', '9.9.9')), /differs/);
    assert.throws(() => execute(hostBody, false));
    assert.throws(() => execute(hostBody, true, {
        branch: 'invented-branch',
    }));
    assert.throws(() => execute(hostBody, true, {
        title: 'All findings fixed',
    }));
});


test('no-op publication cannot contradict the host unresolved-finding summary', () => {
    const source = YAML.parse(readFileSync(new URL('../.github/workflows/dependency-maintenance-agent.md', import.meta.url), 'utf8').split('---')[1]);
    const script = source.jobs.conclusion['pre-steps'].at(-1).with.script;
    const execute = (message) => runInNewContext(script, {
        require: (name) => {
            if (name === 'node:assert/strict') return assert;
            if (name === 'node:fs') return {
                readFileSync: (path) => path.endsWith('validation.json')
                    ? JSON.stringify({
                        passed: true,
                        reviewAccepted: true,
                        changed: [],
                        noopMessage: 'Host: unresolved findings remain',
                    })
                    : JSON.stringify({
                        items: [{
                            type: 'noop',
                            message,
                        }],
                    }),
            };
            throw new Error(name);
        },
    });
    execute('Host: unresolved findings remain');
    assert.throws(() => execute('All dependencies are safe'));
});
