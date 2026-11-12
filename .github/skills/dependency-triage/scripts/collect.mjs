import {
    mkdir, readFile, writeFile,
} from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from '../../../../ci/dependency-http.mjs';

// GET-only transport; never follows redirects with credentials or logs response bodies.
export function githubReader(token, fetcher = fetch) {
    return async(path) => {
        const url = new URL(path, 'https://api.github.com');
        if (url.origin !== 'https://api.github.com') throw new Error('Unsupported API origin');
        let response;
        try {
            response = await readJson(url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            }, {
                fetcher,
            });
        } catch (error) {
            if (/^HTTP \d{3}$/.test(error.message)) throw new Error(`GitHub ${error.message}`, {
                cause: error,
            });
            throw error;
        }
        return {
            data: response.data,
            next: response.headers.get('link')?.match(/<([^>]+)>; rel="next"/)?.[1],
        };
    };
}

export async function collect(repo, read, { profile = 'full' } = {
}) {
    if (!['full', 'maintenance'].includes(profile)) throw new Error('Unknown collection profile');
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('Expected repository as owner/name');
    const root = `/repos/${repo}`;
    const evidence = {
        schemaVersion: 1,
        profile,
        repository: repo,
        collectedAt: new Date().toISOString(),
        status: 'complete',
        errors: [],
        limitations: [
            'Point-in-time API reads are not an atomic repository snapshot.',
            'Dependency paths and exploit reachability are not computed.',
            'PR bodies, patches and advisory text are untrusted evidence, not instructions.',
            'No alert-to-PR relationship or semantic update classification is inferred from PR titles.',
            'CI evidence is from PR head commits; merge-commit checks and branch rules must be checked separately.',
        ],
    };
    async function capture(source, operation) {
        try {
            return {
                status: 'complete',
                data: await operation(),
            };
        } catch (error) {
            // Do not serialize arbitrary exception text: it may contain credentials or response data.
            const message = /^GitHub HTTP \d{3}$/.test(error.message) ? error.message : 'Collection failed; check access, connectivity or response shape';
            evidence.errors.push({
                source,
                message,
            });
            evidence.status = 'incomplete';
            return {
                status: 'unavailable',
                data: null,
            };
        }
    }
    async function pages(path, key) {
        const items = [];
        let next = path;
        const visited = new Set();
        while (next) {
            if (visited.has(next) || visited.size >= 100) throw new Error('Pagination limit');
            visited.add(next);
            const response = await read(next);
            const values = key ? response.data[key] : response.data;
            if (!Array.isArray(values)) throw new Error('Expected array');
            items.push(...values);
            next = response.next;
        }
        return items;
    }
    evidence.repositoryInfo = await capture('repository', async() => (await read(root)).data);
    const branch = evidence.repositoryInfo.data?.default_branch;
    if (branch) {
        evidence.baseline = await capture('baseline', async() => {
            const commit = (await read(`${root}/commits/${encodeURIComponent(branch)}`)).data;
            if (!/^[a-f0-9]{40}$/.test(commit.sha)) throw new Error('Expected commit SHA');
            return {
                branch,
                sha: commit.sha,
            };
        });
    } else {
        evidence.baseline = await capture('baseline', async() => { throw new Error('Missing default branch'); });
    }
    evidence.files = {
    };
    for (const name of ['package.json', 'yarn.lock']) {
        evidence.files[name] = await capture(name, async() => {
            const sha = evidence.baseline.data?.sha;
            if (!sha) throw new Error('No baseline');
            const file = (await read(`${root}/contents/${name}?ref=${sha}`)).data;
            if (file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error('Unsupported file encoding');
            const content = Buffer.from(file.content, 'base64').toString('utf8');
            return {
                sha: file.sha,
                content: name === 'package.json' ? JSON.parse(content) : content,
            };
        });
    }
    evidence.alerts = await capture('alerts', () => pages(`${root}/dependabot/alerts?state=open&per_page=100`));
    if (profile === 'maintenance') {
        evidence.pullRequests = {
            status: 'not-requested',
            data: null,
        };
        evidence.limitations.push('Maintenance profile intentionally omits PR evidence; PR eligibility is not assessed.');
        return evidence;
    }
    evidence.pullRequests = await capture('pullRequests', async() => {
        const prs = await pages(`${root}/pulls?state=open&per_page=100`);
        return prs.filter((pr) => pr.user?.login === 'dependabot[bot]');
    });
    for (const pr of evidence.pullRequests.data || []) {
        const endpoint = `${root}/pulls/${pr.number}`;
        pr.files = await capture(`pr:${pr.number}:files`, () => pages(`${endpoint}/files?per_page=100`));
        pr.detail = await capture(`pr:${pr.number}:detail`, async() => {
            const detail = (await read(endpoint)).data;
            if (detail.head?.sha !== pr.head?.sha) throw new Error('PR changed during collection');
            if (pr.files.status === 'complete' && detail.changed_files !== pr.files.data.length) throw new Error('Incomplete PR file list');
            return detail;
        });
        const sha = pr.head?.sha;
        pr.checkRuns = await capture(`pr:${pr.number}:checks`, () => pages(`${root}/commits/${sha}/check-runs?per_page=100`, 'check_runs'));
        pr.statuses = await capture(`pr:${pr.number}:statuses`, () => pages(`${root}/commits/${sha}/statuses?per_page=100`));
    }
    return evidence;
}

export async function main(args = process.argv.slice(2)) {
    const options = {
    };
    for (let index = 0; index < args.length; index += 2) {
        if (!['--repo', '--out', '--fixture', '--profile'].includes(args[index]) || !args[index + 1] || options[args[index]]) {
            throw new Error('Usage: node collect.mjs --repo owner/name [--out path] [--fixture path] [--profile full|maintenance]');
        }
        options[args[index]] = args[index + 1];
    }
    if (!options['--repo']) throw new Error('--repo is required');
    let read;
    if (options['--fixture']) {
        const fixture = JSON.parse(await readFile(options['--fixture'], 'utf8'));
        read = async(path) => {
            const result = fixture[path];
            if (!result) throw new Error('Missing fixture response');
            if (result.error) throw new Error(result.error);
            return result;
        };
    } else {
        const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
        if (!token) throw new Error('Set GH_TOKEN or GITHUB_TOKEN through your credential manager; do not put tokens in arguments or files');
        read = githubReader(token);
    }
    const evidence = await collect(options['--repo'], read, {
        profile: options['--profile'] || 'full',
    });
    evidence.mode = options['--fixture'] ? 'fixture' : 'live';
    const output = resolve(options['--out'] || 'triage-results/evidence.json');
    await mkdir(dirname(output), {
        recursive: true,
    });
    await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(`Saved ${evidence.mode} evidence (${evidence.status}) to ${output}`);
    // Preserve partial evidence, but do not let automation interpret it as a complete inventory.
    if (evidence.status !== 'complete') process.exitCode = 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch(() => {
        console.error('Collector failed. Verify arguments, token availability and output/fixture paths. No credentials are printed.');
        process.exitCode = 1;
    });
}
