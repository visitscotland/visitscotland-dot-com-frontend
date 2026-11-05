import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import {
    mkdtemp, writeFile, rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import {
    yarnEnvironment, installDiagnostic, remediationStatus, completedRemediation,
} from '../ci/dependency-execution.mjs';

test('proxy mapping preserves explicit Yarn settings and never mutates the host environment', () => {
    const environment = {
        HTTP_PROXY: 'http://firewall:3128',
        HTTPS_PROXY: 'http://secure:3128',
    };
    assert.deepEqual(yarnEnvironment(environment), {
        ...environment,
        YARN_HTTP_PROXY: environment.HTTP_PROXY,
        YARN_HTTPS_PROXY: environment.HTTPS_PROXY,
    });
    assert.equal(environment.YARN_HTTP_PROXY, undefined);
    assert.equal(yarnEnvironment({
        HTTP_PROXY: 'http://firewall',
        YARN_HTTP_PROXY: 'http://explicit',
    }).YARN_HTTP_PROXY, 'http://explicit');
    assert.equal(yarnEnvironment({
        http_proxy: 'http://lowercase',
    }).YARN_HTTPS_PROXY, 'http://lowercase');
});

test('primary network errors survive bundled Yarn crash dumps and redact URL credentials', () => {
    const log = `\u001B[91mYN0001: Error [ERR_SOCKET_CLOSED_BEFORE_CONNECTION]: Socket closed before the connection was established\n${'bundle-code'.repeat(10000)}\nError: The onCancel handler was attached after the promise settled.\nError: https://user:secret@registry.example/package`;
    const result = installDiagnostic(log);
    assert.equal(result.failureClass, 'network');
    assert.match(result.diagnostic.split('\n')[0], /ERR_SOCKET_CLOSED_BEFORE_CONNECTION/);
    assert.ok(result.diagnostic.length <= 3000);
    assert.ok(!result.diagnostic.includes('bundle-code'));
    assert.ok(!result.diagnostic.includes('secret'));
    assert.equal(installDiagnostic('', 'ETIMEDOUT').failureClass, 'timeout');
});

test('rolled-back zero-diff attempts remain failed, while retained partial fixes can be validated', () => {
    assert.equal(remediationStatus({
        passed: false,
        rolledBack: true,
    }, []), 'failed');
    assert.equal(completedRemediation('failed'), false);
    assert.equal(remediationStatus({
        passed: false,
        rolledBack: true,
    }, ['package.json']), 'partial');
    assert.equal(remediationStatus(null, ['package.json']), 'missing');
    assert.equal(completedRemediation(undefined), false);
    assert.equal(completedRemediation('not-attempted'), true);
});

test('the checked-in Yarn routes registry metadata through the configured child-process proxy', async() => {
    const directory = await mkdtemp(join(tmpdir(), 'yarn-proxy-'));
    const requests = [];
    const proxy = createServer((request, response) => {
        requests.push(request.url);
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify({
            name: 'proxy-proof',
            'dist-tags': {
                latest: '1.0.0',
            },
            versions: {
                '1.0.0': {
                    name: 'proxy-proof',
                    version: '1.0.0',
                },
            },
        }));
    });
    proxy.on('connect', (request, socket) => {
        requests.push(`CONNECT ${request.url}`);
        socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        socket.once('data', () => {
            const body = JSON.stringify({
                name: 'proxy-proof',
                'dist-tags': {
                    latest: '1.0.0',
                },
                versions: {
                    '1.0.0': {
                        name: 'proxy-proof',
                        version: '1.0.0',
                    },
                },
            });
            socket.end(`HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(body)}\r\nConnection: close\r\n\r\n${body}`);
        });
    });
    await new Promise((done) => proxy.listen(0, '127.0.0.1', done));
    try {
        await writeFile(join(directory, 'package.json'), '{}');
        await writeFile(join(directory, '.yarnrc.yml'), 'npmRegistryServer: "http://registry-probe.invalid"\nunsafeHttpWhitelist:\n  - registry-probe.invalid\nhttpRetry: 0\n');
        const env = {
            ...process.env,
            HTTP_PROXY: `http://127.0.0.1:${proxy.address().port}`,
            YARN_IGNORE_PATH: '1',
        };
        delete env.YARN_HTTP_PROXY;
        delete env.YARN_HTTPS_PROXY;
        const { stdout } = await promisify(execFile)(process.execPath, [fileURLToPath(new URL('../.yarn/releases/yarn-4.14.1.cjs', import.meta.url)), 'npm', 'info', 'proxy-proof', '--json'], {
            cwd: directory,
            env: yarnEnvironment(env),
            timeout: 10000,
        });
        assert.match(stdout, /proxy-proof/);
        assert.ok(requests.some((url) => url === 'http://registry-probe.invalid/proxy-proof' || url === 'CONNECT registry-probe.invalid:80'));
    } finally {
        await new Promise((done) => proxy.close(done));
        await rm(directory, {
            recursive: true,
            force: true,
        });
    }
});
