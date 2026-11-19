import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
    readFileSync, writeFileSync, existsSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import semver from 'semver';
import {
    advisoryRanges, pinTarget, fingerprint,
} from './prepare-dependency-maintenance.mjs';
import {
    assertPinEvidence, installedGraph, verifyGraphChanges,
} from './dependency-graph.mjs';

import { completedRemediation, remediationStatus } from './dependency-execution.mjs';

export const marker = '<!-- dotcom-dependency-maintenance:v1 -->';

export function assess(evidence, triage, afterLock) {
    assert.equal(evidence.status, 'complete', 'Collection must be complete');
    assert.equal(evidence.mode, 'live', 'Fixture evidence cannot publish a PR');
    assert.equal(triage.schemaVersion, 2);
    assert.equal(triage.collectionStatus, 'complete');
    assert.equal(triage.evidenceMode, 'live');
    assert.equal(triage.repository, evidence.repository);
    assert.equal(triage.baselineSha, evidence.baseline.data.sha);

    const ids = triage.packages.flatMap((p) => p.alerts.map((a) => a.number));
    const expected = evidence.alerts.data.map((a) => a.number);

    assert.equal(new Set(ids).size, ids.length, 'Duplicate alert in triage');
    assert.deepEqual([...ids].sort((a, b) => a - b), [...expected].sort((a, b) => a - b));

    const before = Object.values(YAML.parse(evidence.files['yarn.lock'].data.content));
    const after = Object.values(YAML.parse(afterLock));
    const ranks = {
        unknown: 0,
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
    };

    for (const p of triage.packages) {
        const alerts = evidence.alerts.data.filter((a) => a.dependency.package.name === p.name && a.dependency.package.ecosystem === p.ecosystem);

        assert.ok(alerts.length, `Unexpected package ${p.name}`);
        assert.deepEqual(p.alerts.map((a) => a.number).sort((a, b) => a - b), alerts.map((a) => a.number).sort((a, b) => a - b));

        const highest = alerts.reduce((s, a) => ranks[a.security_advisory.severity] > ranks[s] ? a.security_advisory.severity : s, 'unknown');

        assert.equal(p.highestSeverity, highest, `Incorrect severity for ${p.name}`);
    }

    return evidence.alerts.data.map((alert) => {
        const name = alert.dependency.package.name;
        const ranges = advisoryRanges(alert);
        const valid = alert.dependency.package.ecosystem === 'npm' && ranges.length > 0
            && ranges.every((r) => r && semver.validRange(r));
        const affected = (entries) => entries.filter((v) => v?.resolution?.startsWith(`${name}@npm:`)
            && semver.valid(String(v.version)) && ranges.some((r) => semver.satisfies(String(v.version), r)))
            .map((v) => String(v.version));
        const oldVersions = valid ? affected(before) : [];
        const remainingVersions = valid ? affected(after) : [];
        const fixed = valid && oldVersions.length > 0 && remainingVersions.length === 0;
        const p = triage.packages.find((p) => p.name === name);

        return {
            number: alert.number,
            package: name,
            severity: alert.security_advisory.severity,
            url: alert.html_url,
            before: oldVersions,
            remaining: remainingVersions,
            outcome: fixed ? 'expected-fixed' : 'unresolved',
            reason: fixed ? 'No matching vulnerable instance remains in the proposed lockfile'
                : !valid ? 'Unparseable or missing advisory range — needs investigation'
                    : !oldVersions.length ? 'Alert and baseline lockfile differ — remediation cannot be attributed to this PR'
                        : p.recommendations.map((r) => r.action).join('; ') || 'Requires human investigation',
        };
    });
}

const cell = (value) => String(value).replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');

