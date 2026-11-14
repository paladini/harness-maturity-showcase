# Super Mario Bros v0 alternate-origin scan, harness-score 1.8.5

The manifest origin `https://github.com/xander100891/super-mario-bros-v0.git`
returned 404. The public repository
`https://github.com/jacobogbeide/super-mario-bros-v0` served the exact
manifest commit `0ab03c5f0ad258040b50278a21007b6f30272c56`, also recorded
by Software Heritage. It was fetched and checked out in WSL Ubuntu 24.04
with `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded.
No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to
`corpus/reports/game-ai-xander100891-super-mario-bros-v0.json`.

The report's SHA-256 is
`86e59da56a79f7c42ea667a805cee8b64e003656e2814a254a0ff9359aa579f1`.
The pinned Git tree contains 14 regular files and no symbolic links; the
SHA-256 of `git ls-tree -rz HEAD` is
`f36ff37e531ca3ec44705dd03df50cd491cd9e34552ba171bb1431783587e675`.
The committed Windows 1.8.4 report and this Linux report both show level 0,
22/105 (21%).
