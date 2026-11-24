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

// Only the generated expected-fixes table is evidence of fix coverage.
// Missing or malformed reports retain the old PR for manual review.
export function fixedAlerts(body, repository) {
    if (typeof body !== 'string') return null;
    const section = body.replace(/\r\n/g, '\n').match(/^## Expected to be fixed by this PR \((\d+)\)\n\n([\s\S]*?)\n\n/m);
    if (!section) return null;
    const count = Number(section[1]);
    if (count === 0) return section[2].trim() === 'None.' ? new Set() : null;
    const lines = section[2].split('\n');
    if (lines[0] !== '| Package | Severity | Alert | Result / action |' || lines[1] !== '|---|---|---|---|') return null;
    const alerts = new Set();
    for (const line of lines.slice(2)) {
        const row = line.match(/^\| [^|]* \| [^|]* \| \[#(\d+)\]\((https:\/\/github\.com\/[^)]+)\) \|/);
        if (!row || row[2] !== `https://github.com/${repository}/security/dependabot/${row[1]}`) return null;
        alerts.add(row[1]);
    }
    return alerts.size === count && lines.length === count + 2 ? alerts : null;
}

function coversPrevious(previous, replacement, repository) {
    const before = fixedAlerts(previous.body, repository);
    const after = fixedAlerts(replacement.body, repository);
    return before?.size > 0 && after !== null && [...before].every((number) => after.has(number));
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

        if (!owned(fresh, repository, replacement.base.ref) || !coversPrevious(fresh, replacement, repository)) {
            continue;
        }

        // Recheck the replacement immediately before each close. Never delete branches.
        const current = await request(`${root}/${replacement.number}`);

        assert.ok(owned(current, repository, replacement.base.ref), 'Replacement is no longer open');
        if (!coversPrevious(fresh, current, repository)) continue;
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
