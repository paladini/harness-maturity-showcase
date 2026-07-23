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

This repository starts with two complementary data sets:

- 20 pinned, reproducible reports from the
  [Harness Maturity Analysis](https://github.com/paladini/harness-maturity-analysis).
- Public repositories that already display a Harness Score maturity badge.

Numeric rankings include only full reports. A badge proves the stated maturity
level, but it does not expose enough information to claim a numeric total.

## Submit your repository

The complete contribution is one object in
[`data/projects.json`](data/projects.json).

1. Run Harness Score in your public repository:

   ```sh
   npx harness-score --format json > harness-score.json
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
├── scripts/validate.mjs     # Deterministic submission checks
├── test/site.test.mjs       # Site and ranking invariants
├── index.html               # GitHub Pages entry point
├── app.js                   # Ranking, search, and filters
└── styles.css               # Responsive visual system
```

## Principles

- **Evidence before status.** Every listing links to public proof.
- **Comparable scores only.** Badge-only records never receive invented totals.
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
  — the reproducible 20-repository study that seeds the leaderboard.

## License

[MIT](LICENSE) © Fernando Paladini.
