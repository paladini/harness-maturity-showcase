# Cryptocurrency corpus import - October 8, 2026

This snapshot imports all **126** pinned reports from immutable public analysis
commit [`f85ccc86913577e2f61c324f227bf23cb7ff295a`](https://github.com/paladini/harness-maturity-analysis/tree/f85ccc86913577e2f61c324f227bf23cb7ff295a),
prepared in [analysis PR #6](https://github.com/paladini/harness-maturity-analysis/pull/6)
for [analysis issue #5](https://github.com/paladini/harness-maturity-analysis/issues/5)
and [showcase issue #7](https://github.com/paladini/harness-maturity-showcase/issues/7).
Every report uses `harness-score@1.8.1`; none is truncated.

The 25 new cryptocurrency/blockchain software projects were selected before
scanning by accumulated GitHub stars observed on October 8. The
[selection ledger](https://github.com/paladini/harness-maturity-analysis/blob/f85ccc86913577e2f61c324f227bf23cb7ff295a/corpus/selection-2026-10-08-crypto-popularity.json)
and [frozen discovery evidence](https://github.com/paladini/harness-maturity-analysis/blob/f85ccc86913577e2f61c324f227bf23cb7ff295a/corpus/popularity-search-2026-10-08-crypto.json)
record the search universe, eligibility, exclusions, exact source commits and
implementation blobs. Current accumulated stars approximate lifetime popularity;
they do not reconstruct historical peak stars or affect harness ranks.

## Evidence and preservation

- [Source manifest](source-manifest.json): exact pins, notes and provenance.
- [Official history](source-history.json): matching scores and run identity.
- [Import manifest](manifest.json): immutable public evidence links, local report
  filenames, SHA-256 checksums and the previous 122 registry records.
- [Previous 101-report snapshot](../2026-10-08-corpus/README.md): unchanged archive.

Reports and source manifests were copied byte-for-byte from the public source
commit. The importer verifies full report/history agreement before replacing
registry values. All 101 existing corpus pins and scores remain unchanged; the
current registry updates their report links to the new immutable source commit.
Twenty community reports and one badge remain unchanged, resulting in
**147 unique listings: 146 full reports and one badge**.

The crypto cohort contains **15 L0 and 10 L1** reports, median applicable score
**50%**, and no truncated scans. This describes recognized AI development
workflow artifacts at the measured commits, without blind human ratings.
See the [complete analysis and limitations](https://github.com/paladini/harness-maturity-analysis/blob/f85ccc86913577e2f61c324f227bf23cb7ff295a/analysis/phase-1d-execution.md).

Web3.js, Solana and Truffle are archived software snapshots and carry an
`archived snapshot` label. Hey's README describes its last public source before
May 15, 2026; its score does not describe later private production code.

## CCXT static scan environment

Windows Defender quarantined a tracked CCXT fixture during a static read. The
failed Windows attempt was excluded from authoritative results. Protections
and quarantine remained unchanged; the complete pinned tree was scanned in a
separate Ubuntu 24.04 WSL filesystem. No CCXT code was executed. The accepted
report is **74/105, 70%, L1**, complete and untruncated.

The following supplemental records were also copied unchanged from the same
public commit. They contain environment and integrity metadata only:

| Record | SHA-256 |
| --- | --- |
| [Linux scan receipt](scan-environment-2026-10-08-ccxt.json) | `97f552f6fb4d9eb34b2fe91242d8ce0e9b28dba0c1748f8bfac3e398a696ac83` |
| [Linux checkout audit](checkout-audit-2026-10-08-crypto-popularity-ccxt-linux.json) | `b4d08de59ebb8a7a22530866513783d98d53fca28499c86ffec1fb263c04be7c` |

[Original receipt](https://github.com/paladini/harness-maturity-analysis/blob/f85ccc86913577e2f61c324f227bf23cb7ff295a/corpus/scan-environment-2026-10-08-ccxt.json)
and [original Linux audit](https://github.com/paladini/harness-maturity-analysis/blob/f85ccc86913577e2f61c324f227bf23cb7ff295a/corpus/checkout-audit-2026-10-08-crypto-popularity-ccxt-linux.json).

## Reproduction and publication

```sh
npm run corpus:import -- --commit f85ccc86913577e2f61c324f227bf23cb7ff295a
npm run check
```

Import only into a checkout without this named snapshot. Existing run
directories cannot be overwritten. Supplemental environment records are
included for audit; the importer itself only fetches reports and manifests
and never executes software from measured repositories. GitHub Pages publishes
the registry after a reviewed merge into main.

Maintainer request and contribution: @paladini.
