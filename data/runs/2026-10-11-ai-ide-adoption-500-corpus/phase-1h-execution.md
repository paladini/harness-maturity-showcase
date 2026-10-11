# Phase 1H execution: AI coding-assistant adoption

## Result

The scanner processed 500 new, unique repositories at harness-score@1.8.1. All commits were pinned before scanning. All 500 reports are present, none are truncated, and the cohort added 500 entries to the 2,686-entry baseline for 3,186 total manifest entries. The complete same-day history snapshot is corpus/history/2026-10-11-harness-score-1.8.1-ai-ide-adoption-500.json.

This is a scanner-only coverage expansion. It does not provide blind human ratings or external-validity evidence. The scanner read repository files; it did not install dependencies or run repository code.

## Selection

The bounded search union returned 1,400 records across 14 successful queries; two attempted queries failed. The union contained 1,214 unique repositories. Of those, 592 contained an explicit repository-level assistant file and 570 remained after canonical-ID/name and language filtering. The final selection includes 378 eligible positive-star candidates ordered by observed stars and 122 zero-star candidates chosen with the recorded xorshift seed.

GitHub stars are selection metadata, not maturity. The selection is not a global GitHub ranking. A root instruction file is evidence of coding-agent workflow context, not proof that a named editor was installed.

The selection ledger pins a root README, assistant configuration file, and implementation source path with blob IDs for every selected repository. The discovery snapshot records the bounded query union, the candidate pool, and eligibility outcomes.

Seven candidates were excluded after pinned-file review because they had no software implementation or were reference-only. Six additional candidates were replaced after Windows could not represent a pinned path. One repository was disabled before its commit could be pinned. Seven exact checkout exclusions were used for remaining projects; each omits only platform-incompatible fixtures, generated test artifacts, test media, an icon asset, raw CSV datasets, or logo assets that do not affect harness checks.

## Scanner results

| Maturity level | Repositories |
|---|---:|
| L0 | 24 |
| L1 | 414 |
| L2 | 33 |
| L3 | 19 |
| L4 | 10 |
| Total | 500 |

Detected harnesses overlap when a report identifies more than one tool.

| Detected harness | Reports |
|---|---:|
| Claude Code | 330 |
| Antigravity | 134 |
| Codex | 98 |
| Cursor | 56 |
| GitHub Copilot | 21 |
| Windsurf | 8 |
| OpenCode | 6 |
| Cline | 3 |
| Continue | 1 |

## Windows checkout audit

The seven exclusions are documented in corpus/manifest.json and the selection ledger.

| Repository | Excluded path | Reason |
|---|---|---|
| telent/liminix | pkgs/devout/fixtures/sys/devices | Linux sysfs fixture paths contain colons |
| static-analyzer-factory/static-analyzer-factory | tests/benchmarks/ptaben/diff_tests/perf_history | Historical benchmark outputs contain timestamp colons |
| tinyplex/synclets | test/unit/__snapshots__ | Generated snapshots contain Windows-invalid punctuation |
| shrimpshiro-monet/kove | test-videos | Test video filename contains a pipe |
| heikopanjas/ask-skeletor | _assets/ask-skeletor.iconset | Icon asset filename contains a question mark |
| publicledger/data | data/raw_notebook_csvs | Raw CSV dataset filenames contain timestamp colons |
| slegroux/westside-la-events | static/logos | Logo asset filenames contain query-string characters |

No selected harness instructions or implementation source paths were omitted. The six repositories replaced after Windows checkout failures and the seven eligibility exclusions are listed with reasons in the selection ledger.