export function applyProposal(input, proposal, afterManifest) {
    assert.equal(proposal.schemaVersion, 1);
    const triage = structuredClone(input.triage);
    const seen = new Set();
    for (const decision of proposal.packages || []) {
        const key = `${decision.ecosystem}:${decision.name}`;
        assert.ok(!seen.has(key), 'Duplicate package decision');
        seen.add(key);
        const p = triage.packages.find((entry) => entry.name === decision.name && entry.ecosystem === decision.ecosystem);
        assert.ok(p, 'Unknown package decision');
        assert.ok(Array.isArray(decision.recommendations) && decision.recommendations.length > 0);
        for (const recommendation of decision.recommendations) {
            assert.equal(typeof recommendation.action, 'string');
            assert.ok(recommendation.action.trim(), 'Explain proposed or unresolved work');
            assert.ok(!/^(?:not attempted;?\s*)?(?:requires human investigation|not attempted)[.!]?$/i.test(recommendation.action.trim()), 'Replace default text with a package-specific decision');
            for (const version of [recommendation.targetVersion, recommendation.pinVersion].filter((v) => v != null)) {
                const candidate = input.releases[p.name]?.find((r) => r.version === version);
                assert.ok(candidate, 'Target must have prepared registry evidence');
                const from = recommendation.applicableFromVersions || p.affectedVersions;
                assert.ok(from.length && from.every((v) => semver.valid(v) && semver.gte(version, v)
                    && candidate.applicableFromVersions.includes(v)), 'Recommendation must match a prepared forward-fix branch');
            }
        }
        p.recommendations = decision.recommendations;
        for (const version of new Set(decision.recommendations.flatMap((r) => [r.targetVersion, r.pinVersion]).filter(Boolean))) {
            p.sources.push({
                url: input.releases[p.name].find((r) => r.version === version).source,
                retrievedAt: input.preparedAt,
            });
        }
    }
    assert.deepEqual([...seen].sort(), triage.packages.map((p) => `${p.ecosystem}:${p.name}`).sort(), 'Review every package: missing explicit decisions');
    triage.analysisComplete = true;
    triage.upgradeNotes = [];
    for (const field of ['dependencies', 'devDependencies', 'resolutions', 'overrides']) {
        for (const name of new Set([...Object.keys(input.manifest[field] || {
        }), ...Object.keys(afterManifest[field] || {
        })])) {
            const before = input.manifest[field]?.[name];
            const after = afterManifest[field]?.[name];
            if (before === after) continue;
            assertPinEvidence(input, field, name, after);
            const explanation = (proposal.changes || []).find((c) => c.field === field && c.name === name);
            assert.ok(explanation?.reason?.trim(), `Explain ${field}.${name}`);
            assert.ok(explanation?.compatibility?.trim(), `Disclose compatibility for ${field}.${name}`);
            if (after !== undefined) {
                const target = ['dependencies', 'devDependencies'].includes(field)
                    ? name : pinTarget(name, Object.keys(input.releases));
                assert.ok(typeof after === 'string' && semver.validRange(after)
                    && input.releases[target]?.some((r) => semver.satisfies(r.version, after)),
                `Changed ${field}.${name} must admit a prepared registry candidate`);
            }
            const pin = input.pins.find((p) => p.selector === name);
            triage.upgradeNotes.push(`${field}.${name}: ${before ?? '(absent)'} → ${after ?? '(removed)'}. ${explanation.reason}. Compatibility: ${explanation.compatibility}.${pin ? ` Parent constraints: ${pin.parents.map((p) => `${p.name}@${p.version}: ${p.constraint}`).join('; ') || 'unverified'}.` : ''}`);
        }
    }
    return triage;
}

export function renderReport(triage) {
    const table = (headers, rows) => [
        `| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`,
        ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
    ].join('\n');
    const pins = triage.laggingPins.map((p) => [p.name, `${p.configuredPin} → ${p.effectiveVersions.join(', ')}`,
        p.parentRequirements.map((parent) => `${parent.name}@${parent.version}: ${parent.constraint}`).join('; '),
        p.evidenceLevel, p.recommendedAction]);
    return [`${triage.repository} | ${triage.collectedAt} | ${triage.baselineSha} | ${triage.collectionStatus}`, '',
        '## Packages needing updates', '', table(['Package', 'Current affected versions', 'Highest severity',
            'Direct/transitive (parent)', 'Recommended patched version / pin', 'Action / constraint caveat', 'Alerts'],
        triage.packages.map((p) => [p.name, p.affectedVersions.join(', ') || 'Unverified', p.highestSeverity,
            `${p.relationship}; ${p.parents.map((parent) => `${parent.name}@${parent.version}`).join(', ')}`,
            p.recommendations.map((r) => r.targetVersion || r.pinVersion || 'Unverified — investigate').join('; '),
            p.recommendations.map((r) => `${r.action}${r.compatibility ? ` (${r.compatibility})` : ''}`).join('; '),
            p.alerts.map((a) => `[#${a.number}](${a.url})`).join(', ')])), '',
        '## Pins behind parent requirements or unpinned resolution', '',
        `Pin assessment: ${triage.pinAssessmentStatus || 'partial'} (parent constraints; unpinned installs are not inferred).`, '',
        pins.length ? table(['Package / mechanism', 'Configured pin → effective version', 'Parent requirement', 'Evidence', 'Recommended action'], pins)
            : triage.gaps.some((gap) => gap.startsWith('Pin ')) ? 'Pin assessment incomplete; see gaps.' : 'None found.', '',
        ...triage.gaps.map((gap) => `Gap: ${gap}`),
        ...(triage.pinAssessments?.some((p) => p.status === 'unused')
            ? [`Unused resolution selectors: ${triage.pinAssessments.filter((p) => p.status === 'unused').map((p) => p.selector).join(', ')}.`] : []),
        ...(triage.pinAssessments?.some((p) => p.status === 'constraint-override')
            ? [`Existing selectors outside parent constraints: ${triage.pinAssessments.filter((p) => p.status === 'constraint-override').map((p) => p.selector).join(', ')}.`] : []),
        ...(triage.inactiveOverrides?.length ? [`Inactive npm overrides under Yarn: ${triage.inactiveOverrides.join(', ')}.`] : []), '',
        ...(triage.upgradeNotes || []).map((note) => `Review: ${note}`), '',
    ].join('\n');
}

