import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { access, mkdir } from 'node:fs/promises';
import { createConnection } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { createCmsServer } from './cms-server.mjs';
import { smokeEnvironment } from './environment.mjs';

const settings = smokeEnvironment();
let child;
let cms;
let closing = false;

async function stop(code = 0) {
    if (closing) {
        return;
    }

    closing = true;
    child?.kill();
    cms?.closeAllConnections();
    cms?.close();
    process.exitCode = code;
}

process.on('SIGTERM', () => stop());
process.on('SIGINT', () => stop());

try {
    await access('.output/server/index.mjs');
    await mkdir('smoke-results', {
        recursive: true,
    });
    cms = await createCmsServer(settings);
    await new Promise((done, reject) => {
        cms.once('error', reject);
        cms.listen(settings.cmsPort, '127.0.0.1', done);
    });

    // Refuse an occupied app port: never test an unrelated process accidentally.
    const occupied = await new Promise((done) => {
        const socket = createConnection({
            host: '127.0.0.1',
            port: settings.appPort,
        });

        socket.once('connect', () => {
            socket.destroy();
            done(true);
        });
        socket.once('error', () => done(false));
    });

    if (occupied) {
        throw new Error('Smoke app port is already in use');
    }

    const log = createWriteStream('smoke-results/server.log');

    child = spawn(process.execPath, ['.output/server/index.mjs'], {
        env: settings.env,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.pipe(log, {
        end: false,
    });
    child.stderr.pipe(log, {
        end: false,
    });
    child.on('error', (error) => {
        console.error(error);
        stop(1);
    });
    child.on('exit', (code) => {
        log.end();

        if (!closing) {
            console.error(`Production server exited unexpectedly (${code})`);
            stop(1);
        }
    });

    const deadline = Date.now() + 60_000;

    while (!closing) {
        try {
            // A port is readiness only. The tests separately require HTTP 200.
            const socket = createConnection({
                host: '127.0.0.1',
                port: settings.appPort,
            });

            await new Promise((done, reject) => {
                socket.once('connect', done);
                socket.once('error', reject);
            });
            socket.destroy();
            console.log('SMOKE_SERVER_READY');
            break;
        } catch {
            if (Date.now() > deadline) {
                throw new Error('Production server startup timed out');
            }

            await delay(200);
        }
    }
} catch (error) {
    console.error(error);
    await stop(1);
}
