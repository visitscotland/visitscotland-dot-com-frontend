import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const marker = '<!-- dotcom-dependency-maintenance:v1 -->';
const prefix = '[dependency-maintenance] ';

export function owned(pr, repository, base) {
    return pr.state === 'open' && pr.user?.login === 'github-actions[bot]'
        && pr.head?.repo?.full_name === repository && pr.base?.ref === base
        && pr.title.startsWith(prefix) && pr.body?.includes(marker);
}

export async function replaceOld(repository, replacementNumber, request) {
    assert.match(repository || '', /^[\w.-]+\/[\w.-]+$/);
    assert.match(String(replacementNumber), /^[1-9]\d*$/);

    const root = `/repos/${repository}/pulls`;
    const replacement = await request(`${root}/${replacementNumber}`);

    assert.ok(owned(replacement, repository, replacement.base?.ref), 'Replacement is not a verified open maintenance PR');

    const candidates = [];

    for (let page = 1; page <= 100; page += 1) {
        const prs = await request(`${root}?state=open&per_page=100&page=${page}`);

        assert.ok(Array.isArray(prs));
        candidates.push(...prs);

        if (prs.length < 100) {
            break;
        }

        assert.ok(page < 100, 'PR inventory truncated; refusing cleanup');
    }

    const closed = [];

    for (const pr of candidates) {
        if (pr.number >= replacement.number || !owned(pr, repository, replacement.base.ref)) {
            continue;
        }

        const fresh = await request(`${root}/${pr.number}`);

        if (!owned(fresh, repository, replacement.base.ref)) {
            continue;
        }

        // Recheck the replacement immediately before each close. Never delete branches.
        const current = await request(`${root}/${replacement.number}`);

        assert.ok(owned(current, repository, replacement.base.ref), 'Replacement is no longer open');
        await request(`${root}/${pr.number}`, 'PATCH', {
            state: 'closed',
        });
        closed.push(pr.number);
    }

    return closed;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const request = async(path, method = 'GET', body) => {
        const response = await fetch(`https://api.github.com${path}`, {
            method,
            redirect: 'error',
            signal: AbortSignal.timeout(30000),
            headers: {
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json',
            },
            ...(body ? {
                body: JSON.stringify(body),
            } : {
            }),
        });

        if (!response.ok) {
            throw new Error(`GitHub HTTP ${response.status}`);
        }

        return response.json();
    };

    console.log(`Closed superseded maintenance PRs: ${(await replaceOld(process.env.GITHUB_REPOSITORY, process.env.REPLACEMENT_PR, request)).join(', ') || 'none'}`);
}
