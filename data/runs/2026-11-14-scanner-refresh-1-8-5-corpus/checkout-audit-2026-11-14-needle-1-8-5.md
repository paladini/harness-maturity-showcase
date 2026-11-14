# Needle alternate-origin scan, harness-score 1.8.5

The manifest origin `https://github.com/cactus-compute/needle.git` no longer
serves the pinned commit and describes the project as moved to
`https://github.com/cactus-compute/cactus`. The latter served the exact
manifest commit `ef3cf7543204d99878c0dd913a05f6a506da4be8` (also visible
in Software Heritage). It was fetched and checked out in WSL Ubuntu 24.04
with `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded.
No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/needle.json`.

The report's SHA-256 is
`9eb71fa5bc17d4f1934d80f891166fcf32c049652fbfae62725a98a701aa8f7a`.
The pinned Git tree contains 72 entries and no symbolic links; the SHA-256
of `git ls-tree -rz HEAD` is
`aa26d52c4ebc9312961e90ad342db5e84be551ac7baba5aa77b5a3588f3c86ea`.
The committed 1.8.4 report and this report both show level 0, 38/105 (36%).
