import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-13-developer-infrastructure-popularity-816-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const selection = JSON.parse(await readFile(new URL("selection.json", run)));
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("the developer infrastructure cohort preserves its frozen selection and star provenance", () => {
  assert.equal(snapshot.sourceCommit, "2a88ecc00a4fbf8aa13e14692bf673c3c2aba6b7");
  assert.equal(snapshot.runId, "developer-infrastructure-popularity-816");
  assert.equal(snapshot.toolVersion, "harness-score@1.8.1");
  assert.equal(snapshot.entries.length, 5002);
  assert.equal(source.entries.length, 5002);
  assert.equal(selection.targetCount, 816);
  assert.equal(selection.achievedCount, 816);
  assert.equal(selection.selected.length, 816);

  const counts = Object.groupBy(selection.selected, (candidate) => candidate.category);
  assert.deepEqual(Object.fromEntries(Object.entries(counts).map(([key, values]) => [key, values.length])), {
    "database-data-platforms": 309,
    "developer-experience": 29,
    "code-quality": 185,
    "software-delivery-testing-build": 136,
    "developer-tools": 157,
  });

  const sourceByName = new Map(source.entries.map((entry) => [entry.name, entry]));
  const cohort = projects.filter((item) => item.toolVersion !== "1.8.3" && item.selection?.cohort === selection.cohort);
  assert.equal(cohort.length, 1632);
  assert.equal(new Set(cohort.map((item) => item.selection.githubRepositoryId)).size, 816);

  for (const candidate of selection.selected) {
    const entry = sourceByName.get(candidate.name);
    const listing = cohort.find((item) => item.selection.githubRepositoryId === candidate.githubRepositoryId);
    assert.ok(entry && listing, candidate.name);
    assert.equal(entry.commit, candidate.commit, candidate.name);
    assert.equal(entry.category, candidate.category, candidate.name);
    assert.equal(listing.repo.toLowerCase(), candidate.canonicalSlug.toLowerCase(), candidate.name);
    assert.equal(listing.commit, candidate.commit, candidate.name);
    assert.equal(listing.corpusSourceCommit, snapshot.sourceCommit, candidate.name);
    assert.equal(listing.selection.githubStars, candidate.stars, candidate.name);
    assert.equal(listing.selection.date, candidate.starsObservedAt.slice(0, 10), candidate.name);
    assert.equal(listing.selection.popularityRank, candidate.popularityRank, candidate.name);
    assert.ok(listing.evidence.includes(`/blob/${snapshot.sourceCommit}/corpus/reports/${candidate.name}.json`));
  }
});
