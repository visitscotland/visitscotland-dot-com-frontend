import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
    readFileSync, writeFileSync, mkdirSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import semver from 'semver';
import { readJson } from './dependency-http.mjs';
import {
    assessResolution, installedGraph, locator,
} from './dependency-graph.mjs';
import { checkInstalledRuntime } from './dependency-runtime.mjs';

// Every file is valid standalone JSON; split only between complete evidence records.
export function agentContextPages(input) {
    const groups = [{
        package: null,
        records: [{
            section: 'overview',
            value: {
                repository: input.repository,
                baselineSha: input.baselineSha,
                nodeVersion: input.nodeVersion,
                limits: input.limits,
                registryComplete: input.registryComplete,
            },
        }, ...input.pins.map((p) => ({
            section: 'pin-audit',
            value: {
                selector: p.selector,
                configuredPin: p.configuredPin,
                status: p.status,
            },
        })), ...(input.gaps || []).map((value) => ({
            section: 'gap',
            value,
        }))],
    }];
    for (const p of input.triage.packages) {
        const names = new Set([p.name, ...p.parents.map((parent) => parent.name)]);
        groups.push({
            package: p.name,
            records: [
                {
                    section: 'finding',
                    value: {
                        name: p.name,
                        ecosystem: p.ecosystem,
                        affectedVersions: p.affectedVersions,
                        highestSeverity: p.highestSeverity,
                        relationship: p.relationship,
                        uncertainties: p.uncertainties,
                    },
                },
                ...p.parents.map((value) => ({
                    section: 'parent',
                    value,
                })),
                ...input.alerts.filter((a) => a.package.name === p.name).map((value) => ({
                    section: 'advisory',
                    value,
                })),
                ...[...names].flatMap((name) => (input.releases[name] || []).map((value) => ({
                    section: 'candidate',
                    package: name,
                    value,
                }))),
                ...input.pins.filter((pin) => pin.name === p.name || names.has(pin.selector))
                    .map((value) => ({
                        section: 'pin',
                        value,
                    })),
                ...['dependencies', 'devDependencies', 'resolutions', 'overrides'].flatMap((field) =>
                    Object.entries(input.manifest[field] || {
                    }).filter(([name]) => names.has(name)
                        || pinTarget(name, [...names])).map(([name, value]) => ({
                        section: 'manifest',
                        field,
                        name,
                        value,
                    }))),
            ],
        });
    }
    const pages = [];
    for (const group of groups) {
        let records = [];
        const serialize = (items) => JSON.stringify({
            package: group.package,
            records: items,
        });
        for (const record of group.records) {
            assert.ok(Buffer.byteLength(serialize([record])) <= 10000, 'One evidence record exceeds the context limit; shorten it before model execution');
            if (Buffer.byteLength(serialize([...records, record])) > 10000) {
                pages.push(serialize(records));
                records = [];
            }
            records.push(record);
        }
        if (records.length) pages.push(serialize(records));
    }
    return pages;
}

export function writeAgentContext(input, directory = 'triage-results/agent-context') {
    mkdirSync(directory, {
        recursive: true,
    });
    const pages = agentContextPages(input);
    const files = pages.map((page, i) => {
        const name = `context-${String(i + 1).padStart(3, '0')}.json`;
        writeFileSync(`${directory}/${name}`, page);
        return `- ${directory}/${name} (${JSON.parse(page).package || 'overview'})`;
    });
    writeFileSync(`${directory}/index.md`, [
        `Baseline: ${input.baselineSha}`,
        'Read these standalone JSON files once in one batch. Each is at most 10 KB.',
        'Each package file contains its findings, candidates, parents and matching selectors.',
        `Required package decisions: ${input.triage.packages.map((p) => p.name).join(', ') || '(none)'}.`,
        ...files, '',
    ].join('\n'));
}

