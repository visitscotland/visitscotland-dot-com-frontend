import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import YAML from 'yaml';

const workflowText = readFileSync(new URL('../.github/workflows/dependabot-auto-merge.yml', import.meta.url), 'utf8');
const workflow = YAML.parse(workflowText);
const script = workflow.jobs.evaluate.steps.at(-1).run;
const alignmentCode = script.split('// BEGIN LOCKFILE ALIGNMENT CHECK')[1].split('\n').slice(1).join('\n').split('// END LOCKFILE ALIGNMENT CHECK')[0];
const alignment = runInNewContext(`${alignmentCode}\nevaluateLockfileAlignment`);
const lock = (version, extra = '') => `__metadata:\n  version: 8\n\n"thing@npm:^1.0.0":\n  version: ${version}\n  resolution: "thing@npm:${version}"\n  checksum: "checksum-${version}"\n${extra}`;

test('lockfile fallback accepts stable patch/minor alignment but rejects unsafe or structural changes', () => {
    assert.equal(alignment(lock('1.0.0'), lock('1.0.1')).length, 1);
    assert.equal(alignment(lock('1.0.0'), lock('1.1.0')).length, 1);
    for (const after of [lock('2.0.0'), lock('0.9.0'), lock('1.1.0-beta.1'),
        lock('1.0.0'), lock('1.0.1', '  dependencies:\n    another: "npm:^1"\n'),
        lock('1.0.1').replace('thing@npm:^1.0.0', 'thing@npm:^2.0.0'),
        lock('1.0.1').replace('thing@npm:1.0.1', 'thing@https://example.invalid/package.tgz')]) {
        assert.equal(alignment(lock('1.0.0'), after), null);
    }
});

test('privileged merge workflow verifies bot metadata, never checks out PR code, and binds actions to the reviewed head', () => {
    assert.ok(workflow.on.pull_request_target);
    assert.match(workflow.jobs.evaluate.if, /dependabot\[bot\]/);
    assert.match(workflow.jobs.evaluate.if, /head.repo.full_name == github.repository/);
    assert.ok(workflow.jobs.evaluate.steps.some((step) => step.uses?.startsWith('dependabot/fetch-metadata@')));
    assert.ok(workflow.jobs.evaluate.steps.every((step) => !step.uses?.startsWith('actions/checkout@')));
    assert.match(script, /PACKAGE_ECOSYSTEM !== 'npm_and_yarn'/);
    assert.match(script, /version-update:semver-patch.*version-update:semver-minor/);
    assert.match(script, /new Set\(\['package.json', 'yarn.lock'\]\)/);
    assert.match(script, /commit_id=\$\{EXPECTED_HEAD\}/);
    assert.match(script, /'--auto', '--squash'/);
    assert.match(script, /'--match-head-commit', EXPECTED_HEAD/);
});


test('unreadable lockfile fallback records manual review without approval or merge', () => {
    for (const unavailable of ['encoding', 'api']) {
        const comments = [];
        const commands = [];
        const repo = 'example/demo';
        const sha = 'b'.repeat(40);
        const pr = {
            state: 'open',
            draft: false,
            user: {
                login: 'dependabot[bot]',
            },
            head: {
                sha,
                repo: {
                    full_name: repo,
                },
            },
            base: {
                sha: 'a'.repeat(40),
            },
            changed_files: 1,
        };
        const gh = (_binary, args) => {
            commands.push(args);
            assert.equal(args[0], 'api', 'Must not attempt to merge');
            const endpoint = args.find((arg) => arg.startsWith('repos/'));
            if (endpoint.includes('/contents/')) {
                if (unavailable === 'api') throw new Error('Unavailable');
                return JSON.stringify({
                    encoding: 'none',
                });
            }
            if (endpoint.includes('/files')) return JSON.stringify([[{
                filename: 'yarn.lock',
                status: 'modified',
            }]]);
            if (endpoint.includes('/comments')) {
                if (args.includes('POST')) comments.push(args.find((arg) => arg.startsWith('body=')));
                return JSON.stringify(args.includes('--paginate') ? [[]] : {
                });
            }
            return JSON.stringify(pr);
        };
        const code = script.slice(script.indexOf('(() => {'), script.lastIndexOf('})();') + 5);
        runInNewContext(code, {
            require: (name) => {
                if (name === 'node:child_process') return {
                    execFileSync: gh,
                };
                if (name === 'node:fs') return {
                    appendFileSync() {},
                };
                throw new Error(name);
            },
            console: {
                log() {},
            },
            Buffer,
            process: {
                env: {
                    GH_REPO: repo,
                    PR_NUMBER: '7',
                    EXPECTED_HEAD: sha,
                    UPDATE_TYPE: '',
                    PACKAGE_ECOSYSTEM: 'npm_and_yarn',
                    GITHUB_STEP_SUMMARY: 'summary',
                },
            },
        });
        assert.equal(comments.length, 1);
        assert.match(comments[0], /Manual review required/);
        assert.match(comments[0], /could not be retrieved/);
        assert.ok(!commands.some((args) => args.includes('event=APPROVE')));
    }
});
