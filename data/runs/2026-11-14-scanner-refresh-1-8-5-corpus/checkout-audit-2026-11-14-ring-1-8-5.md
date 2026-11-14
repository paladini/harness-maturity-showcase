# Ring alternate-origin scan, harness-score 1.8.5

The manifest origin `https://github.com/LerianStudio/ring.git` returned 404.
The public repository `https://github.com/alexgarzao/ring.git` served the
exact manifest commit `5dcf4ef66574c900c17ee3b8364bdd103f216f88`. It was
fetched and checked out in WSL Ubuntu 24.04 with `GIT_LFS_SKIP_SMUDGE=1`;
`git diff-index --quiet HEAD --` succeeded. No repository code was executed.
The report was produced by `npx --yes harness-score@1.8.5 <checkout> --json`
on Linux and copied without modification to
`corpus/reports/dev-infra-lerianstudio-ring.json`.

The report's SHA-256 is
`c3dcb9ca4dc723ea324d5ebd675ba7a199b68f120c3c15f93aaf2a768282b6f1`.
The pinned tree contains 302 entries including one symbolic link; the SHA-256
of `git ls-tree -rz HEAD` is
`d5576881e21d988ec3fc07a4feaa34142963538f99a5f00e728af11fed39370b`.
The committed Linux 1.8.4 report and this report both show level 1,
35/105 (33%).
