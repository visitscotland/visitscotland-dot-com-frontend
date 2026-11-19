# Dot-com dependency automation

This project uses the same dependency automation as business-support-hub:

- `dependency-smoke.yml`: read-only PR CI with immutable installation, pinned
  Node, helper regressions, lint, production build, local Bloomreach SSR and a
  hydrated Chromium interaction test.
- `dependabot-auto-merge.yml`: verified same-repository Dependabot patch/minor
  approval and squash auto-merge. Major, ambiguous and unrelated changes require
  manual review. The privileged evaluator never checks out PR code.
- `dependency-maintenance.yml`: Wednesday and Friday at 09:00 Europe/London,
  plus manual dispatch. The deterministic host prepares bounded fixes before a
  read-only Copilot review. AI threat detection is disabled. Maintenance PRs still
  require human review; the Dependabot merge policy does not apply to them.

The existing visual regression and snapshot-update workflows, Dependabot assignee
and cooldown settings, Jenkinsfiles, application dependency versions, and Yarn
configuration remain project-owned. The visual Playwright config excludes the
separate dependency smoke suite.

## Repository activation

Merge these files into the default branch before enabling the scheduled workflow.

1. Require **Dependency smoke tests** in the main-branch protection or ruleset,
   along with the project's existing code-quality/security requirements. Keep the
   existing review requirements and do not grant a bypass to this automation.
2. Enable **Allow auto-merge** and keep squash merging enabled. GitHub Actions must
   be allowed to approve pull requests. See the auto-merge workflow documentation
   for its exact eligibility rules.
3. Set `DEPENDENCY_MAINTENANCE_ENABLED=true` to activate the scheduled collector and
   Copilot reviewer. Supply `DEPENDABOT_READ_TOKEN` with read access to this
   repository's Dependabot alerts and baseline contents.
4. Configure `GH_AW_CI_TRIGGER_TOKEN` if the maintenance bot's PRs need a separate
   credential to trigger downstream PR CI. Use a least-privilege credential allowed
   to trigger the required checks; never bypass those checks. Copilot workflow
   access must also be enabled for the repository.

Repository settings and secrets are not changed by committing these files.

## Local checks

Use the exact Node version in `.nvmrc` and the checked-in Yarn release:

```sh
node .yarn/releases/yarn-4.14.1.cjs install --immutable
node .yarn/releases/yarn-4.14.1.cjs test:dependencies
node .yarn/releases/yarn-4.14.1.cjs test:smoke:unit
node .yarn/releases/yarn-4.14.1.cjs test:smoke:install
node .yarn/releases/yarn-4.14.1.cjs test:smoke
```

The small smoke model represents a dot-com general homepage with a real header,
hero, accordion and footer. It uses a local CMS server and no live CMS credentials.
The existing, larger visual-test fixtures remain unchanged.
