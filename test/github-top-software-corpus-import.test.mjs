import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-10-github-top-software-1000-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const selectionBytes = await readFile(new URL("selection.json", run));
const selection = JSON.parse(selectionBytes);
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("the 1,000-repository GitHub popularity cohort is pinned and traceable", async () => {
  assert.equal(snapshot.sourceCommit, "48e9c7d1859b77cb11712945e5f1d83aa7098256");
  assert.equal(snapshot.runId, "github-top-software-1000");
  assert.equal(snapshot.toolVersion, "harness-score@1.8.1");
  assert.equal(snapshot.previousListings.length, 1228);
  assert.equal(snapshot.entries.length, 2186);
  assert.equal(source.entries.length, 2186);
  assert.equal(history.entries.length, 2186);
  assert.deepEqual(snapshot.selectionLedger, {
    file: "selection-2026-10-10-github-top-software-1000.json",
    sha256: createHash("sha256").update(selectionBytes).digest("hex"),
  });
  assert.equal(selection.targetCount, 1000);
  assert.equal(selection.achievedCount, 1000);
  assert.equal(selection.selected.length, 1000);

  const cohort = projects.filter((item) => item.selection?.cohort === "github-top-software-popularity");
  assert.equal(cohort.length, 1000);
  assert.equal(new Set(cohort.map((item) => item.selection.githubRepositoryId)).size, 1000);
  assert.equal(new Set(cohort.map((item) => item.commit)).size, 1000);
  for (const candidate of selection.selected) {
    const listing = cohort.find((item) => item.selection.githubRepositoryId === Number(candidate.canonicalId));
    assert.ok(listing, candidate.canonicalSlug);
    assert.equal(listing.repo.toLowerCase(), candidate.canonicalSlug.toLowerCase());
    assert.equal(listing.commit, candidate.commit);
    assert.equal(listing.corpusSourceCommit, snapshot.sourceCommit);
    assert.ok(listing.evidence.includes(`/blob/${snapshot.sourceCommit}/corpus/reports/`));
  }

  assert.equal(projects.length, 2228);
  assert.equal(new Set(projects.map((item) => item.repo.toLowerCase())).size, 2207);
  assert.equal(projects.filter((item) => item.toolVersion === "1.5.0").length, 21);
  assert.ok(snapshot.previousListings.every((previous) => projects.some((item) =>
    item.repo === previous.repo && item.toolVersion === previous.toolVersion)));
});

test("the full imported snapshot retains all complete reports and exact checksums", async () => {
  for (const entry of source.entries) {
    const imported = snapshot.entries.find((item) => item.corpusName === entry.name);
    assert.ok(imported, entry.name);
    const bytes = await readFile(new URL(imported.report, run));
    assert.equal(imported.sha256, createHash("sha256").update(bytes).digest("hex"), entry.name);
    const report = JSON.parse(bytes);
    const historical = history.entries.find((item) => item.name === entry.name);
    assert.ok(historical, entry.name);
    assert.equal(report.tool.version, "1.8.1", entry.name);
    assert.equal(report.truncated, false, entry.name);
    assert.equal(report.score.earned, historical.score.earned, entry.name);
    assert.equal(report.score.max, historical.score.max, entry.name);
    assert.equal(imported.commit, entry.commit, entry.name);
  }
});
