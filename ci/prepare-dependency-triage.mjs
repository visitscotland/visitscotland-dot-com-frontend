import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import semver from 'semver';

const ranks = ['unknown', 'low', 'medium', 'high', 'critical'];
const read = (name) => readFileSync(`triage-results/${name}`, 'utf8');
const write = (name, value) => writeFileSync(`triage-results/${name}`, `${JSON.stringify(value, null, 2)}\n`);

export function prepare(evidence, startingSha) {
    assert.equal(evidence.schemaVersion, 1);
    assert.equal(evidence.status, 'complete', 'Collection must be complete');
    assert.equal(evidence.mode, 'live', 'Hosted preparation requires live evidence');
    assert.equal(evidence.baseline.data.sha, startingSha, 'Evidence must match the starting checkout');

    const manifest = evidence.files['package.json'].data.content;
    const lock = Object.values(YAML.parse(evidence.files['yarn.lock'].data.content));
    const pins = ['resolutions', 'overrides'].flatMap((mechanism) => Object.entries(manifest[mechanism] || {
    }).map(([selector, value]) => ({
        mechanism,
        selector,
        value,
        assessment: 'pending',
        note: 'Not assessed; overrides are not assumed to apply to Yarn',
    })));
    const groups = new Map();

    for (const alert of evidence.alerts.data) {
        const { name, ecosystem } = alert.dependency.package;
        const key = `${ecosystem}:${name}`;

        if (!groups.has(key)) {
            groups.set(key, {
                name,
                ecosystem,
                alerts: [],
            });
        }

        groups.get(key).alerts.push(alert);
    }

    const packages = [...groups.values()].map(({ name, ecosystem, alerts }) => {
        const versions = [...new Set(lock.filter((entry) => entry?.resolution?.startsWith(`${name}@npm:`)).map((entry) => String(entry.version)))];
        const parents = lock.filter((entry) => entry?.dependencies?.[name] || entry?.optionalDependencies?.[name]).map((entry) => ({
            resolution: entry.resolution,
            requirement: entry.dependencies?.[name] ?? entry.optionalDependencies[name],
        }));
        const advisories = alerts.map((alert) => ({
            number: alert.number,
            url: alert.html_url,
            severity: alert.security_advisory.severity,
            ranges: alert.security_advisory.vulnerabilities.filter((v) => v.package.name === name && v.package.ecosystem === ecosystem).map((v) => ({
                vulnerableRange: v.vulnerable_version_range.replace(/,\s*/g, ' '),
                firstPatchedVersion: v.first_patched_version?.identifier || null,
            })),
        }));
        const affectedVersions = versions.filter((version) => advisories.some((a) => a.ranges.some((r) => semver.valid(version) && semver.validRange(r.vulnerableRange) && semver.satisfies(version, r.vulnerableRange))));
        const highestSeverity = alerts.reduce((severity, alert) => ranks.indexOf(alert.security_advisory.severity) > ranks.indexOf(severity) ? alert.security_advisory.severity : severity, 'unknown');
        const direct = Object.hasOwn(manifest.dependencies || {
        }, name) || Object.hasOwn(manifest.devDependencies || {
        }, name);

        return {
            name,
            ecosystem,
            lockedVersions: versions,
            affectedVersions,
            highestSeverity,
            relationship: direct ? (parents.length ? 'both' : 'direct') : (parents.length ? 'transitive' : 'unknown'),
            parents,
            advisories,
        };
    }).sort((a, b) => ranks.indexOf(b.highestSeverity) - ranks.indexOf(a.highestSeverity) || a.name.localeCompare(b.name));
    const input = {
        repository: evidence.repository,
        baselineSha: startingSha,
        collectedAt: evidence.collectedAt,
        packages,
        pins,
        instructions: 'Recorded first-patched versions are candidates, not verified recommendations. Check all ranges and parent constraints. Raw evidence and the full lockfile are deliberately omitted.',
    };

    assert.ok(Buffer.byteLength(JSON.stringify(input)) <= 256 * 1024, 'Compact inventory exceeds 256 KiB; split this run instead of loading raw evidence');

    const triage = {
        schemaVersion: 2,
        repository: evidence.repository,
        collectedAt: evidence.collectedAt,
        baselineSha: startingSha,
        evidenceMode: evidence.mode,
        collectionStatus: evidence.status,
        analysisStatus: 'pending',
        gaps: [],
        packages: packages.map((p) => ({
            name: p.name,
            ecosystem: p.ecosystem,
            affectedVersions: p.affectedVersions,
            highestSeverity: p.highestSeverity,
            relationship: p.relationship,
            parents: p.parents,
            reviewStatus: 'pending',
            recommendations: [{
                targetVersion: null,
                pinVersion: null,
                applicableFromVersions: p.affectedVersions,
                compatibility: 'unverified',
                action: 'Pending investigation; do not apply',
            }],
            alerts: p.advisories.map(({ number, url }) => ({
                number,
                url,
            })),
            sources: [],
            uncertainties: [],
        })),
        pinAssessments: pins,
        laggingPins: [],
    };

    return {
        input,
        triage,
    };
}

