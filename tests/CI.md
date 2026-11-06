# Playwright and Chromatic CI

The workflow follows Chromatic's documented Playwright integration:
https://www.chromatic.com/docs/github-actions/.

Tests run in the official Playwright container, which supplies the browsers and
system dependencies. Its version must match the resolved `@playwright/test`
version in `yarn.lock`; update the image when upgrading Playwright.

The workflow retains repository-specific behaviour:

- Recorded Bloomreach fixtures, image masking and rendering assertions.
- Dependency-only PR exemptions for the approved automation authors.
- One immutable Yarn install, with downloads cached and saved before testing.
- Capture and the official `chromaui/action` upload on the same runner to avoid
  a second dependency install and archive download.
- Diagnostic artifacts retained for 14 days, including after test failures.
- Non-blocking visual review (`exitZeroOnChanges: true`), without auto-acceptance
  or changes to branch protection.

The official action is pinned to a commit. It also reports exempt PRs using its
`skip` input, without running captures or installing the application dependencies.
Fork PRs capture results but do not publish using repository secrets.

Configure `CHROMATIC_PROJECT_TOKEN` for Actions and Dependabot as appropriate.
The local `yarn chromatic --playwright` launcher remains available; CI invokes
Playwright and the official action directly.
