import test from 'node:test';
import assert from 'node:assert/strict';
import {
    mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
    candidateManifest, installCandidate, reserveAttempt, main,
} from '../ci/dependency-candidate.mjs';

function fixture() {
    const input = {
        manifest: {
            dependencies: {
                thing: '1.0.0',
            },
        },
        releases: {
            thing: [{
                version: '1.0.2',
                applicableFromVersions: ['1.0.0'],
            }],
        },
        pins: [],
        triage: {
            packages: [{
                name: 'thing',
                ecosystem: 'npm',
                sources: [],
            }],
        },
    };
    const proposal = {
        schemaVersion: 1,
        packages: [{
            name: 'thing',
            ecosystem: 'npm',
            recommendations: [{
                action: 'Update thing using the verified patch',
            }],
        }],
        changes: [{
            field: 'dependencies',
            name: 'thing',
            value: '1.0.2',
            reason: 'Security patch',
            compatibility: 'Within parent range',
        }],
    };
    return {
        input,
        proposal,
    };
}

test('structured edits preserve scripts and JSON syntax and reject invented targets before mutation', () => {
    const { input, proposal } = fixture();
    const manifest = {
        ...input.manifest,
        scripts: {
            build: 'nuxt build',
        },
    };
    const result = candidateManifest(input, proposal, manifest);
    assert.equal(result.dependencies.thing, '1.0.2');
    assert.deepEqual(result.scripts, manifest.scripts);
    assert.equal(manifest.dependencies.thing, '1.0.0');
    assert.deepEqual(JSON.parse(JSON.stringify(result)), result);
    for (const value of ['latest', '^1.0.2', '99.0.0', null]) {
        assert.throws(() => candidateManifest(input, {
            ...proposal,
            changes: [{
                ...proposal.changes[0],
                value,
            }],
        }, manifest));
    }
    assert.throws(() => candidateManifest(input, {
        ...proposal,
        changes: [{
            ...proposal.changes[0],
            field: 'scripts',
        }],
    }, manifest));
});

test('global resolution cannot downgrade another installed release branch', () => {
    const { input, proposal } = fixture();
    input.paths = [{
        requestedName: 'thing',
        targetName: 'thing',
        effectiveVersions: ['2.0.0'],
    }];
    proposal.changes[0].field = 'resolutions';
    assert.throws(() => candidateManifest(input, proposal, input.manifest), /downgrade an installed branch|parent constraint/);
});

test('one initial install and two distinct repairs are allowed, identical candidates are not retried', () => {
    let state = {
        attempts: 0,
        hashes: [],
    };
    state = reserveAttempt(state, 'first');
    assert.throws(() => reserveAttempt(state, 'first'), /Identical candidate/);
    state = reserveAttempt(state, 'second');
    state = reserveAttempt(state, 'third');
    assert.throws(() => reserveAttempt(state, 'fourth'), /budget exhausted/);
});

