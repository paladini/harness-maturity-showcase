# Corpus refresh: harness-score 1.8.5

The 6,002 manifest entries were attempted at their existing pinned commits.
The run records 5,993 complete reports and nine unavailable sources; previous
reports for the unavailable entries are retained but excluded from the 1.8.5
results. See the three `source-audit-2026-11-14-*.md` files for the source
searches and the 1.8.5 history snapshot for every entry's status.

Thirty-five Windows checkout failures were recovered in WSL Ubuntu 24.04
using their already fetched Git objects. Each checkout was verified at the
manifest SHA and with `git diff-index --quiet HEAD --`; LFS smudging was
disabled and no scanned repository code was executed. Their individual tree
and report hashes are in `platform-receipts/harness-score-1.8.5-2026-11-14/`.
Other Linux and alternate-origin recoveries have individual
`checkout-audit-2026-11-14-*-1-8-5.md` files.

Among the 5,993 entries scored in both this run and the 1.8.4 run, 5,920
retained the same score and 73 changed score; one changed maturity level.
For all 73, the only changed check was `SNS-04` (formatter configured), and
both reports recorded Windows scan roots. The 1.8.5 release adds Oxfmt
recognition to that check. All 35 batch Linux recoveries retained the score
and level in their 1.8.4 reports. These comparisons do not infer changes for
the nine unavailable entries.
