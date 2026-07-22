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
            {
                name: 'Glasgow',
                path: '/places-to-go/glasgow',
                fixtureFile: 'glasgow.json',
            },
            {
                name: '7 Day East Coast Itinerary',
                path: '/travel-planning/touring/7-days-east-scotland',
                fixtureFile: '7-day-itinerary.json',
            },
            {
                name: 'Outdoor Safety In Scotland',
                path: '/things-to-do/outdoor-activities/outdoor-safety-tips',
                fixtureFile: 'outdoor-safety.json',
            },
        ],
    },
];
