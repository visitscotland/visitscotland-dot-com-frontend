import { setTimeout } from 'node:timers/promises';

// Retry only idempotent reads. Never print URLs, credentials or response bodies.
export async function readJson(url, options = {
}, {
    fetcher = fetch, sleep = setTimeout, random = Math.random, now = Date.now,
    retries = 2, maxDelayMs = 60_000,
} = {
}) {
    for (let attempt = 0; ; attempt += 1) {
        const response = await fetcher(url, {
            ...options,
            method: 'GET',
            redirect: 'error',
            signal: AbortSignal.timeout(30_000),
        });
        if (response.ok) return {
            data: await response.json(),
            headers: response.headers,
        };
        const retryAfter = response.headers.get('retry-after');
        const limited = response.status === 429 || (response.status === 403
            && (retryAfter !== null || response.headers.get('x-ratelimit-remaining') === '0'));
        if (attempt >= retries || (!limited && ![502, 503, 504].includes(response.status))) {
            throw new Error(`HTTP ${response.status}`);
        }
        let serverDelay = 0;
        if (retryAfter !== null) {
            serverDelay = /^\d+(?:\.\d+)?$/.test(retryAfter)
                ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - now();
        } else if (limited && response.headers.get('x-ratelimit-reset')) {
            serverDelay = Number(response.headers.get('x-ratelimit-reset')) * 1000 - now();
        }
        const delay = Math.max(2000 * (2 ** attempt), serverDelay || 0) + Math.floor(random() * 1000);
        // A long reset is a reason to stop, not to retry earlier than requested.
        if (delay > maxDelayMs) throw new Error(`HTTP ${response.status}`);
        await response.body?.cancel();
        await sleep(delay);
    }
}
