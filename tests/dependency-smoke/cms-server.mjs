import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

export async function createCmsServer({ appOrigin, cmsOrigin }) {
    const fixture = (await readFile(new URL('./fixtures/homepage.json', import.meta.url), 'utf8'))
        .replaceAll('__APP_ORIGIN__', appOrigin).replaceAll('__CMS_ORIGIN__', cmsOrigin);
    const requests = [];

    return createServer((request, response) => {
        response.setHeader('Access-Control-Allow-Origin', appOrigin);
        response.setHeader('Access-Control-Allow-Headers', 'Accept-Version, Content-Type');

        if (request.method === 'OPTIONS') {
            response.writeHead(204).end();

            return;
        }

        const pathname = new URL(request.url, cmsOrigin).pathname;

        if (request.method === 'GET' && ['/resourceapi', '/resourceapi/'].includes(pathname)) {
            requests.push({
                method: request.method,
                pathname,
            });
            response.writeHead(200, {
                'Content-Type': 'application/json',
            }).end(fixture);
        } else if (pathname === '/__requests') {
            response.writeHead(200, {
                'Content-Type': 'application/json',
            }).end(JSON.stringify(requests));
        } else {
            response.writeHead(404).end('Unexpected fixture request');
        }
    });
}
