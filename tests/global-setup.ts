import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig): Promise<void> {
    // Playwright clears output directories before global setup. Recreate the
    // archive directory even when native comparisons produce no snapshots.
    const outputDirs = process.env.CHROMATIC_ARCHIVE_LOCATION
        ? [resolve(process.env.CHROMATIC_ARCHIVE_LOCATION)]
        : config.projects.map((project) => project.outputDir);

    await Promise.all(outputDirs.map((outputDir) => mkdir(
        resolve(outputDir, 'chromatic-archives', 'archive'),
        {
            recursive: true,
        },
    )));
}
