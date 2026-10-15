# Geospatial and mapping popularity cohort

This immutable Showcase snapshot imports the 1,000-repository geospatial and
mapping cohort from the merged Analysis commit
[`050a5ca1a71edef2365bc6bfc0307696b0106d2f`](https://github.com/paladini/harness-maturity-analysis/commit/050a5ca1a71edef2365bc6bfc0307696b0106d2f),
prepared under Analysis issue [#27](https://github.com/paladini/harness-maturity-analysis/issues/27)
and imported for Showcase issue [#41](https://github.com/paladini/harness-maturity-showcase/issues/41).

- **Run ID:** `geospatial-mapping-popularity-1000`
- **Scanner:** `harness-score@1.8.2`
- **Source manifest:** 6,002 pinned repositories and reports
- **Selected cohort:** 1,000 unique canonical GitHub repository IDs

The cohort was selected from a bounded union of GitHub topic searches for
geospatial, GIS, mapping, cartography, and QGIS software. Repository identity,
eligibility, implementation evidence, and exact commit pins are recorded in
`selection.json` and the accompanying evidence files. The query union is a
sampling frame, not a claim of global GitHub popularity. Popularity is not a
maturity score.

`manifest.json` records the immutable source commit and SHA-256 for each
imported report and evidence file. The 43 platform receipts are stored as
`evidence-<repository-name>.json` where needed to avoid collisions with report
filenames. Each receipt records the pinned commit, scanner version, platform,
source tree evidence, and report checksum. No code from a scanned repository
was executed.