test('install failure returns bounded diagnostics, persists attempts before launch and restores retained files', () => {
    const root = mkdtempSync(join(tmpdir(), 'candidate-run-'));
    try {
        mkdirSync(join(root, 'triage-results/candidate'), {
            recursive: true,
        });
        writeFileSync(join(root, 'package.json'), '{"dependencies":{"thing":"1.0.2"}}');
        writeFileSync(join(root, 'yarn.lock'), 'candidate lock');
        const state = {
            attempts: 0,
            hashes: [],
            manifest: '{"dependencies":{"thing":"1.0.0"}}',
            lock: 'retained lock',
        };
        let calls = 0;
        const run = (executable, args, options) => {
            calls += 1;
            assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/candidate/state.json'))).attempts, 1);
            assert.ok(args.includes('--mode=skip-build'));
            assert.equal(options.timeout, 180000);
            writeFileSync(options.stdio[1], `${'noisy log\n'.repeat(10000)}YN0082: No candidates found\n`);
            return {
                status: 1,
            };
        };
        const result = installCandidate(root, state, run);
        assert.equal(result.passed, false);
        assert.equal(result.rolledBack, true);
        assert.ok(result.diagnostic.length <= 4000);
        assert.match(result.diagnostic, /YN0082/);
        assert.equal(readFileSync(join(root, 'yarn.lock'), 'utf8'), state.lock);
        assert.equal(readFileSync(join(root, 'package.json'), 'utf8'), state.manifest);
        const persisted = JSON.parse(readFileSync(join(root, 'triage-results/candidate/state.json')));
        writeFileSync(join(root, 'package.json'), '{"dependencies":{"thing":"1.0.2"}}');
        assert.throws(() => installCandidate(root, persisted, run), /Identical candidate/);
        assert.equal(calls, 1);
        writeFileSync(join(root, 'package.json'), '{"dependencies":{"thing":"1.0.3"}}');
        const timedOut = installCandidate(root, persisted, () => ({
            status: null,
            signal: 'SIGTERM',
            error: {
                code: 'ETIMEDOUT',
            },
        }));
        assert.equal(timedOut.error, 'ETIMEDOUT');
        assert.equal(timedOut.attempt, 2);
        assert.equal(timedOut.rolledBack, true);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('successful regeneration retains the exact final manifest and lockfile', () => {
    const root = mkdtempSync(join(tmpdir(), 'candidate-success-'));
    try {
        mkdirSync(join(root, 'triage-results/candidate'), {
            recursive: true,
        });
        writeFileSync(join(root, 'package.json'), '{"dependencies":{"thing":"1.0.2"}}');
        writeFileSync(join(root, 'yarn.lock'), 'old lock');
        const result = installCandidate(root, {
            attempts: 0,
            hashes: [],
            manifest: '{}',
            lock: 'baseline',
        }, () => {
            writeFileSync(join(root, 'yarn.lock'), 'resolved lock');
            return {
                status: 0,
            };
        }, () => {});
        assert.equal(result.passed, true);
        const state = JSON.parse(readFileSync(join(root, 'triage-results/candidate/state.json')));
        assert.equal(state.lock, 'resolved lock');
        assert.equal(state.manifest, readFileSync(join(root, 'package.json'), 'utf8'));
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});


test('graph failure restores the last validated checkpoint and consumes the attempt', () => {
    const root = mkdtempSync(join(tmpdir(), 'candidate-graph-'));
    try {
        mkdirSync(join(root, 'triage-results/candidate'), {
            recursive: true,
        });
        const baseline = {
            attempts: 0,
            hashes: [],
            manifest: '{"name":"baseline"}',
            lock: 'baseline lock',
        };
        writeFileSync(join(root, 'package.json'), '{"name":"candidate"}');
        writeFileSync(join(root, 'yarn.lock'), 'candidate lock');
        writeFileSync(join(root, 'triage-results/proposal.json'), JSON.stringify({
            changes: [{
                name: 'parent/thing',
                group: 'thing',
            }],
        }));
        const result = installCandidate(root, baseline, () => ({
            status: 0,
        }), () => {
            const error = new Error('Resolution did not take effect');
            error.details = [{
                selector: 'parent/thing',
                expected: '1.0.2',
                actualVersions: ['1.0.0'],
            }];
            throw error;
        });
        assert.equal(result.failureClass, 'graph');
        assert.equal(result.errors[0].group, 'thing');
        assert.deepEqual(result.errors[0].actualVersions, ['1.0.0']);
        assert.equal(result.rolledBack, true);
        const saved = JSON.parse(readFileSync(join(root, 'triage-results/candidate/state.json')));
        assert.equal(saved.attempts, 1);
        assert.equal(saved.manifest, baseline.manifest);
        assert.equal(saved.lock, baseline.lock);
        assert.equal(readFileSync(join(root, 'package.json'), 'utf8'), baseline.manifest);
        assert.equal(readFileSync(join(root, 'yarn.lock'), 'utf8'), baseline.lock);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});

test('apply command regenerates via the checked-in runner and restore never resets its budget', () => {
    const root = mkdtempSync(join(tmpdir(), 'candidate-command-'));
    try {
        const { input, proposal } = fixture();
        input.baselineSha = 'a'.repeat(40);
        input.fingerprint = 'prepared-input';
        mkdirSync(join(root, 'triage-results'), {
            recursive: true,
        });
        mkdirSync(join(root, '.yarn/releases'), {
            recursive: true,
        });
        writeFileSync(join(root, 'package.json'), JSON.stringify(input.manifest));
        writeFileSync(join(root, 'yarn.lock'), 'baseline lock');
        writeFileSync(join(root, 'triage-results/agent-input.json'), JSON.stringify(input));
        writeFileSync(join(root, 'triage-results/proposal.json'), JSON.stringify(proposal));
        const regeneratedLock = JSON.stringify({
            'fixture@workspace:.': {
                resolution: 'fixture@workspace:.',
                version: '1.0.0',
                dependencies: {
                    thing: 'npm:1.0.2',
                },
            },
            'thing@npm:1.0.2': {
                resolution: 'thing@npm:1.0.2',
                version: '1.0.2',
            },
        });
        writeFileSync(join(root, '.yarn/releases/yarn-4.14.1.cjs'),
            `if(process.argv[2]==='info') console.log(JSON.stringify({value:'fixture@workspace:.',children:{Version:'1.0.0',Dependencies:[{descriptor:'thing@npm:1.0.2',locator:'thing@npm:1.0.2'}]}})); else require('node:fs').writeFileSync('yarn.lock',${JSON.stringify(regeneratedLock)});`);
        main('apply', root);
        assert.equal(JSON.parse(readFileSync(join(root, 'package.json'))).dependencies.thing, '1.0.2');
        assert.equal(readFileSync(join(root, 'yarn.lock'), 'utf8'), regeneratedLock);
        assert.throws(() => main('apply', root), /Identical candidate/);
        main('restore', root);
        assert.equal(JSON.parse(readFileSync(join(root, 'triage-results/candidate/state.json'))).attempts, 1);
    } finally { rmSync(root, {
        recursive: true,
        force: true,
    }); }
});


test('selectors covering only already-safe copies are rejected before installation', () => {
    const { input, proposal } = fixture();
    input.triage.packages[0].affectedVersions = ['1.0.0'];
    input.paths = [{
        requestedName: 'thing',
        targetName: 'thing',
        effectiveVersions: ['1.0.2'],
        constraint: '^1.0.2',
        pathVerified: true,
    }];
    proposal.changes[0].field = 'resolutions';
    assert.throws(() => candidateManifest(input, proposal, input.manifest), /already-safe copies/);
});
