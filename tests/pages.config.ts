export interface PageTest {
    name: string;
    path: string;
    fixtureFile: string;
    heading: string;
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
                heading: 'Start Your Story in Scotland',
            },
            {
                name: 'Glasgow',
                path: '/places-to-go/glasgow',
                fixtureFile: 'glasgow.json',
                heading: 'Glasgow',
            },
            {
                name: '7 Day East Coast Itinerary',
                path: '/travel-planning/touring/7-days-east-scotland',
                fixtureFile: '7-day-itinerary.json',
                heading: '7 Days in the east of Scotland',
            },
            {
                name: 'Outdoor Safety In Scotland',
                path: '/things-to-do/outdoor-activities/outdoor-safety-tips',
                fixtureFile: 'outdoor-safety.json',
                heading: 'Outdoor safety in Scotland',
            },
        ],
    },
];
