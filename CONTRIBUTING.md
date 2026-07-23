# Contributing

Thanks for helping make AI harness maturity visible and verifiable.

## Add a repository

### Option 1: Submit a full report

Use this path to participate in the numeric ranking.

1. Run the current Harness Score release against a public repository:

   ```sh
   npx harness-score --format json > harness-score.json
   ```

2. Commit the report to that repository.
3. Add one object to `data/projects.json`.
4. Set `source` to `study`.
5. Copy `level`, `score`, and `maxScore` exactly from the report.
6. Set `commit` to the complete 40-character SHA that was measured.
7. Link `evidence` directly to the committed JSON report.

### Option 2: Submit a badge

Use this path when your README already displays an official Harness Score
maturity badge but you do not publish a full JSON report.

```json
{
  "repo": "your-name/your-project",
  "category": "community",
  "level": 1,
  "source": "badge",
  "evidence": "https://github.com/your-name/your-project/blob/main/README.md"
}
```

Do not add `score`, `maxScore`, or `commit` to a badge-only record. Badge-only
records appear in the showcase but not in the numeric ranking.

## Validate your change

Run:

```sh
npm ci
npm run check
```

The validation checks:

- repository names use `owner/name`;
- each repository appears once;
- levels range from L0 through L4;
- scores are possible and complete;
- full reports include a complete commit SHA;
- evidence uses a public GitHub URL; and
- badge-only records do not claim numeric totals.

## Pull request review

Keep a submission focused on one repository. Maintainers verify that the
evidence URL is public and that every submitted value matches it. A passing CI
check validates structure, but it does not replace evidence review.

Maintainers may ask you to regenerate reports produced by old or modified
scanner versions. Scores can change as repository harnesses improve and the
maturity model evolves. Submit a new pull request when you want to refresh an
entry.

## Improve the project

For site, documentation, or validation changes:

1. Open an issue describing the problem or proposed behavior.
2. Keep the implementation focused.
3. Add or update tests for behavior changes.
4. Verify the page at desktop and mobile widths.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
