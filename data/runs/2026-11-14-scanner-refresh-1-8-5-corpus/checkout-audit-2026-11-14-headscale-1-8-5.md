# Headscale Linux scan, harness-score 1.8.5

Windows rejected a tracked `hscontrol/testdata/apiv1_golden/` filename
containing `>`. The repository was fetched from
`https://github.com/juanfont/headscale.git` at the manifest's pinned commit
`a8d6f5be81e578a078001b908e41611ec03ce69e` in WSL Ubuntu 24.04. Checkout
used `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded.
No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/juanfont-headscale.json`.

The report's SHA-256 is
`b78401b05da15ccd235a36d5651b3166492f359d6e219b1073daa54a9af58492`.
The pinned tree contains 1,514 files and no symbolic links; the SHA-256 of
`git ls-tree -rz HEAD` is
`368135607080228ddaa5b9499533409559e6da66a4b7b060a1bc6cd859f14b0a`.
The committed Linux 1.8.4 report and this report both show level 1,
63/108 (58%).
