import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import YAML from 'yaml';
import {
    assess, renderBody, marker,
} from '../ci/dependency-maintenance.mjs';
import { replaceOld, fixedAlerts } from '../ci/replace-maintenance-pr.mjs';

const repository = 'visitscotland/visitscotland-dot-com-frontend';
const baselineSha = 'a'.repeat(40);

function lock(...versions) {
    return YAML.stringify(Object.fromEntries(versions.map((version) => [
        `example@npm:${version}`,
        {
            version,
            resolution: `example@npm:${version}`,
        },
    ])));
}

function inventory(range = '>= 1.0.0, < 1.0.2') {
    const alerts = [1, 2].map((number) => ({
        number,
        html_url: `https://github.com/${repository}/security/dependabot/${number}`,
        dependency: {
            package: {
                name: 'example',
                ecosystem: 'npm',
            },
        },
        security_advisory: {
            severity: number === 1 ? 'high' : 'critical',
            vulnerabilities: [{
                package: {
                    name: 'example',
                    ecosystem: 'npm',
                },
                vulnerable_version_range: number === 1 ? range : '< 1.0.3',
            }],
        },
    }));
    const evidence = {
        status: 'complete',
        mode: 'live',
        repository,
        collectedAt: '2026-10-23T09:00:00Z',
        baseline: {
            data: {
                sha: baselineSha,
            },
        },
        alerts: {
            data: alerts,
        },
        files: {
            'yarn.lock': {
                data: {
                    content: lock('1.0.1'),
                },
            },
        },
    };
    const triage = {
        schemaVersion: 2,
        collectionStatus: 'complete',
        evidenceMode: 'live',
        repository,
        baselineSha,
        packages: [{
            name: 'example',
            ecosystem: 'npm',
            highestSeverity: 'critical',
            alerts: alerts.map(({ number }) => ({
                number,
            })),
            recommendations: [{
                action: 'Update the parent | investigate compatibility',
            }],
        }],
    };

    return {
        evidence,
        triage,
    };
}

function fixReport(numbers) {
    return renderBody({
        repository,
        baseline: {
            data: {
                sha: baselineSha,
            },
        },
        collectedAt: '2026-10-23',
    }, '',
    numbers.map((number) => ({
        number,
        package: 'example',
        severity: 'high',
        url: `https://github.com/${repository}/security/dependabot/${number}`,
        outcome: 'expected-fixed',
        reason: 'Updated',
        remaining: [],
    })));
}

function maintenancePr(number, overrides = {
}) {
    return {
        number,
        state: 'open',
        user: {
            login: 'github-actions[bot]',
        },
        head: {
            repo: {
                full_name: repository,
            },
        },
        base: {
            ref: 'main',
        },
        title: '[dependency-maintenance] Security updates',
        body: fixReport([1]),
        ...overrides,
    };
}

test('comma-separated ranges are evaluated and unresolved findings lead the PR', () => {
    const { evidence, triage } = inventory();
    const outcomes = assess(evidence, triage, lock('1.0.2'));

    assert.deepEqual(outcomes.map((outcome) => outcome.outcome), ['expected-fixed', 'unresolved']);

    const body = renderBody(evidence, 'Full triage report', outcomes);

    assert.ok(body.includes(marker));
    assert.ok(body.includes('1 findings are NOT fixed'));
    assert.ok(body.indexOf('## NOT FIXED') < body.indexOf('## Expected to be fixed'));
    assert.ok(body.includes('parent \\| investigate'));
    assert.ok(body.includes('Full triage report'));
});

test('a patched copy does not hide another vulnerable lockfile instance', () => {
    const { evidence, triage } = inventory();
    const outcomes = assess(evidence, triage, lock('1.0.1', '1.0.3'));

    assert.ok(outcomes.every((outcome) => outcome.outcome === 'unresolved'));
    assert.deepEqual(outcomes[0].remaining, ['1.0.1']);
});

test('invalid ranges and baseline discrepancies never become claimed fixes', () => {
    const { evidence, triage } = inventory('not a semver range');

    assert.equal(assess(evidence, triage, lock('1.0.3'))[0].outcome, 'unresolved');

    evidence.files['yarn.lock'].data.content = lock('1.0.3');

    const outcomes = assess(evidence, triage, lock('1.0.4'));

    assert.ok(outcomes.every((outcome) => outcome.outcome === 'unresolved'));
    assert.match(outcomes[1].reason, /baseline lockfile differ/);
});

test('incomplete, fixture, missing, duplicate and inconsistent triage is rejected', () => {
    const mutations = [
        (evidence) => {
            evidence.status = 'incomplete';
        },
        (evidence) => {
            evidence.mode = 'fixture';
        },
        (_, triage) => {
            triage.collectionStatus = 'incomplete';
        },
        (_, triage) => {
            triage.evidenceMode = 'fixture';
        },
        (_, triage) => {
            triage.baselineSha = 'b'.repeat(40);
        },
        (_, triage) => {
            triage.repository = 'other/repo';
        },
        (_, triage) => {
            triage.packages[0].alerts.pop();
        },
        (_, triage) => {
            triage.packages[0].alerts.push({
                number: 1,
            });
        },
        (_, triage) => {
            triage.packages[0].highestSeverity = 'low';
        },
    ];

    for (const mutate of mutations) {
        const { evidence, triage } = inventory();

        mutate(evidence, triage);
        assert.throws(() => assess(evidence, triage, lock('1.0.3')));
    }
});

