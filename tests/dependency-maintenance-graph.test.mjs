import test from 'node:test';
import assert from 'node:assert/strict';
import {
    mkdtemp, mkdir, writeFile, readFile, rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import YAML from 'yaml';
import {
    parseGraph, matchingPaths, resolutionSelector, assessResolution, assertPinEvidence, verifyGraphChanges,
} from '../ci/dependency-graph.mjs';
import { releaseCandidates } from '../ci/prepare-dependency-maintenance.mjs';
import {
    checkNodeVersion, checkInstalledRuntime, prepareSmokeRuntime,
} from '../ci/dependency-runtime.mjs';

const now = Date.parse('2026-10-30T12:00:00Z');
const release = (versions) => ({
    versions: Object.fromEntries(versions.map((v) => [v, {
        engines: {
            node: '>=20',
        },
    }])),
    time: Object.fromEntries(versions.map((v) => [v, '2026-09-01T00:00:00Z'])),
});
const path = (name, constraint, version, requestedName = 'undici') => ({
    name,
    version: '1.0.0',
    resolution: `${name}@npm:1.0.0`,
    parentReference: 'npm:1.0.0',
    requestedName,
    targetName: requestedName,
    declaredRange: `npm:${constraint}`,
    constraint,
    effectiveVersions: [version],
    pathVerified: true,
    workspace: false,
});

function graphFixture() {
    const entries = {
        'node-gyp@npm:12.3.0': {
            version: '12.3.0',
            resolution: 'node-gyp@npm:12.3.0',
            dependencies: {
                undici: 'npm:^6.25.0',
            },
        },
        'nuxt@npm:4.6.2': {
            version: '4.6.2',
            resolution: 'nuxt@npm:4.6.2',
            dependencies: {
                undici: 'npm:^8.12.1',
            },
        },
        'external-editor@npm:3.1.0': {
            version: '3.1.0',
            resolution: 'external-editor@npm:3.1.0',
            dependencies: {
                tmp: 'npm:^0.0.33',
            },
        },
        '@scope/parent@npm:1.0.0': {
            version: '1.0.0',
            resolution: '@scope/parent@npm:1.0.0',
            dependencies: {
                '@scope/child': 'npm:^2.0.0',
            },
        },
        'undici@npm:6.29.0': {
            version: '6.29.0',
            resolution: 'undici@npm:6.29.0',
        },
        'undici@npm:8.12.2': {
            version: '8.12.2',
            resolution: 'undici@npm:8.12.2',
        },
        'tmp@npm:0.2.6': {
            version: '0.2.6',
            resolution: 'tmp@npm:0.2.6',
        },
        '@scope/child@npm:2.0.2': {
            version: '2.0.2',
            resolution: '@scope/child@npm:2.0.2',
        },
    };
    const nodes = Object.values(entries).map((entry) => ({
        value: entry.resolution,
        children: {
            Version: entry.version,
            Dependencies: Object.entries(entry.dependencies || {
            }).map(([name]) => {
                const target = name === 'undici' ? entry.resolution.startsWith('nuxt@') ? '8.12.2' : '6.29.0'
                    : name === 'tmp' ? '0.2.6' : '2.0.2';
                return {
                    descriptor: `${name}@npm:${target}`,
                    locator: `${name}@npm:${target}`,
                };
            }),
        },
    }));
    nodes.push({
        ...nodes[0],
        value: 'node-gyp@virtual:abc#npm:12.3.0',
    });
    return parseGraph(nodes.map((n) => JSON.stringify(n)).join('\n'), YAML.stringify(entries));
}

test('installed graph recovers original constraints despite rewritten descriptors and deduplicates peer virtualisations', () => {
    const graph = graphFixture();
    assert.equal(graph.paths.length, 4);
    const pin = assessResolution('undici@npm:^6.25.0', '6.29.0', graph);
    assert.equal(pin.status, 'no-parent-mismatch');
    assert.deepEqual(pin.effectiveVersions, ['6.29.0']);
    assert.equal(pin.parents[0].constraint, '^6.25.0');
    assert.equal(pin.parents[0].name, 'node-gyp');
    assert.ok(!pin.effectiveVersions.includes('8.12.2'));
});

test('parent-scoped selectors are assessed, unused selectors distinguished, and overrides disclosed', () => {
    const graph = graphFixture();
    assert.equal(assessResolution('external-editor/tmp', '0.2.6', graph).status, 'constraint-override');
    assert.equal(assessResolution('simple-git', '4.0.2', graph).status, 'unused');
    assert.equal(assessResolution('@scope/parent/@scope/child', '2.0.2', graph).status, 'no-parent-mismatch');
    assert.equal(matchingPaths('@scope/parent@npm:1.0.0/@scope/child@npm:^2.0.0', graph.paths).length, 1);
    assert.equal(matchingPaths('node-gyp/tmp', graph.paths).length, 0);
    assert.equal(resolutionSelector('grand/parent/child'), null);
    assert.equal(assessResolution('grand/parent/child', '1.0.0', graph).status, 'unassessed');
});

test('a lower effective pin is classified as parent-requires-newer, not a verified unpinned install', () => {
    const graph = {
        complete: true,
        source: 'test',
        paths: [path('parent', '^6.29.1', '6.29.0')],
    };
    const pin = assessResolution('parent/undici', '6.29.0', graph);
    assert.equal(pin.status, 'parent-requires-newer');
    assert.equal(pin.mismatches[0].constraint, '^6.29.1');
});

test('unknown matching paths block a changed pin; unused pin removal and known new selectors are supported', () => {
    const input = {
        pins: [{
            selector: 'unused',
            status: 'unused',
        }],
        paths: graphFixture().paths,
    };
    assert.doesNotThrow(() => assertPinEvidence(input, 'resolutions', 'unused', undefined));
    assert.doesNotThrow(() => assertPinEvidence(input, 'resolutions', 'external-editor/tmp', '0.2.7'));
    assert.throws(() => assertPinEvidence(input, 'resolutions', 'parent/unknown', '1.0.0'), /verified parent paths/);
    assert.throws(() => assertPinEvidence({
        pins: [],
        paths: [{
            ...input.paths[0],
            pathVerified: false,
        }],
    },
    'resolutions', 'undici', '6.29.1'), /verified parent paths/);
});

test('post-install graph validation rejects ineffective pins and downgrades on an unchanged parent path', () => {
    const graph = graphFixture();
    const input = {
        pins: [],
        paths: graph.paths,
        manifest: {
            resolutions: {
            },
        },
    };
    assert.throws(() => verifyGraphChanges(input, {
        resolutions: {
            'external-editor/tmp': '0.2.7',
        },
    }, graph), /did not take effect/);
    const downgrade = structuredClone(graph);
    downgrade.paths.find((p) => p.name === 'node-gyp').effectiveVersions = ['6.28.0'];
    assert.throws(() => verifyGraphChanges(input, {
        resolutions: {
        },
    }, downgrade), /downgrades undici/);
    assert.doesNotThrow(() => verifyGraphChanges(input, {
        resolutions: {
        },
    }, graph));
});

test('security candidates use the smallest forward patch independently for affected 6.x and 8.x paths', () => {
    const candidates = releaseCandidates('undici', release(['0.1.0', '6.29.0', '6.29.1', '6.29.2', '7.30.1', '8.12.1', '8.12.2', '8.12.3']),
        ['6.29.0', '8.12.1'], ['>=4 <6.29.1', '>=7 <7.30.1', '>=8 <8.12.2'], {
            now,
            nodeVersion: '24.22.2',
            parents: [path('node-gyp', '^6.25.0', '6.29.0'), path('nuxt', '^8.12.1', '8.12.1')],
        });
    assert.deepEqual(candidates.map((c) => c.version), ['6.29.1', '8.12.2']);
    assert.deepEqual(candidates[0].applicableFromVersions, ['6.29.0']);
    assert.deepEqual(candidates[1].applicableFromVersions, ['8.12.1']);
    assert.ok(candidates.every((c) => c.compatibility === 'within-parent-constraints'));
});

test('deepmerge historical downgrades are never emitted as fixes', () => {
    const candidates = releaseCandidates('deepmerge', release(['0.2.1', '4.0.0', '4.1.2', '4.3.1']), ['4.3.1'], ['>=4.2.0 <=4.3.1'], {
        now,
        nodeVersion: '24.22.2',
        parents: [path('@rollup/plugin-node-resolve', '^4.2.2', '4.3.1', 'deepmerge')],
    });
    assert.deepEqual(candidates, []);
});

test('existing safe branch reuse preserves the parent-update disclosure for the vulnerable branch', () => {
    const candidates = releaseCandidates('nanoid', release(['2.1.11', '3.3.18', '3.3.20', '6.0.2']), ['2.1.11', '3.3.20'], ['<3.3.18'], {
        now,
        nodeVersion: '24.22.2',
        parents: [path('shortid', '^2.1.0', '2.1.11', 'nanoid')],
    });
    assert.deepEqual(candidates.map((c) => c.version), ['3.3.20']);
    assert.equal(candidates[0].compatibility, 'requires-parent-update');
    assert.ok(candidates[0].applicableFromVersions.includes('2.1.11'));
});

test('pre-1.0 minor boundaries are separate branches and parent overrides stay explicit', () => {
    const candidates = releaseCandidates('tmp', release(['0.0.33', '0.2.6', '0.2.7', '0.3.0']), ['0.2.6'], ['>=0.2.6 <0.2.7'], {
        now,
        nodeVersion: '24.22.2',
        parents: [path('external-editor', '^0.0.33', '0.2.6', 'tmp')],
    });
    assert.deepEqual(candidates.map((c) => c.version), ['0.2.7']);
    assert.equal(candidates[0].compatibility, 'parent-constraint-override');
});

test('runtime setup regenerates the marker from the installed library without running lifecycle scripts', async() => {
    const root = await mkdtemp(join(tmpdir(), 'maintenance-runtime-'));
    try {
        await writeFile(join(root, '.nvmrc'), `${process.versions.node}\n`);
        await mkdir(join(root, 'node_modules/nuxt'), {
            recursive: true,
        });
        await writeFile(join(root, 'node_modules/nuxt/package.json'), JSON.stringify({
            version: '4.6.2',
            engines: {
                node: '>=20',
            },
        }));
        await mkdir(join(root, 'node_modules/@visitscotland/component-library'), {
            recursive: true,
        });
        const library = join(root, 'node_modules/@visitscotland/component-library/package.json');
        await writeFile(library, JSON.stringify({
            version: '5.82.2',
            scripts: {
                postinstall: 'must-not-run',
            },
        }));
        await prepareSmokeRuntime(root);
        assert.equal(await readFile(join(root, '.clversion'), 'utf8'), '5.82.2\n');
        await writeFile(library, JSON.stringify({
            version: '5.83.0',
        }));
        await prepareSmokeRuntime(root);
        assert.equal(await readFile(join(root, '.clversion'), 'utf8'), '5.83.0\n');
        assert.throws(() => checkNodeVersion(root, '1.0.0'), /differs from .nvmrc/);
        await writeFile(join(root, 'node_modules/nuxt/package.json'), JSON.stringify({
            version: '4.6.2',
            engines: {
                node: '>=99',
            },
        }));
        await assert.rejects(checkInstalledRuntime(root), /requires Node/);
    } finally { await rm(root, {
        recursive: true,
        force: true,
    }); }
});
