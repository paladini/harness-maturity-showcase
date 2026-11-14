# Lillist alternate-origin scan, harness-score 1.8.5

The manifest origin `https://github.com/mikeydotio/lillist.git` returned 404.
The public repository `https://github.com/Dodothereal/lillist.git` served the
exact manifest commit `8d35213ea3f1fc0a45990809e24fe92a7b1de029`. It was
fetched and checked out in WSL Ubuntu 24.04 with `GIT_LFS_SKIP_SMUDGE=1`;
`git diff-index --quiet HEAD --` succeeded. No repository code was executed.
The report was produced by `npx --yes harness-score@1.8.5 <checkout> --json`
on Linux and copied without modification to
`corpus/reports/ai-ide-mikeydotio-lillist-1236962486.json`.

The report's SHA-256 is
`35864b8c9e8bbc760b4274ee0f72926b3d991a7554b00f1db9a9f307ae2ed2c5`.
The pinned tree contains 1,276 files and no symbolic links; the SHA-256 of
`git ls-tree -rz HEAD` is
`0c372cb1a2d26f6d1be903f10279afd137cc43cd5b4f9d9dbbadeb2462bc686e`.
The committed Windows 1.8.4 report and this Linux report both show level 1,
34/105 (32%).
