# Dependency maintenance execution

The workflow runs Wednesday and Friday at 09:00 Europe/London, supports manual
runs, and remains opt-in through DEPENDENCY_MAINTENANCE_ENABLED.
Live publication creates a PR for human review; merging remains manual. Jenkins
and repository Yarn settings are outside this workflow's scope.

## Trusted preparation

The maintenance collector omits PR inventories, diffs and checks. Preparation uses
one offline Yarn graph export plus the authoritative lockfile to identify affected
copies, parent constraints, pins and inactive overrides. Registry reads are targeted,
deduplicated and sequential. Prepared candidates preserve the seven-day age gate,
Node compatibility, release branches and advisory ranges; no target is invented.

ci/dependency-host.mjs prepare runs BEFORE Copilot:

1. Verify complete registry evidence and the recorded baseline/path proof.
2. Generate structured package decisions and at most three evidenced candidate groups.
   Prefer groups addressing more alerts and lower-complexity fixes. Use vulnerable
   descriptor selectors; allow a prepared parent upgrade only when its own parent
   constraints are satisfied. Defer incompatible child overrides for manual review.
   Include supported lagging-pin refreshes. Reject conflicting overlapping selectors
   before installation; reuse an existing selector only when every matching path
   accepts the target. Do not reorder existing resolutions to alter Yarn precedence.
3. Validate every edit before changing files. Return all rejected selectors with
   their package, matched/affected versions and prepared candidates. Every failed
   command is persisted in candidate/history.json; validation calls and installs
   both have an initial-plus-two-repairs limit. Identical installs are rejected.
4. Run the checked-in Yarn with lifecycle scripts disabled. Map the sandbox proxy
   variables to Yarn child settings, preserving explicit Yarn proxy configuration.
   Classify network/TLS/timeout failures separately. Extract primary errors, omitting
   bundled-source crash dumps and redacting URL credentials. Network failures stop
   the run. After install, export Yarn's installed graph and verify expected versions
   before promoting the candidate checkpoint. Install and graph verification consume
   one shared attempt. Only structured failures identifying a selected group can
   remove that group and retry; unattributable failures stop without guessing.
5. Restore the last graph-validated manifest and lockfile after failure; the next
   Yarn install reconciles installed files. Render a report even when execution fails,
   and run immutable install, installed graph checks, lint, production build and
   homepage browser tests. Reject edits without evidenced security or pin progress.
6. Create and commit the bounded dependency patch on a fresh local automation branch.
   Capture a hash of the prepared files, reports, validation and execution history as
   a trusted Actions step output. The model cannot rewrite this step output.

## Read-only review and publication

Copilot reads the ready PR body, proposal and validation in one batch. It does not
select versions, execute helpers, regenerate the lockfile, run tests, render reports
or commit. Shell and CLI-proxy tools are disabled. The primary 30-call/100-credit
budget remains unchanged; deterministic host work consumes no inference calls.

After review, host steps reject protected-source edits, restore collector evidence,
verify the complete plan hash and require the correct output type. Successful no-op
messages must exactly match the host's unresolved-finding summary. PR publication
requires the exact host report (allowing standard runtime sanitization).

AI threat detection is disabled. A successful host-validated and reviewed patch
proceeds directly to the exact publication checks and PR creation. The existing
code quality and security scans run on the opened PR. There is no separate
detection inference pass or detection credit budget.

A failed attempt cannot become a successful noop by removing its edits. Validated
results can enter the six-day cache only after the host accepts the review and the
entire reusable workflow succeeds. Missing review/status markers invalidate older
cache entries. Previous bot PRs are closed only after successful replacement publication.

The not-fixed table distinguishes missing published fixes (manual upstream
investigation) from published fixes deferred only by the seven-day age gate
(version and eligibility time, then wait and rerun or explicitly approve an override
for critical issues). Runtime/deprecation restrictions and incomplete registry
evidence remain separate investigation outcomes. Reporting never overrides policy.

## Local verification

Run the checked-in Node version and the dependency-maintenance, graph, candidate,
execution, host protocol and smoke harness tests. The host protocol fixture exercises
actual Git branches/commits, the candidate command and renderer, while substituting
application validation at its explicit test seam. Separate graph/runtime/browser
checks cover their real implementations. A local HTTP CONNECT proxy fixture proves
Yarn consumes the mapped proxy settings without contacting an external registry.

Compile dependency-maintenance-agent with pinned gh-aw v0.92.0 and validation enabled.
Tests assert that AI detection stays disabled, exact publication-body checks, no-op
message checks, immutable review snapshots and durable pre-install failures.
