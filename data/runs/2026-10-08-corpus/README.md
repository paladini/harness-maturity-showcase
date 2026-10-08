# Corpus import - October 8, 2026

This snapshot imports all **101** pinned reports from analysis commit
[`6de12c580a0119b015ca7f7b60d298b746ff36bc`](https://github.com/paladini/harness-maturity-analysis/tree/6de12c580a0119b015ca7f7b60d298b746ff36bc),
merged in [analysis PR #4](https://github.com/paladini/harness-maturity-analysis/pull/4).
Every report uses `harness-score@1.8.1`; none is truncated.

- [Source manifest](source-manifest.json): exact repository commits, categories,
  notes, stress cases and optional popularity provenance.
- [Official history](source-history.json): matching scores and maturity levels.
- [Import manifest](manifest.json): immutable public evidence links, local raw
  report filenames, SHA-256 checksums and the previous 42 registry records.
- [Selection protocol and software evidence](https://github.com/paladini/harness-maturity-analysis/blob/6de12c580a0119b015ca7f7b60d298b746ff36bc/corpus/selection-2026-10-08-ai-popularity.json):
  30 eligible new AI software projects, frozen stars and higher-ranked exclusions.

Reports and source manifests are copied byte-for-byte from the published
analysis commit. Their local checkout paths describe the original scan machine.
The importer verifies complete report/history agreement before replacing the
registry. It does not clone, install or execute any measured repository.

The 21 old corpus listings now use matching 1.8.1 values and immutable evidence,
instead of pointing 1.5.0 values at the changing analysis main branch. The
snapshot retains their previous registry values for audit. Its `previousListings`
field is a historical registry backup, not the current evidence index. The
20 community reports and one badge-only entry remain unchanged, giving
**122 unique listings: 121 full reports and one badge**.

The new AI cohort excludes guides and awesome lists. Earlier corpus control
and artifact cases remain available. Stars do not affect harness ranks;
showcase scores do not supply blind human ratings or assess AI product quality.

## Reproduction and publication

```sh
npm run corpus:import -- --commit 6de12c580a0119b015ca7f7b60d298b746ff36bc
npm run check
```

Import only into a checkout without this dated snapshot: existing run
directories are immutable. A future corpus run uses a new dated directory.
GitHub Pages deploys the registry and static UI after a reviewed main merge.

Maintainer request and contribution: @paladini.