function currentReports() {
    const evidence = JSON.parse(readFileSync('triage-results/evidence.json', 'utf8'));
    const input = JSON.parse(readFileSync('triage-results/agent-input.json', 'utf8'));
    if (input.pathEvidence) {
        assert.equal(input.pathEvidence.path, 'triage-results/dependency-paths.json');
        const proof = JSON.parse(readFileSync('triage-results/dependency-paths.json', 'utf8'));
        assert.equal(proof.fingerprint, input.fingerprint);
        assert.equal(proof.baselineSha, input.baselineSha);
        assert.equal(fingerprint(proof.paths), input.pathEvidence.hash, 'Authoritative dependency paths changed');
        input.paths = proof.paths;
    }
    assert.equal(input.baselineSha, evidence.baseline.data.sha);
    const proposal = JSON.parse(readFileSync('triage-results/proposal.json', 'utf8'));
    const triage = applyProposal(input, proposal, JSON.parse(readFileSync('package.json', 'utf8')));
    const resultPath = 'triage-results/candidate/result.json';
    const result = existsSync(resultPath) ? JSON.parse(readFileSync(resultPath, 'utf8')) : null;
    const changed = JSON.stringify(JSON.parse(readFileSync('package.json', 'utf8'))) !== JSON.stringify(input.manifest)
        || readFileSync('yarn.lock', 'utf8') !== evidence.files['yarn.lock'].data.content;
    triage.remediationStatus = remediationStatus(result, changed || (!result && proposal.changes?.length) ? ['candidate'] : []);
    if (triage.remediationStatus === 'failed') {
        for (const p of triage.packages) {
            const names = [p.name, ...(p.parents || []).map((parent) => parent.name)];
            const attempted = p.recommendations.some((r) => r.targetVersion || r.pinVersion)
                || proposal.changes?.some((edit) => pinTarget(edit.name, names));
            if (!attempted) continue;
            p.recommendations = p.recommendations.map((r) => ({
                ...r,
                targetVersion: null,
                pinVersion: null,
                action: `Not applied: candidate batch rolled back (${result.failureClass || 'install'} failure). ${result.diagnostic.split('\n')[0]}`,
            }));
        }
        triage.gaps.push(`Remediation failed: ${result.diagnostic.split('\n')[0]}`);
    }
    const report = renderReport(triage);
    const outcomes = assess(evidence, triage, readFileSync('yarn.lock', 'utf8'));
    return {
        input,
        triage,
        report,
        outcomes,
        body: renderBody(evidence, report, outcomes),
    };
}

export function renderBody(evidence, triageReport, outcomes) {
    const pending = outcomes.filter((o) => o.outcome === 'unresolved');
    const fixed = outcomes.filter((o) => o.outcome === 'expected-fixed');
    const table = (rows) => rows.length
        ? ['| Package | Severity | Alert | Result / action |', '|---|---|---|---|',
            ...rows.map((o) => `| ${cell(o.package)} | ${cell(o.severity)} | [#${o.number}](${o.url}) | ${cell(o.reason)}${o.remaining.length ? `; remaining: ${o.remaining.join(', ')}` : ''} |`)].join('\n')
        : 'None.';

    return [marker, '# Dependency maintenance', '',
        `Repository: ${evidence.repository}. Baseline: ${evidence.baseline.data.sha}. Evidence: ${evidence.collectedAt}.`, '',
        `> [!WARNING]\n> **${pending.length} findings are NOT fixed by this PR.** Follow the per-row action: investigate missing fixes or other blockers; wait for age-deferred fixes, or explicitly approve an age-policy override for critical issues.`, '',
        '## NOT FIXED — next actions', '', table(pending), '',
        `## Expected to be fixed by this PR (${fixed.length})`, '', table(fixed), '',
        'Expected fixes are based on the proposed lockfile. GitHub alerts reconcile after merge; this is not a claim of verified exploit reachability.', '',
        '## Validation', '',
        'Publication is gated on a complete live inventory, restricted manifest/lockfile diff, immutable install and the full lint/build/homepage smoke gate. Required PR CI and human approval still apply.', '',
        '<details><summary>Full two-list triage report</summary>', '', triageReport.trim(), '', '</details>', '',
    ].join('\n');
}

