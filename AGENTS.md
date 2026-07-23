# Agent guide

## Purpose

This repository publishes an evidence-backed Harness Score leaderboard as a
static GitHub Pages site.

## Source of truth

- `data/projects.json` contains every public listing.
- Numeric values must come from linked JSON reports.
- Badge-only entries must not claim numeric scores.

## Commands

```sh
npm ci
npm run check
python -m http.server 8765
```

## Conventions

- Keep the site dependency-free and compatible with GitHub Pages.
- Preserve accessible semantic HTML and keyboard-visible controls.
- Never add a score without public evidence.
- Keep normal community submissions limited to `data/projects.json`.
- Update tests when changing ranking or validation behavior.