const unique = (values) => [...new Set(values)].sort();
export const normalizedRange = (range) => typeof range === 'string' ? range.replace(/,\s*/g, ' ') : '';
export function advisoryRanges(alert) {
    const name = alert.dependency.package.name;
    const vulnerabilities = alert.security_advisory?.vulnerabilities
        ?.filter((v) => v.package.name === name && v.package.ecosystem === alert.dependency.package.ecosystem);
    const matching = vulnerabilities?.length ? vulnerabilities : [alert.security_vulnerability].filter(Boolean);
    return matching.length ? unique(matching.map((v) => normalizedRange(v.vulnerable_version_range))) : [''];
}

export function lockEntries(lock) {
    return Object.entries(YAML.parse(lock)).filter(([key]) => key !== '__metadata').map(([selectors, entry]) => ({
        selectors: selectors.split(/,\s+/),
        name: entry.resolution?.match(/^(.+)@npm:/)?.[1] || null,
        ...entry,
    }));
}

// Match the target at the end of a Yarn resolution selector, including scoped names.
export function pinTarget(selector, names) {
    return [...names].sort((a, b) => b.length - a.length).find((name) => {
        const offset = selector.lastIndexOf(name);
        return offset >= 0 && (offset === 0 || selector[offset - 1] === '/')
            && (offset + name.length === selector.length || selector[offset + name.length] === '@');
    }) || null;
}

