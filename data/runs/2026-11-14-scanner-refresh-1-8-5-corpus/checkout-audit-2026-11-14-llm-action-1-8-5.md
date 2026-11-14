# llm-action Linux scan, harness-score 1.8.5

Windows rejected the tracked path `llm-algo/transformer/README.md `, which
ends in a space. The repository was fetched from
`https://github.com/liguodongiot/llm-action` at the manifest's pinned commit
`3a1e24448ec451108f448580fa8a37f04ee834f2` in WSL Ubuntu 24.04. Checkout
used `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded.
No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/llm-action.json`.

The report's SHA-256 is
`b39ff420e7eaa824287c7d4959d1cfb08637edaec4065471fd32b3fbc8c1c27c`.
The pinned Git tree contains 922 entries and no symbolic links; the SHA-256
of `git ls-tree -rz HEAD` is
`a7342819de2107ca6049a7aeb9a673134a61fb64114e661fe4a04153b129193e`.
The committed 1.8.4 report and this report both show level 0, 24/105 (23%).
