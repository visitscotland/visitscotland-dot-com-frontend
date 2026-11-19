# Production dependency smoke tests

A small suite of tests that serve as a gate for PRs. They assert that a PR should
only be mergeable if the linter passes, the production build runs, the server starts
up with a hardcoded home page json response, and the page appears to hydrate and
become interactive when checked with Chromium through Playwright.

This test is primarily to be used as a merge gate for auto-approved dependabot updates
but should also be treated as a smell test for human PRs.

## Install and run

```sh
yarn test:smoke:install
yarn test:smoke
```

Additional commands:

```sh
# Fast iteration against an existing production build; NOT the complete gate
yarn test:smoke:browser

# Prove that failures are detected (requires an existing production build)
yarn test:smoke:harness

# Fixture, port configuration and server-startup failure tests; no build/browser
yarn test:smoke:unit
```

Run serially. Ports 4317 (app) and 4318 (CMS) must be free; override them using
`SMOKE_APP_PORT` and `SMOKE_CMS_PORT`. Existing servers are never reused.

## What blocks merging

- Lint errors or a failed production build.
- Server startup failure, early exit or startup timeout.
- A homepage response other than HTTP 200, including redirects and error pages.
- Missing real homepage markup in the raw SSR response.
- Failure to observe `vs-app-hydrated`, hidden main content or a skeleton covering
  it, missing homepage heading, header or footer.
- An accordion that cannot open, display its content and close again. This is a
  real component-library control, proving that client event handlers work.
- Uncaught browser exceptions, unexpected console errors, broken essential
  requests, or incorrect script/stylesheet content types.
- An unhealthy server after browser startup.

Hydration **mismatch console messages** are attached and annotated as warnings;
they do not fail a page that renders and works. Other errors are not ignored
just because they mention hydration. A blank page, stuck skeleton or failed
interaction still fails even when a mismatch was logged.

## Deterministic CMS and telemetry

`fixtures/homepage.json` is synthetic, contains no production content or secrets,
and follows the Bloomreach page-model structure. It exercises the real SDK,
page mapping, Pinia store and component-library header, hero, accordion and
footer. Both SSR and browser requests use the local fixture server. Unexpected
fixture paths return 404. Keep its content assertions and fixture in step.

Over time this data may require an update if the expected structure of the page
changes significantly. In such a case a failure on PR might prompt an update to
the data rather than a reappraisal of the code that failed.

## Failure evidence

`smoke-results/` is ignored by Git and contains stage logs, `server.log`,
`result.json`, `playwright.json` and an HTML report. Browser diagnostics include
console output, hydration messages and failed requests. Failed browser tests
retain a screenshot and trace; the HTTP test attaches the SSR response.

```sh
yarn playwright show-report smoke-results/report
```
