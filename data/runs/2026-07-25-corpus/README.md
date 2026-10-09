# Historical cohort - July 25, 2026

This archive restores the original **21 pinned reports** from
`harness-score@1.5.0` as a selectable cohort in the Showcase. The reports were
scanned on July 25, 2026 and copied byte-for-byte from analysis commit
[`0efdd6b5b8161ea253364d15eec0b5856ef094c5`](https://github.com/paladini/harness-maturity-analysis/tree/0efdd6b5b8161ea253364d15eec0b5856ef094c5).

- [Source manifest](source-manifest.json): repository pins and categories.
- [Source history](source-history.json): matching scores and maturity levels.
- [Import manifest](manifest.json): report filenames, source commit and SHA-256
  checksums for each archived report.
- Each `.json` file is the full scanner output for that repository.

These reports use the original 1.5.0 schema and remain distinct from later
1.8.1 scans of the same repositories. The Showcase ranks each version within
its own cohort. A change between versions is not a maturity trend because the
scanner models and score maxima differ.

The importer verifies each archived report against its matching history entry
and preserves the original scan date. It does not execute code from the scanned
repositories.

Maintainer request and contribution: @paladini.