export function inventory(evidence, { graph } = {
}) {
    assert.equal(evidence.status, 'complete', 'Incomplete evidence');
    const manifest = evidence.files['package.json'].data.content;
    const entries = lockEntries(evidence.files['yarn.lock'].data.content);
    const descriptors = new Map(entries.flatMap((entry) => entry.selectors.map((selector) => [selector, entry])));
    const resolvedGraph = graph || {
        complete: false,
        source: 'lockfile-fallback',
        paths: entries.flatMap((entry) => Object.entries({
            ...entry.dependencies,
            ...entry.optionalDependencies,
        }).map(([name, constraint]) => {
            const exact = descriptors.get(`${name}@${constraint}`);
            const parent = locator(entry.resolution);
            return {
                name: parent?.name || entry.resolution,
                resolution: parent?.resolution || entry.resolution,
                parentReference: parent?.reference,
                workspace: parent?.reference.startsWith('workspace:') || false,
                version: String(entry.version),
                requestedName: name,
                targetName: exact?.name || name,
                declaredRange: constraint,
                constraint: String(constraint).replace(/^npm:/, ''),
                effectiveVersions: exact ? [String(exact.version)] : [],
                pathVerified: Boolean(exact),
            };
        })),
    };
    const parents = (name) => resolvedGraph.paths.filter((p) => p.targetName === name);
    const packages = [];
    const facts = [];
    const ranks = {
        unknown: 0,
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
    };
    for (const alert of evidence.alerts.data) {
        const { name, ecosystem } = alert.dependency.package;
        if (packages.some((p) => p.name === name && p.ecosystem === ecosystem)) continue;
        const alerts = evidence.alerts.data.filter((a) => a.dependency.package.name === name
            && a.dependency.package.ecosystem === ecosystem);
        const ranges = unique(alerts.flatMap(advisoryRanges));
        const valid = ecosystem === 'npm' && ranges.length > 0 && ranges.every((r) => r && semver.validRange(r));
        const lockedVersions = unique(entries.filter((e) => e.name === name).map((e) => String(e.version)));
        const parentPaths = parents(name);
        const direct = Boolean(manifest.dependencies?.[name] || manifest.devDependencies?.[name]);
        packages.push({
            name,
            ecosystem,
            affectedVersions: valid ? lockedVersions.filter((v) => semver.valid(v)
                && ranges.some((r) => semver.satisfies(v, r))) : [],
            highestSeverity: alerts.reduce((s, a) => ranks[a.security_advisory.severity] > ranks[s]
                ? a.security_advisory.severity : s, 'unknown'),
            relationship: direct ? (parentPaths.some((p) => !p.workspace) ? 'both' : 'direct') : parentPaths.length ? 'transitive' : 'unknown',
            parents: parentPaths,
            recommendations: [{
                targetVersion: null,
                pinVersion: null,
                applicableFromVersions: lockedVersions,
                compatibility: 'unknown',
                action: valid ? 'Not attempted; requires human investigation'
                    : 'Unsupported ecosystem or invalid advisory range; requires human investigation',
            }],
            alerts: alerts.map((a) => ({
                number: a.number,
                url: a.html_url,
            })),
            sources: alerts.map((a) => a.html_url),
            uncertainties: valid ? [] : ['Advisory ranges cannot establish a safe target'],
        });
        facts.push({
            name,
            ecosystem,
            lockedVersions,
            ranges,
            rangesValid: valid,
            firstPatchedVersions: unique(alerts.map((a) => a.security_vulnerability?.first_patched_version?.identifier).filter(Boolean)),
        });
    }
    packages.sort((a, b) => ranks[b.highestSeverity] - ranks[a.highestSeverity] || a.name.localeCompare(b.name));
    const pins = Object.entries(manifest.resolutions || {
    }).map(([selector, value]) => assessResolution(selector, value, resolvedGraph));
    const laggingNames = unique(pins.filter((p) => p.mismatches.length).map((p) => p.name));
    return {
        manifest,
        entries,
        facts,
        pins,
        graph: resolvedGraph,
        triage: {
            schemaVersion: 2,
            repository: evidence.repository,
            collectedAt: evidence.collectedAt,
            baselineSha: evidence.baseline.data.sha,
            evidenceMode: evidence.mode,
            collectionStatus: evidence.status,
            gaps: pins.filter((p) => p.status === 'unassessed').map((p) => `Pin ${p.selector}: effective parent paths require investigation`),
            packages,
            pinAssessmentStatus: pins.some((p) => p.status === 'unassessed') ? 'partial' : 'complete',
            pinAssessments: pins.map(({ selector, status, effectiveVersions }) => ({
                selector,
                status,
                effectiveVersions,
            })),
            laggingPins: laggingNames.map((name) => ({
                name,
                mechanism: 'resolutions',
                configuredPin: pins.filter((p) => p.name === name && p.mismatches.length).map((p) => `${p.selector}: ${p.configuredPin}`).join('; '),
                effectiveVersions: unique(pins.filter((p) => p.name === name && p.mismatches.length).flatMap((p) => p.effectiveVersions)),
                parentRequirements: pins.filter((p) => p.name === name && p.mismatches.length).flatMap((p) => p.mismatches),
                unpinnedVersions: [],
                evidenceLevel: 'Parent requires newer',
                recommendedAction: 'Review parent constraints and refresh or update the pin',
                sources: [],
            })),
            inactiveOverrides: Object.keys(manifest.overrides || {
            }),
        },
    };
}

