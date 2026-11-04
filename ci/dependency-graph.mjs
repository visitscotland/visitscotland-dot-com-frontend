import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';
import semver from 'semver';

export function locator(value) {
    const match = typeof value === 'string' && value.match(/^((?:@[^/]+\/)?[^@/]+)@(.+)$/);
    if (!match) return null;
    const reference = match[2].replace(/^virtual:[^#]+#/, '');
    return {
        name: match[1],
        reference,
        resolution: `${match[1]}@${reference}`,
    };
}

export function resolutionSelector(value) {
    const match = typeof value === 'string' && value.match(/^(?:(?<parent>(?:@[^/]+\/)?[^/@]+)(?:@(?<parentReference>[^/]+))?\/)?(?<name>(?:@[^/]+\/)?[^/@]+)(?:@(?<range>.+))?$/);
    return match?.groups ? {
        ...match.groups,
    } : null;
}

const withoutNpm = (value) => typeof value === 'string' ? value.replace(/^npm:/, '') : '';
export function matchingPaths(selector, paths) {
    const parsed = resolutionSelector(selector);
    if (!parsed) return null;
    return paths.filter((p) => p.requestedName === parsed.name
        && (!parsed.parent || p.name === parsed.parent)
        && (!parsed.parentReference || withoutNpm(p.parentReference) === withoutNpm(parsed.parentReference))
        && (!parsed.range || withoutNpm(p.declaredRange) === withoutNpm(parsed.range)));
}

export function parseGraph(ndjson, lockText) {
    const entries = Object.values(YAML.parse(lockText)).filter((e) => e?.resolution);
    const raw = new Map(entries.map((e) => [locator(e.resolution)?.resolution, e]));
    const nodes = ndjson.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
    assert.ok(nodes.length > 0, 'Empty installed dependency graph');
    const versions = new Map();
    for (const node of nodes) {
        assert.ok(locator(node.value) && node.children && typeof node.children === 'object', 'Invalid Yarn graph node');
        versions.set(node.value, String(node.children.Version || ''));
    }
    const paths = [];
    for (const node of nodes) {
        const parent = locator(node.value);
        const entry = raw.get(parent.resolution);
        for (const dep of node.children.Dependencies || []) {
            const request = locator(dep.descriptor);
            const target = locator(dep.locator);
            if (!request || !target) continue;
            const declaredRange = entry?.dependencies?.[request.name] ?? entry?.optionalDependencies?.[request.name];
            // Resolved peer providers are not requests to which a resolution selector applies.
            if (!declaredRange && entry?.peerDependencies?.[request.name]) continue;
            const version = versions.get(dep.locator) || raw.get(target.resolution)?.version || '';
            paths.push({
                name: parent.name,
                version: String(node.children.Version || entry?.version || ''),
                resolution: parent.resolution,
                parentReference: parent.reference,
                workspace: parent.reference.startsWith('workspace:'),
                requestedName: request.name,
                targetName: target.name,
                declaredRange: declaredRange || null,
                constraint: withoutNpm(declaredRange),
                effectiveVersions: version ? [String(version)] : [],
                pathVerified: Boolean(declaredRange && semver.valid(String(version))),
            });
        }
    }
    // Peer virtualisations often repeat the same physical dependency edge.
    const distinct = [...new Map(paths.map((p) => [JSON.stringify(p), p])).values()];
    return {
        complete: true,
        source: 'yarn-info',
        paths: distinct,
    };
}

export function installedGraph(root = process.cwd()) {
    const lockText = readFileSync(join(root, 'yarn.lock'), 'utf8');
    const output = execFileSync(process.execPath, ['.yarn/releases/yarn-4.14.1.cjs', 'info',
        '--all', '--recursive', '--virtuals', '--json'], {
        cwd: root,
        encoding: 'utf8',
        maxBuffer: 32 * 1024 * 1024,
        timeout: 60_000,
        env: {
            ...process.env,
            YARN_ENABLE_NETWORK: 'false',
        },
    });
    return parseGraph(output, lockText);
}

export function assessResolution(selector, configuredPin, graph) {
    const parsed = resolutionSelector(selector);
    const paths = matchingPaths(selector, graph.paths);
    const verified = paths?.length > 0 && paths.every((p) => p.pathVerified
        && semver.validRange(p.constraint) && semver.minVersion(p.constraint));
    const mismatches = verified ? paths.filter((p) => p.effectiveVersions.some((v) => semver.lt(v, semver.minVersion(p.constraint)))) : [];
    const overrides = verified ? paths.filter((p) => p.effectiveVersions.some((v) => !semver.satisfies(v, p.constraint))) : [];
    return {
        selector,
        name: parsed?.name || null,
        configuredPin,
        effectiveVersions: [...new Set((paths || []).flatMap((p) => p.effectiveVersions))].sort(),
        parents: paths || [],
        status: !parsed ? 'unassessed' : !paths.length ? graph.complete ? 'unused' : 'unassessed'
            : !verified ? 'unassessed' : mismatches.length ? 'parent-requires-newer'
                : overrides.length ? 'constraint-override' : 'no-parent-mismatch',
        mismatches,
        source: graph.source,
    };
}

export function assertPinEvidence(input, field, selector, after) {
    if (field !== 'resolutions') return;
    const paths = matchingPaths(selector, input.paths || []);
    assert.ok(paths, `Unsupported resolution selector ${selector}`);
    const previous = input.pins.find((p) => p.selector === selector);
    if (after === undefined && previous?.status === 'unused') return;
    assert.ok(paths.length && paths.every((p) => p.pathVerified && semver.validRange(p.constraint)),
        `Changed resolution ${selector} needs verified parent paths`);
}

// Yarn applies the first matching resolution. Never depend on reordering entries
// or append a different override behind an existing matching selector.
export function resolutionConflicts(input, manifest) {
    const entries = Object.entries(manifest.resolutions || {
    });
    return entries.flatMap(([selector, value]) => {
        if (input.manifest.resolutions?.[selector] === value) return [];
        const paths = matchingPaths(selector, input.paths || []) || [];
        return entries.filter(([other, target]) => other !== selector && target !== value
            && (matchingPaths(other, paths) || []).length).map(([other, target]) => ({
            selector,
            conflictingSelector: other,
            expected: value,
            conflictingTarget: target,
            diagnostic: `Overlapping resolutions ${selector} (${value}) and ${other} (${target}); manual reconciliation required`,
        }));
    });
}

export function verifyGraphChanges(input, manifest, afterGraph) {
    for (const field of ['dependencies', 'devDependencies']) for (const [name, target] of Object.entries(manifest[field] || {
    })) {
        if (target === input.manifest[field]?.[name]) continue;
        const paths = afterGraph.paths.filter((p) => p.workspace && p.requestedName === name);
        if (!paths.length || !semver.validRange(target) || paths.some((p) => !p.pathVerified
            || p.effectiveVersions.some((v) => !semver.satisfies(v, target)))) {
            const error = new Error(`Direct dependency ${name} did not resolve to ${target}`);
            error.details = [{
                selector: name,
                expected: target,
                actualVersions: paths.flatMap((p) => p.effectiveVersions),
                diagnostic: error.message,
            }];
            throw error;
        }
    }
    for (const selector of new Set([...Object.keys(input.manifest.resolutions || {
    }), ...Object.keys(manifest.resolutions || {
    })])) {
        const before = input.manifest.resolutions?.[selector];
        const after = manifest.resolutions?.[selector];
        if (before === after) continue;
        try {
            assertPinEvidence(input, 'resolutions', selector, after);
            const paths = matchingPaths(selector, afterGraph.paths);
            if (after === undefined) {
                const prior = matchingPaths(selector, input.paths);
                // A parent upgrade can legitimately remove every use of the selector.
                if (!paths.length && !prior.length) continue;
            }
            assert.ok(paths.every((p) => p.pathVerified), `Unverified proposed paths for ${selector}`);
            if (after !== undefined) assert.ok(paths.length && semver.validRange(after)
            && paths.every((p) => p.effectiveVersions.every((v) => semver.satisfies(v, after))),
        `Resolution ${selector} did not take effect on every matching path`);
        } catch (error) {
            error.details = [{
                selector,
                expected: after,
                actualVersions: [...new Set((matchingPaths(selector, afterGraph.paths) || []).flatMap((p) => p.effectiveVersions))],
                diagnostic: error.message,
            }];
            throw error;
        }
    }
    const prior = new Map();
    for (const p of input.paths || []) {
        const key = `${p.resolution}:${p.requestedName}`;
        prior.set(key, [...(prior.get(key) || []), ...p.effectiveVersions.filter((v) => semver.valid(v))]);
    }
    for (const p of afterGraph.paths) {
        const versions = prior.get(`${p.resolution}:${p.requestedName}`);
        if (!versions?.length) continue;
        const minimum = versions.sort(semver.compare)[0];
        assert.ok(p.effectiveVersions.every((v) => !semver.valid(v) || semver.gte(v, minimum)),
            `Proposed lockfile downgrades ${p.requestedName} under ${p.name}`);
    }
}
