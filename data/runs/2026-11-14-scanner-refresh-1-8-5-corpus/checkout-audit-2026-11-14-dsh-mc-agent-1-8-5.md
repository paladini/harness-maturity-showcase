# DSH Minecraft agent alternate-origin scan, harness-score 1.8.5

The manifest origin `https://github.com/hellosky983/dsh-mc-agent.git`
returned 404. The public repository `https://github.com/hellosky982/dsh-mc-agent`
served the exact manifest commit `98d8a791948f2f0e88ea08cfa5add91a3f9fa6f3`.
It was fetched and checked out in WSL Ubuntu 24.04 with
`GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded. No
repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/game-ai-hellosky983-dsh-mc-agent.json`.

The report's SHA-256 is
`e107b16d41394b0afb2ffcd06c40e9081c07af09f803a6e9615a43b4a593b185`.
The pinned tree contains nine regular files and no symbolic links; the
SHA-256 of `git ls-tree -rz HEAD` is
`aff3bd2124538fc550d070850a4301f3514695cd7baba45e9ab1fd8ec361beb6`.
The committed Windows 1.8.4 report and this Linux report both show level 0,
19/105 (18%).