export function releaseCandidates(name, metadata, currentVersions, ranges, {now = Date.now(), ageMs = 7 * 86400_000, nodeVersion, parents = [], purpose = 'security'} = {
}) {
    const branch = (v) => semver.major(v) === 0 ? `0.${semver.minor(v)}` : String(semver.major(v));
    const eligible = Object.keys(metadata.versions || {
    }).filter((v) => {
        const release = metadata.versions[v];
        const published = Date.parse(metadata.time?.[v]);
        return semver.valid(v) && !semver.prerelease(v) && !release.deprecated
            && Number.isFinite(published) && now - published >= ageMs
            && (!release.engines?.node || (semver.validRange(release.engines.node)
                && semver.satisfies(nodeVersion, release.engines.node)))
            && ranges.every((r) => r && semver.validRange(r) && !semver.satisfies(v, r));
    }).sort(semver.compare);
    const selected = new Map();
    const add = (version, from, compatibility) => {
        if (!version) return;
        const item = selected.get(version) || {
            applicableFromVersions: [],
            compatibility,
        };
        item.applicableFromVersions = unique([...item.applicableFromVersions, from]);
        const rank = {
            'within-parent-constraints': 0,
            'existing-safe-version': 0,
            'requires-parent-update': 1,
            'parent-constraint-override': 2,
            'requires-investigation': 3,
        };
        if (rank[compatibility] > rank[item.compatibility]) item.compatibility = compatibility;
        selected.set(version, item);
    };
    for (const from of unique(currentVersions).filter((v) => semver.valid(v))) {
        const affected = ranges.some((r) => r && semver.validRange(r) && semver.satisfies(from, r));
        if (purpose === 'security' && !affected) {
            if (eligible.includes(from)) add(from, from, 'existing-safe-version');
            continue;
        }
        const paths = parents.filter((p) => p.effectiveVersions.includes(from));
        const known = paths.length > 0 && paths.every((p) => p.pathVerified && semver.validRange(p.constraint));
        const compatible = (v) => known && paths.every((p) => semver.satisfies(v, p.constraint));
        const forward = eligible.filter((v) => semver.gt(v, from));
        const sameBranch = forward.filter((v) => branch(v) === branch(from));
        const within = sameBranch.filter(compatible);
        if (within.length) {
            add(within[0], from, 'within-parent-constraints');
            if (purpose === 'parent-upgrade') add(within.at(-1), from, 'within-parent-constraints');
        } else if (sameBranch.length) {
            add(sameBranch[0], from, known ? 'parent-constraint-override' : 'requires-investigation');
            if (purpose === 'parent-upgrade') add(sameBranch.at(-1), from, known ? 'parent-constraint-override' : 'requires-investigation');
        } else if (forward.length) {
            const existing = forward.find((v) => currentVersions.includes(v));
            add(existing || forward[0], from, compatible(existing || forward[0]) ? 'within-parent-constraints' : 'requires-parent-update');
        }
    }
    return [...selected.keys()].sort(semver.compare).map((version) => ({
        version,
        ...selected.get(version),
        publishedAt: metadata.time[version],
        engines: metadata.versions[version].engines || {
        },
        dependencies: metadata.versions[version].dependencies || {
        },
        peerDependencies: metadata.versions[version].peerDependencies || {
        },
        source: `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`,
    }));
}

export function releaseDisposition(name, metadata, versions, ranges, options, candidates) {
    if (candidates.length) return {
        status: 'eligible',
    };
    if (!ranges.length || ranges.some((r) => !r || !semver.validRange(r))) return {
        status: 'unknown',
    };
    const fresh = releaseCandidates(name, metadata, versions, ranges, {
        ...options,
        ageMs: 0,
    });
    const ageMs = options.ageMs ?? 7 * 86400_000;
    const blocked = fresh.filter((r) => Date.parse(r.publishedAt) + ageMs > options.now);
    if (blocked.length) return {
        status: 'age-gated',
        releases: blocked.map((r) => ({
            version: r.version,
            eligibleAt: new Date(Date.parse(r.publishedAt) + ageMs).toISOString(),
        })),
    };
    const publishedFix = Object.keys(metadata.versions).some((v) => semver.valid(v) && !semver.prerelease(v)
        && versions.some((from) => semver.valid(from) && semver.gt(v, from))
        && ranges.every((r) => !semver.satisfies(v, r)));
    return {
        status: publishedFix ? 'other-policy-blocked' : 'no-published-fix',
    };
}

