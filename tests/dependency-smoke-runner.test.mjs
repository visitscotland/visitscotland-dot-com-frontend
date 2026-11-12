import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Exercise the real runner's control flow without launching lint/build/browser processes.
test('a signal during runtime preparation prevents every later smoke stage', async() => {
    const source = readFileSync(new URL('../ci/dependency-smoke.mjs', import.meta.url), 'utf8')
        .replace(/^import .*;\r?\n/gm, '');
    const handlers = {
    };
    let result;
    let spawns = 0;
    const process = {
        argv: ['node', 'dependency-smoke.mjs'],
        env: {
        },
        on: (signal, handler) => { handlers[signal] = handler; },
        exitCode: undefined,
    };
    await runInNewContext(`(async() => {${source}})()`, {
        process,
        Set,
        JSON,
        console: {
            log() {},
            error() {},
        },
        spawn: () => { spawns += 1; assert.fail('Cancelled runner launched a stage'); },
        createWriteStream: () => assert.fail('Cancelled runner opened a stage log'),
        mkdir: async() => {},
        writeFile: async(_path, value) => { result = JSON.parse(value); },
        terminateTree: () => {},
        smokeEnvironment: () => ({
            env: {
            },
        }),
        prepareSmokeRuntime: async() => { handlers.SIGTERM(); return {
        }; },
    });
    assert.equal(spawns, 0);
    assert.equal(process.exitCode, 1);
    assert.equal(result.passed, false);
    assert.equal(result.results.length, 0);
});
