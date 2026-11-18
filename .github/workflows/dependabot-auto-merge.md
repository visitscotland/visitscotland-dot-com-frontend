# Dependabot approval and auto-merge

`dependabot-auto-merge.yml` evaluates Dependabot PRs when opened, updated,
reopened or marked ready for review. There is no scheduled trigger. For existing
PRs, update/rebase them through Dependabot or reopen them to trigger evaluation
after this workflow has been merged into the default branch.

The workflow uses verified Dependabot metadata, including the highest version
change in grouped updates. Only npm patch/minor updates modifying existing root
`package.json` and/or `yarn.lock` files qualify. Major/unknown updates, drafts,
forks and changes to other files remain for human review. Dependabot metadata
verification also rejects commits that are not from Dependabot.

Grouped indirect updates sometimes have no metadata update type. For these,
if the only changed file is an existing root `yarn.lock`, the evaluator reads
both complete lockfiles at the PR base and head SHAs. It permits stable npm
patch/minor version increases with matching package resolutions and unchanged
selectors, dependency/peer constraints and other structure; checksums may change.
It rejects major updates, downgrades, prereleases, added/removed entries and
changes it cannot parse. Checksum-only changes without a version increase do not
qualify. An explicit major/unknown metadata classification is not overridden.
This fallback does not execute or install PR code and still requires CI to pass.

Run its local regression tests with:
`node --test tests/dependabot-auto-merge.test.mjs`.

When an eligibility rule requires manual review, the workflow posts a PR comment
explaining the reason and identifying the evaluated commit. Later evaluations
update the same bot-owned comment rather than posting duplicates. If the PR
subsequently qualifies, the comment is updated to show that the earlier decision
has been superseded. Metadata-action failures remain workflow failures rather
than eligibility decisions and do not produce this comment.

Eligible PRs receive an approval tied to the evaluated commit and have squash
auto-merge enabled. The workflow never checks out PR code or installs dependencies.
The separate Dependency smoke tests workflow executes the untrusted build with
read-only permissions. No Copilot tokens or additional secrets are needed.

Required repository configuration:

- Settings → General → Pull Requests: enable **Allow auto-merge** and **Allow
  squash merging**.
- Settings → Actions → General → Workflow permissions: enable **Allow GitHub
  Actions to create and approve pull requests**. Organization policy must permit it.
  The workflow explicitly requests contents and pull-request write permissions.
- Protect the target branch with a ruleset/branch protection requiring
  **Dependency smoke tests** and the desired review requirements. Do not grant
  this workflow a ruleset bypass. Auto-merge waits for these requirements; without
  required checks, an eligible PR could merge before the smoke tests finish.

This workflow itself should not be a required check: it intentionally skips
human-authored PRs. It does not enable auto-merge on those PRs.
