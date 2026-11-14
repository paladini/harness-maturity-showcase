# AgentsMesh alternate-origin scan, harness-score 1.8.5

The manifest origin `https://github.com/AgentsMesh/AgentsMesh.git` returned
404. The public repository `https://github.com/neverfi/AgentsMesh.git` served
the exact manifest commit `d38e3932df436fadd814a8871b8c6b7be52281d5`.
It was fetched and checked out in WSL Ubuntu 24.04 with
`GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded. No
repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/agentsmesh-agentsmesh.json`.

The report's SHA-256 is
`db28f283634d680fd9b63e6155e8cf414f7d1c6ee50400802e5115b426cc4a8b`.
The pinned tree contains 6,618 entries including ten symbolic links; the
SHA-256 of `git ls-tree -rz HEAD` is
`abfc80d0aed29bf09de6d61daadc72def73a46d328743eeffe09e81e1ee59970`.
The committed Linux 1.8.4 report and this report both show level 0,
57/108 (53%).