function validate() {
    const base = process.env.GITHUB_SHA;

    assert.match(base || '', /^[a-f0-9]{40}$/);

    const evidence = JSON.parse(readFileSync('triage-results/evidence.json', 'utf8'));
    const generated = currentReports();
    const { triage, outcomes, body } = generated;
    if (!completedRemediation(triage.remediationStatus)) {
        writeFileSync('triage-results/validation.json', JSON.stringify({
            passed: false,
            analysisComplete: triage.analysisComplete,
            remediationStatus: triage.remediationStatus,
        }));
        throw new Error('Remediation did not complete; rolled-back or unexecuted changes cannot pass as a noop');
    }

    assert.equal(evidence.baseline.data.sha, base, 'Default branch moved after the run began; recollect on a fresh run');

    const changed = execFileSync('git', ['diff', '--name-only', base], {
        encoding: 'utf8',
    }).trim().split('\n').filter(Boolean);

    assert.ok(changed.every((p) => ['package.json', 'yarn.lock'].includes(p)), 'Only package.json and yarn.lock may change');

    const before = evidence.files['package.json'].data.content;
    const after = JSON.parse(readFileSync('package.json', 'utf8'));

    for (const field of new Set([...Object.keys(before), ...Object.keys(after)])) {
        if (!['dependencies', 'devDependencies', 'overrides', 'resolutions'].includes(field)) {
            assert.deepEqual(after[field], before[field], `Cannot change manifest field ${field}`);
        }
    }

    assert.deepEqual(JSON.parse(readFileSync('triage-results/triage.json', 'utf8')), triage);
    assert.equal(readFileSync('triage-results/weekly-report.md', 'utf8'), generated.report);
    assert.equal(readFileSync('triage-results/pr-body.md', 'utf8'), body, 'PR body must be generated from the final candidate');
    assert.ok(Buffer.byteLength(body, 'utf8') < 60000, 'PR body exceeds the reviewable size budget');

    if (changed.length) {
        const candidate = JSON.parse(readFileSync('triage-results/candidate/state.json', 'utf8'));
        const result = JSON.parse(readFileSync('triage-results/candidate/result.json', 'utf8'));
        assert.equal(candidate.baselineSha, base);
        assert.equal(candidate.fingerprint, generated.input.fingerprint);
        assert.ok(candidate.attempts > 0 && candidate.attempts <= 3, 'Candidate repair budget exceeded');
        assert.equal(readFileSync('package.json', 'utf8'), candidate.manifest, 'Use the candidate helper for final manifest edits');
        assert.equal(readFileSync('yarn.lock', 'utf8'), candidate.lock, 'Use the candidate helper for final lockfile edits');
        assert.ok(result.passed || result.rolledBack, 'Candidate execution did not complete');
        execFileSync(process.execPath, ['.yarn/releases/yarn-4.14.1.cjs', 'install', '--immutable', '--mode=skip-build'], {
            stdio: 'inherit',
        });
        verifyGraphChanges(generated.input, after, installedGraph());
        execFileSync(process.execPath, ['ci/dependency-smoke.mjs'], {
            stdio: 'inherit',
        });
    }

    writeFileSync('triage-results/validation.json', `${JSON.stringify({
        passed: true,
        analysisComplete: triage.analysisComplete === true,
        remediationStatus: triage.remediationStatus,
        base,
        changed,
        outcomes,
        testsRun: changed.length > 0,
        fingerprint: generated.input.fingerprint,
    }, null, 2)}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    if (process.argv[2] === 'render') {
        const generated = currentReports();
        writeFileSync('triage-results/triage.json', `${JSON.stringify(generated.triage, null, 2)}\n`);
        writeFileSync('triage-results/weekly-report.md', generated.report);
        writeFileSync('triage-results/pr-body.md', generated.body);
    } else if (process.argv[2] === 'initialize') {
        writeFileSync('triage-results/proposal.json', `${JSON.stringify({
            schemaVersion: 1,
            packages: [],
            changes: [],
        })}\n`);
    } else if (process.argv[2] === 'validate') {
        if (existsSync('triage-results/validation.json')) {
            writeFileSync('triage-results/validation.json', '{"passed":false}\n');
        }

        validate();
    } else {
        throw new Error('Use initialize, render or validate');
    }
}
