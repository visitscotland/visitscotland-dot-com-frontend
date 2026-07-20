export interface PageTest {
    name: string;
    path: string;
    fixtureFile: string;
}

export interface AppTestConfig {
    name: string;
    appDir: string;
    port: number;
    fixtureDir: string;
    bloomreachEndpoint: string;
    pages: PageTest[];
}

export const apps: AppTestConfig[] = [
    {
        name: 'visitscotland-dot-com',
        appDir: '.',
        port: 3070,
        fixtureDir: 'tests/fixtures',
        bloomreachEndpoint: 'develop-brc.visitscotland.com',
        pages: [
            {
                name: 'Homepage',
                path: '/',
                fixtureFile: 'homepage.json', 
            },
        ],
    },
];