export function fingerprint(value) {
    const stable = (v) => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object'
        ? Object.fromEntries(Object.keys(v).sort().map((key) => [key, stable(v[key])])) : v;
    return createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

export async function prepare(evidence, { registryRead, nodeVersion, policyHash, ageMs, graph, now = Date.now() }) {
    const { manifest, entries, facts, pins, triage, graph: resolvedGraph } = inventory(evidence, {
        graph,
    });
    const names = unique([...facts.filter((f) => f.ecosystem === 'npm').map((f) => f.name),
        ...pins.filter((p) => p.status === 'parent-requires-newer').map((p) => p.name)]);
    const releases = {
    };
    const releaseDispositions = {
    };
    const gaps = [];
    const metadataCache = new Map();
    const parentsOf = (name) => resolvedGraph.paths.filter((p) => p.targetName === name);
    // Only alert targets and evidenced lagging pins need primary registry lookups.
    const load = async(name, purpose) => {
        if (metadataCache.has(name)) return;
        try {
            const metadata = await registryRead(name);
            assert.ok(metadata?.versions && typeof metadata.versions === 'object'
                && !Array.isArray(metadata.versions) && metadata.time && typeof metadata.time === 'object',
            'Invalid registry evidence');
            metadataCache.set(name, true);
            const fact = facts.find((f) => f.name === name);
            const versions = entries.filter((e) => e.name === name).map((e) => String(e.version));
            const candidateOptions = {
                now,
                nodeVersion,
                ageMs,
                parents: parentsOf(name),
                purpose,
            };
            releases[name] = releaseCandidates(name, metadata, versions, fact?.ranges || [], candidateOptions);
            releaseDispositions[name] = releaseDisposition(name, metadata, versions, fact?.ranges || [], candidateOptions, releases[name]);
        } catch {
            metadataCache.set(name, false);
            releases[name] = [];
            releaseDispositions[name] = {
                status: 'unknown',
            };
            gaps.push(`Registry evidence unavailable for ${name}; do not invent a target`);
        }
    };
    for (const name of names) await load(name, facts.some((f) => f.name === name) ? 'security' : 'pin-refresh');
    // Parent metadata is useful only where the minimal forward fix cannot satisfy an affected path.
    const parentNames = unique(triage.packages.flatMap((p) => p.parents.filter((parent) => !parent.workspace
        && parent.effectiveVersions.some((v) => p.affectedVersions.includes(v))
        && !releases[p.name]?.some((r) => r.applicableFromVersions.some((v) => parent.effectiveVersions.includes(v))
            && semver.validRange(parent.constraint) && semver.satisfies(r.version, parent.constraint)))
        .map((parent) => parent.name)));
    for (const name of parentNames) await load(name, 'parent-upgrade');
    triage.gaps.push(...gaps);
    const relevant = new Set([...names, ...parentNames, ...pins.map((p) => p.name).filter(Boolean)]);
    const paths = resolvedGraph.paths.filter((p) => relevant.has(p.targetName) || relevant.has(p.requestedName));
    const semantic = {
        schemaVersion: 2,
        repository: evidence.repository,
        baselineSha: evidence.baseline.data.sha,
        policyHash,
        nodeVersion,
        manifest,
        facts,
        pins,
        releases,
        releaseDispositions,
        paths,
        alerts: evidence.alerts.data.map((a) => ({
            number: a.number,
            package: a.dependency.package,
            severity: a.security_advisory.severity,
            ranges: advisoryRanges(a),
            patched: a.security_vulnerability?.first_patched_version,
            updatedAt: a.updated_at,
        })),
        gaps,
    };
    return {
        ...semantic,
        fingerprint: fingerprint(semantic),
        preparedAt: new Date(now).toISOString(),
        registryComplete: gaps.length === 0,
        triage,
        limits: {
            candidateGroups: 3,
            totalRepairAttempts: 2,
        },
        limitations: ['Resolved parent paths are installed graph evidence, not verified unpinned installs.',
            'Unsupported or ambiguous paths remain explicit gaps; npm overrides are inactive under Yarn.',
            'Candidates exclude prereleases, deprecated, too-new and Node-incompatible releases; absence is not proof no fix exists.'],
    };
}

export async function main() {
    await checkInstalledRuntime();
    const evidence = JSON.parse(readFileSync('triage-results/evidence.json', 'utf8'));
    assert.equal(evidence.mode, 'live');
    const base = execFileSync('git', ['rev-parse', 'HEAD'], {
        encoding: 'utf8',
    }).trim();
    assert.equal(evidence.baseline.data.sha, base, 'Baseline moved; recollect on a fresh run');
    assert.equal(readFileSync('yarn.lock', 'utf8'), evidence.files['yarn.lock'].data.content);
    assert.deepEqual(JSON.parse(readFileSync('package.json', 'utf8')), evidence.files['package.json'].data.content);
    const nodeVersion = readFileSync('.nvmrc', 'utf8').trim();
    const yarnConfig = YAML.parse(readFileSync('.yarnrc.yml', 'utf8'));
    assert.equal(yarnConfig.npmMinimalAgeGate, '7d', 'Review preparation when changing the Yarn age gate');
    const policyFiles = ['ci/prepare-dependency-maintenance.mjs', 'ci/dependency-maintenance.mjs',
        'ci/dependency-host.mjs', 'ci/dependency-plan.mjs', 'ci/dependency-execution.mjs', 'ci/dependency-candidate.mjs', 'ci/dependency-http.mjs', 'ci/dependency-graph.mjs', 'ci/dependency-runtime.mjs', 'ci/dependency-maintenance-state.mjs', '.github/workflows/dependency-maintenance-agent.md',
        '.github/workflows/dependency-maintenance.yml', '.github/skills/dependency-remediation/SKILL.md',
        '.github/skills/dependency-triage/SKILL.md', '.yarnrc.yml'];
    const result = await prepare(evidence, {
        graph: installedGraph(),
        nodeVersion,
        ageMs: 7 * 86400_000,
        policyHash: fingerprint(policyFiles.map((p) => [p, readFileSync(p, 'utf8')])),
        registryRead: async(name) => (await readJson(`https://registry.npmjs.org/${encodeURIComponent(name)}`)).data,
    });
    mkdirSync('triage-results', {
        recursive: true,
    });
    const { paths, ...agentInput } = result;
    const compactParents = (parents) => [...new Map(parents.map((p) => {
        const value = {
            name: p.name,
            version: p.version,
            constraint: p.constraint,
            workspace: p.workspace,
            effectiveVersions: p.effectiveVersions,
            pathVerified: p.pathVerified,
        };
        return [JSON.stringify(value), value];
    })).values()];
    agentInput.pins = result.pins.map((p) => ({
        ...p,
        parents: compactParents(p.parents),
        mismatches: compactParents(p.mismatches),
    }));
    agentInput.triage = structuredClone(result.triage);
    for (const p of agentInput.triage.packages) p.parents = compactParents(p.parents);
    for (const pin of agentInput.triage.laggingPins) pin.parentRequirements = compactParents(pin.parentRequirements);
    agentInput.pathEvidence = {
        path: 'triage-results/dependency-paths.json',
        hash: fingerprint(paths),
    };
    writeFileSync('triage-results/dependency-paths.json', `${JSON.stringify({
        baselineSha: result.baselineSha,
        fingerprint: result.fingerprint,
        paths,
    })}\n`);
    writeAgentContext(agentInput);
    writeFileSync('triage-results/agent-input.json', `${JSON.stringify(agentInput)}\n`);
    if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `fingerprint=${result.fingerprint}\n`, {
        flag: 'a',
    });
    console.log(`Prepared ${result.triage.packages.length} packages, ${result.pins.length} pins (${result.triage.pinAssessmentStatus}) and ${Object.keys(result.releases).length} registry lookups; ${Buffer.byteLength(JSON.stringify(agentInput))} agent input bytes`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch(() => { console.error('Dependency preparation failed; inspect baseline, evidence and registry access'); process.exitCode = 1; });
}
