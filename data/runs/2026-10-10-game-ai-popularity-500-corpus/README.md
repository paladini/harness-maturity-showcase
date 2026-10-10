# 2026-10-10 video game AI popularity corpus

This snapshot imports the 1,151 pinned reports from analysis commit
[`fb6a6a0566638b24528bc1947535064afee784c8`](https://github.com/paladini/harness-maturity-analysis/commit/fb6a6a0566638b24528bc1947535064afee784c8)
with `harness-score@1.8.1`. Its named run identity is
`game-ai-popularity-500`.

The new cohort adds 500 repositories covering both games created with AI and
AI used in games or game development. The cohort has 500 complete,
untruncated reports. Its selection records canonical GitHub IDs, pinned
commits, observed stars, archived state, and README and implementation
evidence. Stars are selection metadata from a bounded set of 24 GitHub
searches, not a global ranking or harness maturity. No blind human ratings or
external-validity claim is made.

The selection, discovery snapshot, checkout audit, integrated source manifest,
and source history are retained here. The audit directly rechecked 474 trees;
for 25 caches moved after scanning it rechecked the pinned SHA marker and
complete report but did not independently re-audit the copied file tree. One
case-sensitive checkout was verified on Linux through WSL. The audit JSON
records these methods for each affected entry.

`source-manifest.json` and `source-history.json` preserve the integrated
upstream run. The `manifest.json` pins source SHA-256 checksums for the
selection ledger, supporting evidence, and every report; each report is copied
byte-for-byte from the immutable analysis commit.

The import replaces the earlier 651 current-version Analysis reports while
preserving the 20 existing non-corpus full reports, the badge-only listing,
the 21 historical `1.5.0` corpus records, and prior immutable snapshots. The
registry now contains 1,193 report records across 1,172 repositories.
