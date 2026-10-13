# Developer infrastructure popularity cohort

This immutable snapshot imports the developer infrastructure cohort from the
[Harness Maturity Analysis](https://github.com/paladini/harness-maturity-analysis)
at source commit `2a88ecc00a4fbf8aa13e14692bf673c3c2aba6b7` (Analysis PR #26).

The source corpus contains 5,002 pinned reports at `harness-score@1.8.1`,
representing 5,000 unique canonical repository identities. This selection adds
816 unique repositories across database and data platforms (309), developer
experience (29), code quality (185), software delivery, testing, and build
(136), and developer tools (157).

Candidates were public, licensed, non-fork, non-archived software repositories
with pinned README and implementation evidence. The 816 selected repositories
were the highest-star eligible candidates in a bounded union of category
searches, not a global GitHub ranking. The lowest selected repository had 159
stars, and 733 selected repositories had at least 500 stars. Star counts were
observed on 2026-10-11 and describe selection popularity only. This is a
scanner-only expansion with no blind human ratings or external-validity claim.

The exact commits, full search and eligibility evidence, selection ledger,
source manifest, source history, and report checksums are preserved in
[the import manifest](manifest.json), [selection ledger](selection.json),
[source manifest](source-manifest.json), [source history](source-history.json),
and the individual reports. Older scanner-version records and community
listings remain available in the catalog.

This run contributes 5,002 repository-version records, including the 816 new
repositories and all prior Analysis entries. The public index now contains
5,044 repository-version records across 5,023 repositories, including 5,043
full reports and one badge-only entry.
