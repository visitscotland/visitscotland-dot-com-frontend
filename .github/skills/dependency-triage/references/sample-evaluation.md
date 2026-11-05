# Offline evaluation checklist

After running the sample command in operation.md, ask Codex to use this skill
against sample-evidence.json. Assess its output against these invariants; exact
wording is not a golden output. Expect two short tables and schemaVersion 2 JSON.

- Exactly three affected packages appear in packages, containing all three alert
  numbers once. PRs remain in raw evidence; a separate PR inventory is not needed.
- Everything is identified as synthetic fixture evidence, never a live BSH result.
- Alert 1 is a high-severity direct dependency with an advertised patched version
  and a candidate patch PR. PR 10's patch supports a direct manifest update but
  the synthetic lockfile cannot establish installed instances or complete repair.
  Recommend 1.0.1 for the direct package, while distinguishing a candidate from a
  verified remediation. Its highest severity is high.
- Alert 2 is indirect, has a first-patched version, and the manifest contains a
  1.0.0 resolution pin for that package. It should recommend patched 1.0.1 as a
  candidate transitive pin, clearly marking parent compatibility unverified.
  There is no dependency-path/parent evidence. Do not claim the existing pin is
  behind an unpinned resolution or assert that PR 10 fixes it. The pin comparison
  is incomplete; place this limitation in the short gaps note.
- Alert 3 is critical with no supplied patched version and unknown relationship.
  Show highest severity critical and `No patched version recorded`, without a
  fabricated target or pin. Use a concise mitigation/investigation action.
- The sample head check succeeds, but the report must not equate that with a
  passing merge-ref check, satisfied branch rules or guaranteed merge eligibility.
- The skill produces local files and performs no GitHub writes or dependency edits.

Repeat with the alerts endpoint set to HTTP 403 in a copy of the fixture. The
report must explicitly say the alert inventory is unavailable; it must not claim
there are no alerts or invent outcomes from the inaccessible collection.

Additional evaluation cases for the new format:

- Two alerts on one package (medium fixed in 1.0.1 and high fixed in 1.0.3) produce
  one row with highest severity high, both alert IDs and a target covering both.
- If the fix branches are 1.0.3 and 2.0.1, keep branch-specific recommendations
  rather than blindly selecting the numerically greatest version for every parent.
- A lockfile resolution 3.5.38 under configured pin ^3.5.38, with a parent requiring
  exactly 3.5.44, belongs in the second list as `Parent requires newer`. State
  3.5.44 as the parent requirement, not an executed unpinned resolution. Note that
  the pin range itself allows 3.5.44 and a lockfile refresh may suffice.
- A pin ^1.0.0 resolved to 1.5.0 and a parent requiring ^1.4.0 are not by themselves
  evidence of lag. A newer unrelated npm release does not change that conclusion.
- An unalerted pinned package must still be inspected for the second list.
- npm overrides in a Yarn project are not automatically effective Yarn pins.
