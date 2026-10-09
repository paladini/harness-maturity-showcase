# Harness Maturity Showcase

[![Check submissions](https://github.com/paladini/harness-maturity-showcase/actions/workflows/check.yml/badge.svg)](https://github.com/paladini/harness-maturity-showcase/actions/workflows/check.yml)
[![GitHub Pages](https://github.com/paladini/harness-maturity-showcase/actions/workflows/pages.yml/badge.svg)](https://github.com/paladini/harness-maturity-showcase/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-119366.svg)](LICENSE)

An open, evidence-backed leaderboard for repositories measured with
[Harness Score](https://paladini.io/harness-score/).

**[Explore the live showcase](https://paladini.github.io/harness-maturity-showcase/)**

## Why this exists

AI-assisted development gets more reliable when repositories provide durable
instructions, guardrails, validation, and feedback loops. The showcase
recognizes teams that make that investment and gives the community a
transparent way to inspect the evidence behind every listing.

This repository currently combines three evidence sets:

- 151 pinned, reproducible reports scanned with `harness-score@1.8.1` from the
  [Harness Maturity Analysis](https://github.com/paladini/harness-maturity-analysis),
  including 30 AI software projects, 25 cryptocurrency projects and 25 media
  editing projects selected from recorded GitHub searches. See the [latest
  import snapshot and raw reports](data/runs/2026-10-09-media-editing-popularity-corpus/README.md).
- 20 full reports from the original badge-listed projects, refreshed with
  `harness-score@1.8.1` on October 7, 2026. See the
  [results and pinned run manifest](data/runs/2026-10-07/README.md).
- 1 additional public repository with a README badge only.

Numeric rankings include only full reports and compare repositories within the
same scanner version. The podium defaults to the newest version; the scanner
filter exposes each cohort. A badge records a public level claim, not a verified
current score. This index has 172 repositories: 171 full reports and 1 badge-only entry.

The 101 earlier corpus listings remain available in their original immutable
[archive](data/runs/2026-10-08-corpus/README.md). The current registry links all
151 corpus reports to the new analysis commit. Previous registry values remain
in each import snapshot; the original community
run stays unchanged. Each corpus evidence link fixes the analysis commit, and
byte-identical report copies with SHA-256 checksums are retained here.
Popularity observations are separate metadata, never ranking points or blind
human validation. Historical scanner-only entries may include instructional
repositories; both popularity cohorts exclude guides and awesome lists.
Cryptocurrency stars describe cumulative GitHub popularity observed at selection
time, not an all-time historical maximum or investment merit. Media editing
stars are selection metadata from the recorded bounded search union, not a
global rank or a measure of harness maturity.

## Import a published corpus

The showcase does not automatically sync with the analysis repository. Import
an immutable, fully published analysis commit with:

```sh
npm run corpus:import -- --commit <40-character-analysis-commit>
npm run check
```

The importer verifies matching reports/history before updating the registry,
preserves community listings and writes a new dated snapshot. Existing snapshot
directories cannot be overwritten. Publish through a reviewed PR; Pages deploys
automatically after merge into main.

Named analysis runs use the manifest's optional `runId` in both the upstream
history filename and the local snapshot directory. This lets separate cohorts
run on the same date without replacing previous evidence. For example,
`runId: crypto-popularity` retains `data/runs/2026-10-08-crypto-popularity-corpus/`
alongside the earlier `data/runs/2026-10-08-corpus/`. The importer rejects
mismatched run identities and unsafe identifiers.

## Submit your repository

The complete contribution is one object in
[`data/projects.json`](data/projects.json).

1. Run Harness Score in your public repository:

   ```sh
   npx harness-score --json > harness-score.json
   ```

2. Commit `harness-score.json` to the repository you measured.
3. Fork this repository and add one record:

   ```json
   {
     "repo": "your-name/your-project",
     "category": "community",
     "level": 3,
     "score": 82,
     "maxScore": 108,
     "toolVersion": "1.5.0",
     "source": "study",
     "commit": "40-character-commit-sha-of-the-measured-repository",
     "evidence": "https://github.com/your-name/your-project/blob/main/harness-score.json"
   }
   ```

4. Run `npm run check`.
5. Open a pull request with the submission template.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the evidence rules, badge-only
format, and review process. You can also
[start with the guided submission form](https://github.com/paladini/harness-maturity-showcase/issues/new?template=submit-project.yml).

## Verification model

The project deliberately separates two forms of evidence:

| Source | What it proves | Numeric rank |
| --- | --- | --- |
| Full JSON report | Exact score, maximum, level, scanner output, and measured commit | Yes |
| README maturity badge | Public claim for a Harness Score maturity level | No |

Automated checks reject malformed repository names, duplicates, impossible
scores, invalid levels, missing commit SHAs, and non-GitHub evidence links.
Reviewers then open the evidence URL and compare the submitted values.

## Local development

The site uses static HTML, CSS, and JavaScript. It has no runtime dependencies.

```sh
npm ci
npm run check
python -m http.server 8765
```

Open `http://127.0.0.1:8765`.

## Project structure

```text
.
├── data/projects.json       # Public registry and source of truth
├── data/runs/               # Dated scan manifests and unmodified JSON reports
├── scripts/validate.mjs     # Deterministic submission checks
├── test/site.test.mjs       # Site and ranking invariants
├── index.html               # GitHub Pages entry point
├── app.js                   # Ranking, search, and filters
└── styles.css               # Responsive visual system
```

## Principles

- **Evidence before status.** Every listing links to public proof.
- **Comparable scores only.** Badge-only records never receive invented totals.
  Numeric ranks are scoped to a single scanner version.
- **Small contributions.** A normal submission changes one data file.
- **Open infrastructure.** The registry, validation, site, and deployment are
  available under the MIT License.

## Community

Use [GitHub Discussions](https://github.com/paladini/harness-maturity-showcase/discussions)
for ideas and questions. Use
[GitHub Issues](https://github.com/paladini/harness-maturity-showcase/issues)
for reproducible bugs. All participation follows the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Related projects

- [Harness Score](https://github.com/paladini/harness-score) — the deterministic
  scanner and maturity model.
- [Harness Maturity Analysis](https://github.com/paladini/harness-maturity-analysis)
  — the reproducible 151-repository corpus that seeds the leaderboard.

## License

[MIT](LICENSE) © Fernando Paladini.