test('replacement closes only earlier matching bot-owned maintenance PRs', async() => {
    const replacement = maintenancePr(20);
    const candidates = [
        maintenancePr(10),
        maintenancePr(11, {
            user: {
                login: 'human',
            },
        }),
        maintenancePr(12, {
            user: {
                login: 'dependabot[bot]',
            },
        }),
        maintenancePr(13, {
            body: '',
        }),
        maintenancePr(14, {
            base: {
                ref: 'other',
            },
        }),
        maintenancePr(15, {
            head: {
                repo: {
                    full_name: 'other/repo',
                },
            },
        }),
        maintenancePr(16, {
            title: 'Unrelated PR',
        }),
        maintenancePr(21),
        replacement,
    ];
    const writes = [];
    const request = async(path, method = 'GET', body) => {
        if (method === 'PATCH') {
            writes.push({
                path,
                body,
            });

            return {
            };
        }

        if (path.includes('?')) {
            return candidates;
        }

        return candidates.find((pr) => path.endsWith(`/${pr.number}`));
    };

    assert.deepEqual(await replaceOld(repository, 20, request), [10]);
    assert.deepEqual(writes, [{
        path: `/repos/${repository}/pulls/10`,
        body: {
            state: 'closed',
        },
    }]);
});

test('a missing or closed replacement prevents cleanup writes', async() => {
    for (const number of ['', 20]) {
        const writes = [];
        const request = async(path, method = 'GET') => {
            if (method !== 'GET') {
                writes.push(path);
            }

            return maintenancePr(20, {
                state: 'closed',
            });
        };

        await assert.rejects(() => replaceOld(repository, number, request));
        assert.deepEqual(writes, []);
    }
});

test('a replacement closed after lookup leaves the previous PR open', async() => {
    let replacementReads = 0;
    const writes = [];
    const request = async(path, method = 'GET') => {
        if (method !== 'GET') {
            writes.push(path);
        }

        if (path.includes('?')) {
            return [maintenancePr(10)];
        }

        if (path.endsWith('/20')) {
            replacementReads += 1;

            return maintenancePr(20, {
                state: replacementReads === 1 ? 'open' : 'closed',
            });
        }

        return maintenancePr(10);
    };

    await assert.rejects(() => replaceOld(repository, 20, request));
    assert.deepEqual(writes, []);
});

test('workflows retain scheduled and manual runs, opt-in gates and validated live publication', () => {
    const read = (file) => readFileSync(new URL(`../.github/workflows/${file}`, import.meta.url), 'utf8');
    const caller = YAML.parse(read('dependency-maintenance.yml'));
    const source = YAML.parse(read('dependency-maintenance-agent.md').split('---')[1]);
    const compiled = YAML.parse(read('dependency-maintenance-agent.lock.yml'));

    assert.deepEqual(caller.on.schedule, [{
        cron: '0 9 * * 3,5',
        timezone: 'Europe/London',
    }]);
    assert.ok(Object.hasOwn(caller.on, 'workflow_dispatch'));
    assert.match(caller.jobs.collect.if, /DEPENDENCY_MAINTENANCE_ENABLED/);
    assert.match(source.if, /DEPENDENCY_MAINTENANCE_ENABLED/);
    assert.equal(source['safe-outputs'].staged, false);
    assert.equal(source.permissions.contents, 'read');
    assert.equal(source.permissions['pull-requests'], 'read');
    assert.match(compiled.jobs.safe_outputs.if, /needs\.agent\.result == 'success'/);
    assert.ok(compiled.on.workflow_call.outputs.created_pr_number);
    assert.equal(caller.jobs.maintain.secrets.DEPENDABOT_READ_TOKEN, undefined);
    assert.match(caller.jobs.replace_previous.if, /created_pr_number != ''/);
});


test('cleanup retains old fixes missing from the replacement and rejects unparseable reports', async() => {
    const old = maintenancePr(10, {
        body: fixReport([1, 2]),
    });
    for (const body of [fixReport([1]), marker, fixReport([]), fixReport([1, 2]).replace('security/dependabot/2', 'security/dependabot/3')]) {
        const writes = [];
        const replacement = maintenancePr(20, {
            body,
        });
        const request = async(path, method = 'GET') => {
            if (method === 'PATCH') writes.push(path);
            if (path.includes('?')) return [old];
            return path.endsWith('/20') ? replacement : old;
        };
        assert.deepEqual(await replaceOld(repository, 20, request), []);
        assert.deepEqual(writes, []);
    }
    assert.deepEqual([...fixedAlerts(fixReport([1, 2]), repository)], ['1', '2']);
    assert.equal(fixedAlerts(fixReport([1]), 'other/repo'), null);
});

test('cleanup accepts a strict superset and rechecks coverage immediately before closing', async() => {
    for (const changed of [false, true]) {
        let reads = 0;
        const writes = [];
        const request = async(path, method = 'GET') => {
            if (method === 'PATCH') writes.push(path);
            if (path.includes('?')) return [maintenancePr(10)];
            if (path.endsWith('/20')) {
                reads += 1;
                return maintenancePr(20, {
                    body: fixReport(changed && reads > 1 ? [2] : [1, 2]),
                });
            }
            return maintenancePr(10);
        };
        assert.deepEqual(await replaceOld(repository, 20, request), changed ? [] : [10]);
        assert.equal(writes.length, changed ? 0 : 1);
    }
});
