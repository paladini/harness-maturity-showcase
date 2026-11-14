# AidLearning Linux scan, harness-score 1.8.5

The Windows checkout was incomplete. The repository was fetched from
`https://github.com/aidlearning/AidLearning-FrameWork.git` at the manifest's
pinned commit `84d0676baffa905c12189959480c9a1bb14619a6` in WSL Ubuntu
24.04. Checkout used `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --`
succeeded. No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied without
modification to `corpus/reports/aidlearning-framework.json`.

The report's SHA-256 is
`9dd5049a66c7e93c4d7c2ed507706404ef6d2366d745a3966b01591617954c90`.
The pinned Git tree contains 257 entries and no symbolic links; the SHA-256
of `git ls-tree -rz HEAD` is
`ab9c8e8fa353c3df59f3a876b58acbcb82cc4980973ba6ed87e71a85fc6177b8`.
The committed Linux 1.8.4 report and this report both show level 0,
15/105 (14%).
