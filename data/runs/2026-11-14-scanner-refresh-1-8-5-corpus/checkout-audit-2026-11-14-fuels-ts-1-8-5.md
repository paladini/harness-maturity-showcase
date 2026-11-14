# Fuels TS Linux scan, harness-score 1.8.5

Windows rejected tracked snapshot filenames containing `:`. The repository
was fetched from `https://github.com/FuelLabs/fuels-ts.git` at the manifest's
pinned commit `b3f37c91aca4aa9d5e4c0d3967f66237190826ea` in WSL Ubuntu
24.04. Checkout used `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --`
succeeded. No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied without
modification to `corpus/reports/fuellabs-fuels-ts.json`.

The report's SHA-256 is
`ea8d7203f43bf10ff9a8eaff44542e0102a88c813ff5fc7550ce4d567be85753`.
The pinned tree contains 2,188 entries, including one symbolic link; the
SHA-256 of `git ls-tree -rz HEAD` is
`e0997de11310a3c34204d15d85343eccaae7d3756d5beca1a6113523d988ef05`.
The committed Linux 1.8.4 report and this report both show level 0,
53/105 (50%).
