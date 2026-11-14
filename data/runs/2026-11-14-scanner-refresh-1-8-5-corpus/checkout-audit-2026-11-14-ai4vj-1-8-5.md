# AI4VJ Linux scan, harness-score 1.8.5

The Windows checkout was incomplete. The repository was fetched from
`https://github.com/EjbejaranosAI/AI4VJ.git` at the manifest's pinned commit
`50f522bff47fd7a0c5ef82788d6a3ebde9c70045` in WSL Ubuntu 24.04. Checkout
used `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded.
No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/game-ai-ejbejaranosai-ai4vj.json`.

The report's SHA-256 is
`46f784efb3f4cd0a52b05e730eb4181537ec70fb74ccd178a069e20b91a35c8f`.
The pinned tree contains 51 regular files and no symbolic links; the SHA-256
of `git ls-tree -rz HEAD` is
`eeb1f935a990f9a2ce8c46fb7d5278f2e6bbd39f40137a53bada32ad9b134339`.
The committed Linux 1.8.4 report and this report both show level 0,
17/105 (16%).
