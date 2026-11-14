# vibe-coding-cn alternate-origin scan, harness-score 1.8.5

The manifest origin `https://github.com/tradecatlabs/vibe-coding-cn.git`
returned 404. The public fork `https://github.com/kansonkong/vibe-coding-cn`
served the exact manifest commit `a800de9bf939d8b8c7dd1e22756ddbd19780bd25`.
It was fetched and checked out in WSL Ubuntu 24.04 with
`GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded. No
repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/vibe-coding-cn.json`.

The report's SHA-256 is
`146beec20740506fbb1fbaa2c9011d68ce89078f861e0872ee99af4604aedc5c`.
The pinned Git tree contains 1,970 entries, including four symbolic links
and four uninitialized submodules; the SHA-256 of `git ls-tree -rz HEAD` is
`55da2aac94fdfb469936b3139a74454df7384127be1343e77be2ca618275a8c2`.
The committed 1.8.4 report and this report both show level 1, 49/105 (47%).
