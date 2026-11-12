import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import {
    mkdtemp, mkdir, writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCmsServer } from './cms-server.mjs';
import { smokeEnvironment } from './environment.mjs';

test('fixture serves real page-model JSON and rejects unexpected routes', async() => {
    const server = await createCmsServer({
        appOrigin: 'http://127.0.0.1:4317',
        cmsOrigin: 'http://127.0.0.1:4318',
    });

    try {
        await new Promise((done) => server.listen(0, '127.0.0.1', done));

        const origin = `http://127.0.0.1:${server.address().port}`;
        const response = await fetch(`${origin}/resourceapi`);
        const fixture = await response.json();

        assert.equal(response.status, 200);
        assert.equal(fixture.page.document.data.title, 'Discover Scotland');
        assert.equal(fixture.links.site.href, 'http://127.0.0.1:4317/');
        assert.equal((await fetch(`${origin}/unexpected`)).status, 404);
        assert.equal((await (await fetch(`${origin}/__requests`)).json()).length, 1);
    } finally {
        server.closeAllConnections();
        await new Promise((done) => server.close(done));
    }
});

test('test configuration rejects invalid or conflicting ports', () => {
    assert.throws(() => smokeEnvironment({
        SMOKE_APP_PORT: 'bad',
    }), /Invalid/);
    assert.throws(() => smokeEnvironment({
        SMOKE_APP_PORT: '4318',
    }), /different/);
    assert.equal(smokeEnvironment({
    }).env.NUXT_PUBLIC_AWS_RUM_APPLICATION_ID, '');
});

test('missing or immediately exiting production server fails startup', async() => {
    const directory = await mkdtemp(join(tmpdir(), 'vs-smoke-harness-'));
    const entry = fileURLToPath(new URL('./serve.mjs', import.meta.url));
    const freePort = async() => {
        const reservation = createServer();

        await new Promise((done) => reservation.listen(0, '127.0.0.1', done));

        const port = reservation.address().port;

        await new Promise((done) => reservation.close(done));

        return port;
    };
    const cmsPort = await freePort();
    let appPort = await freePort();

    while (appPort === cmsPort) {
        appPort = await freePort();
    }

    const run = () => new Promise((done, reject) => {
        const child = spawn(process.execPath, [entry], {
            cwd: directory,
            env: {
                ...process.env,
                SMOKE_CMS_PORT: String(cmsPort),
                SMOKE_APP_PORT: String(appPort),
            },
            stdio: 'pipe',
            windowsHide: true,
        });
        let output = '';

        child.stdout.on('data', (chunk) => {
            output += chunk;
        });
        child.stderr.on('data', (chunk) => {
            output += chunk;
        });

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error('Startup failure was not detected'));
        }, 10_000);

        child.once('error', reject);
        child.once('exit', (code) => {
            clearTimeout(timeout);
            done({
                code,
                output,
            });
        });
    });
    const missing = await run();

    assert.notEqual(missing.code, 0);
    assert.match(missing.output, /ENOENT/);
    assert.doesNotMatch(missing.output, /SMOKE_SERVER_READY/);
    await mkdir(join(directory, '.output/server'), {
        recursive: true,
    });
    await writeFile(join(directory, '.output/server/index.mjs'), 'process.exit(0);');

    const exited = await run();

    assert.notEqual(exited.code, 0);
    assert.match(exited.output, /Production server exited unexpectedly/);
    assert.doesNotMatch(exited.output, /SMOKE_SERVER_READY/);
});