export function validateTriage(evidence, triage) {
    assert.equal(triage.analysisStatus, 'complete', 'Complete triage before remediation or rendering');
    const { input, triage: skeleton } = prepare(evidence, evidence.baseline.data.sha);

    for (const field of ['schemaVersion', 'repository', 'collectedAt', 'baselineSha', 'evidenceMode', 'collectionStatus']) {
        assert.deepEqual(triage[field], skeleton[field], `Preserve triage provenance: ${field}`);
    }

    const packageKey = (p) => `${p.ecosystem}:${p.name}`;

    assert.deepEqual(triage.packages.map(packageKey).sort(), skeleton.packages.map(packageKey).sort(), 'Preserve all affected packages exactly once');

    for (const p of triage.packages) {
        const original = skeleton.packages.find((candidate) => packageKey(candidate) === packageKey(p));

        for (const field of ['highestSeverity', 'alerts', 'affectedVersions']) {
            assert.deepEqual(p[field], original[field], `Preserve recorded ${field} for ${p.name}`);
        }

        assert.equal(p.reviewStatus, 'complete', `Package ${p.name} has not been reviewed`);
        assert.ok(p.recommendations.length, `Package ${p.name} needs a recommendation or explicit unresolved action`);

        for (const r of p.recommendations) {
            assert.ok(typeof r.action === 'string' && r.action.trim() && !/pending investigation/i.test(r.action), `Explain the action for ${p.name}`);
            assert.ok(r.targetVersion === null || semver.valid(r.targetVersion), `Invalid exact target for ${p.name}`);
            assert.ok(r.pinVersion === null || semver.valid(r.pinVersion), `Invalid exact pin for ${p.name}`);
        }
    }

    const key = (p) => `${p.mechanism}:${p.selector}`;

    assert.deepEqual(triage.pinAssessments.map(key).sort(), input.pins.map(key).sort(), 'Every configured pin must be accounted for');

    for (const pin of triage.pinAssessments) {
        const original = input.pins.find((p) => key(p) === key(pin));

        assert.deepEqual(pin.value, original.value, 'Do not change recorded pins');
        assert.ok(['assessed', 'unassessed', 'inactive'].includes(pin.assessment), `Finish pin assessment for ${pin.selector}`);
        assert.ok(typeof pin.note === 'string' && pin.note.trim(), 'Explain pin assessment');

        if (pin.assessment === 'unassessed') {
            assert.ok(triage.gaps.includes(pin.note), 'Unassessed pins must be explicit report gaps');
        }
    }
}

const cell = (value) => String(value ?? 'Unknown').replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');

export function renderTriage(triage) {
    const rows = triage.packages.map((p) => `| ${cell(p.name)} | ${cell(p.affectedVersions.join(', '))} | ${cell(p.highestSeverity)} | ${cell(`${p.relationship}; ${p.parents.map((v) => typeof v === 'string' ? v : v.resolution).join(', ')}`)} | ${cell(p.recommendations.map((r) => r.pinVersion || r.targetVersion || 'Unverified — investigate').join('; '))} | ${cell(p.recommendations.map((r) => r.action).join('; '))} | ${p.alerts.map((a) => `[#${a.number}](${a.url})`).join(', ')} |`);
    const pins = triage.laggingPins.map((p) => `| ${cell(p.name)} / ${cell(p.mechanism)} | ${cell(p.configuredPin)} → ${cell(p.effectiveVersions?.join(', '))} | ${cell(p.unpinnedVersions?.length ? p.unpinnedVersions.join(', ') : JSON.stringify(p.parentRequirements))} | ${cell(p.evidenceLevel)} | ${cell(p.recommendedAction)} |`);

    return [
        `${triage.repository} | ${triage.collectedAt} | ${triage.baselineSha} | ${triage.collectionStatus}; pin gaps: ${triage.gaps.length}`,
        '', '## Packages needing updates', '',
        '| Package | Current affected versions | Highest severity | Direct/transitive (parent) | Recommended patched version / pin | Action / constraint caveat | Alerts |',
        '|---|---|---|---|---|---|---|', ...rows,
        '', '## Pins behind parent requirements or unpinned resolution', '',
        '| Package / mechanism | Configured pin → effective version | Unpinned version / parent requirement | Evidence | Recommended action |',
        '|---|---|---|---|---|', ...pins,
        ...(pins.length ? [] : ['', triage.pinAssessments.some((p) => p.assessment === 'unassessed') ? 'Pin check incomplete; see gaps.' : 'None found.']),
        '', ...triage.gaps.map((gap) => `Gap: ${cell(gap)}`), '',
    ].join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const evidence = JSON.parse(read('evidence.json'));

    if (process.argv[2] === 'prepare') {
        const { input, triage } = prepare(evidence, process.env.GITHUB_SHA);

        write('agent-input.json', input);
        write('triage.json', triage);
        console.log(`Prepared ${input.packages.length} packages and ${input.pins.length} pins. Read agent-input.json, not raw evidence.`);
    } else if (process.argv[2] === 'check') {
        const triage = JSON.parse(read('triage.json'));

        validateTriage(evidence, triage);
        writeFileSync('triage-results/weekly-report.md', renderTriage(triage));
        console.log('Triage is complete; report generated. Remediation may proceed.');
    } else {
        throw new Error('Use prepare or check');
    }
}
