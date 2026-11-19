import semver from 'semver';
import { matchingPaths, resolutionConflicts } from './dependency-graph.mjs';

// Select only prepared releases and verified affected paths; never ask the model
// to construct selectors, infer a version, or decide whether a copy is vulnerable.
export function planGroups(input) {
    const groups = [];
    const packages = input.triage.packages.map((p) => {
        const affected = (input.paths || []).filter((path) => path.requestedName === p.name
            && path.effectiveVersions.some((v) => p.affectedVersions.includes(v)));
        const edits = new Map();
        const targets = new Set();
        const caveats = new Set();
        let blocker;
        if (!p.affectedVersions.length) blocker = 'not-affected';
        else if (!affected.length || affected.some((path) => !path.pathVerified)) blocker = 'unknown-path';
        for (const path of affected) {
            const versions = path.effectiveVersions.filter((v) => p.affectedVersions.includes(v));
            const candidates = (input.releases[p.name] || []).filter((r) => versions.every((v) => r.applicableFromVersions.includes(v)));
            const child = candidates.find((r) => semver.validRange(path.constraint) && semver.satisfies(r.version, path.constraint)) || candidates[0];
            if (!child) { blocker = input.releaseDispositions?.[p.name]?.status || 'unknown-release-evidence'; continue; }
            targets.add(child.version);
            let selector;
            let value = child.version;
            if (!semver.validRange(path.constraint)) { blocker = 'unknown-path'; continue; }
            if (!semver.satisfies(child.version, path.constraint)) {
                const parentPaths = (input.paths || []).filter((q) => q.requestedName === path.name);
                const parent = (input.releases[path.name] || []).find((r) => semver.gt(r.version, path.version)
                    && semver.validRange(r.dependencies[p.name]) && semver.satisfies(child.version, r.dependencies[p.name])
                    && parentPaths.length
                    && parentPaths.every((q) => q.pathVerified
                        && semver.validRange(q.constraint) && semver.satisfies(r.version, q.constraint)
                        && q.effectiveVersions.every((v) => semver.gte(r.version, v))));
                if (parent) {
                    selector = path.name;
                    value = parent.version;
                    caveats.add('requires-parent-update');
                } else {
                    blocker = 'requires-parent-upgrade';
                    continue;
                }
            } else {
                // Reuse a matching existing selector only when it cannot affect a safe/newer branch.
                selector = input.pins.find((pin) => pin.name === p.name && matchingPaths(pin.selector, [path])?.length
                    && matchingPaths(pin.selector, input.paths).every((q) => q.pathVerified
                        && semver.validRange(q.constraint) && semver.satisfies(child.version, q.constraint)
                        && q.effectiveVersions.every((v) => p.affectedVersions.includes(v))))?.selector
                    || `${p.name}@${path.declaredRange}`;
                caveats.add('within-parent-constraints');
            }
            const key = `resolutions:${selector}`;
            if (edits.has(key) && edits.get(key).value !== value) { blocker = 'conflicting-targets'; continue; }
            edits.set(key, {
                field: 'resolutions',
                name: selector,
                value,
                reason: `Prepared fix for ${p.name}; affected versions: ${versions.join(', ')}`,
                compatibility: [...caveats].join('; '),
            });
        }
        const release = input.releaseDispositions?.[p.name];
        const releaseAction = {
            'no-published-fix': 'No stable version fixing all recorded advisories is published; manually investigate upstream fixes or alternatives',
            'age-gated': `Published fix deferred by release-age policy: ${release?.releases?.map((r) => `${r.version} eligible ${r.eligibleAt}`).join('; ')}. Wait until eligible and rerun; for critical issues consider an explicitly approved age-policy override`,
            'other-policy-blocked': 'Published fix exists but fails another eligibility rule (Node compatibility, deprecation or publication evidence); manually investigate',
            'unknown': 'Release evidence is incomplete; manually investigate; absence of a candidate does not prove no fix exists',
            'unknown-release-evidence': 'No applicable prepared candidate; manually investigate release evidence and branch compatibility',
            'eligible': 'No prepared candidate applies to this affected branch; manually investigate branch compatibility',
            'requires-parent-upgrade': 'Patched child is outside parent constraints; a compatible parent upgrade or manual compatibility review is required',
        }[blocker];
        const decision = {
            name: p.name,
            ecosystem: p.ecosystem,
            disposition: blocker || 'planned',
            recommendations: [{
                targetVersion: blocker ? null : [...targets][0] || null,
                pinVersion: null,
                applicableFromVersions: blocker ? [] : p.affectedVersions.filter((v) => (input.releases[p.name] || []).find((r) => r.version === [...targets][0])?.applicableFromVersions.includes(v)),
                compatibility: [...caveats].join('; ') || 'unavailable',
                action: blocker === 'not-affected' ? `${p.name}: no affected versions recorded in the prepared baseline; alert remains unresolved pending reconciliation`
                    : blocker ? `${p.name}: ${releaseAction || `${blocker}; no unverified change attempted`}`
                        : `${p.name}: apply verified affected-path fixes; ${[...caveats].join('; ')}`,
            }],
        };
        if (!blocker) decision.recommendations = [...targets].map((version) => ({
            ...decision.recommendations[0],
            targetVersion: version,
            applicableFromVersions: p.affectedVersions.filter((v) => (input.releases[p.name] || []).find((r) => r.version === version)?.applicableFromVersions.includes(v)),
        }));
        if (!blocker && edits.size) groups.push({
            name: p.name,
            edits: [...edits.values()],
            decision,
            score: p.alerts.length,
            complexity: caveats.has('parent-constraint-override') ? 2 : caveats.has('requires-parent-update') ? 1 : 0,
        });
        return decision;
    });
    for (const pin of input.pins.filter((p) => p.status === 'parent-requires-newer' && !packages.some((entry) => entry.name === p.name))) {
        const candidate = (input.releases[pin.name] || []).find((r) => pin.effectiveVersions.every((v) => semver.gte(r.version, v))
            && pin.parents.every((parent) => parent.pathVerified && semver.validRange(parent.constraint) && semver.satisfies(r.version, parent.constraint)));
        if (candidate) groups.push({
            name: `pin:${pin.selector}`,
            score: 0,
            complexity: 0,
            edits: [{
                field: 'resolutions',
                name: pin.selector,
                value: candidate.version,
                reason: 'Verified pin behind parent requirements',
                compatibility: 'within-parent-constraints',
            }],
        });
    }
    groups.sort((a, b) => b.score - a.score || a.complexity - b.complexity || a.name.localeCompare(b.name));
    const manifest = structuredClone(input.manifest);
    manifest.resolutions ||= {
    };
    const duplicateEdits = new Set();
    const values = new Map();
    for (const group of groups) for (const edit of group.edits) {
        if (values.has(edit.name) && values.get(edit.name) !== edit.value) duplicateEdits.add(edit.name);
        values.set(edit.name, edit.value);
        manifest.resolutions[edit.name] = edit.value;
    }
    const conflicts = resolutionConflicts(input, manifest);
    const blocked = groups.filter((g) => g.edits.some((e) => duplicateEdits.has(e.name)
        || conflicts.some((c) => [c.selector, c.conflictingSelector].includes(e.name))));
    for (const group of blocked) {
        if (group.decision) {
            group.decision.disposition = 'conflicting-resolutions';
            group.decision.recommendations = [{
                targetVersion: null,
                pinVersion: null,
                compatibility: 'unresolved',
                action: `${group.name}: ${conflicts.map((c) => c.diagnostic).join('; ') || 'Conflicting proposed resolution targets'}; no change attempted`,
            }];
        }
    }
    return {
        packages,
        groups: groups.filter((g) => !blocked.includes(g)),
    };
}

export function proposalFor(plan, groups, failures = []) {
    const selected = new Map(groups.map((g) => [g.name, g]));
    return {
        schemaVersion: 1,
        packages: plan.packages.map((p) => selected.has(p.name) ? selected.get(p.name).decision : {
            ...p,
            disposition: p.disposition === 'planned' ? 'deferred' : p.disposition,
            recommendations: [{
                targetVersion: null,
                pinVersion: null,
                compatibility: 'unresolved',
                action: p.disposition === 'planned' ? `${p.name}: deferred by bounded group/repair budget. ${failures.join('; ')}` : p.recommendations[0].action,
            }],
        }),
        changes: groups.flatMap((g) => g.edits.map((edit) => ({
            ...edit,
            group: g.name,
        }))),
    };
}
