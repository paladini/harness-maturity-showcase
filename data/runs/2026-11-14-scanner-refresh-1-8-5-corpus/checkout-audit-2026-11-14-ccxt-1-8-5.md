# CCXT Linux scan, harness-score 1.8.5

The Windows scan reported an unreadable path at
`js/src/pro/test/Exchange/test.watchOrderBook.js` and did not produce an
authoritative verdict. The repository was fetched from
`https://github.com/ccxt/ccxt` at the manifest's pinned commit
`f0aca06eb7482f083bed8406fadfcc0c05e45b1c` in WSL Ubuntu 24.04. Checkout
used `GIT_LFS_SKIP_SMUDGE=1`; `git diff-index --quiet HEAD --` succeeded.
No repository code was executed. The report was produced by
`npx --yes harness-score@1.8.5 <checkout> --json` on Linux and copied
without modification to `corpus/reports/ccxt.json`.

The report's SHA-256 is
`8f8917ba7861e30c24c7fe7be89e0f0ebd639ce92085647e3bd628f1d706b562`.
The pinned Git tree contains 9,928 entries, including 19 symbolic links;
the SHA-256 of `git ls-tree -rz HEAD` is
`09f60022794a897722e0d544e181342ee182d968bcdc36efa9b55addcc9ffa75`.
The committed 1.8.4 report and this report both show level 1, 74/105 (70%).
