# AI coding-assistant adoption cohort

This immutable snapshot imports the 2026-10-11 Phase 1H cohort from the
[Harness Maturity Analysis](https://github.com/paladini/harness-maturity-analysis)
at source commit `ce37e4151bb9ea7349da5afa17b4d393dfbc8fd1`.

The analysis corpus contains 3,186 pinned reports at `harness-score@1.8.1`.
This selection adds 500 unique repositories with a root README, implementation
source, and an explicit AI coding-agent or IDE guidance file. It includes 378
positive-star candidates and a seeded sample of 122 zero-star candidates from
a bounded GitHub code-search union. Stars are selection metadata, not maturity
scores. A guidance file is evidence of workflow context, not proof that a
specific editor was installed. This scanner-only expansion does not include
blind human ratings or external-validity evidence.

The imported [selection ledger](selection.json), source manifest, source
history, and reports preserve the pinned analysis evidence. The ledger and
discovery snapshot are byte-verified in this directory's `manifest.json`.
Windows checkout exclusions are limited to fixture data, generated snapshots,
test media, an icon asset, raw CSV datasets, and logo assets; none contains the
selected assistant instruction or implementation paths.

This run contributes 500 unique repositories and 500 records at scanner version
`1.8.1`. The public index now contains 3,228 repository/version records across
3,207 repositories, including 3,227 full reports and one badge-only entry.
