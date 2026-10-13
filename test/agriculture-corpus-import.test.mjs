import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-13-agriculture-software-popularity-500-corpus/", root);
const currentSnapshot = JSON.parse(await readFile(new URL(
  "data/runs/2026-10-13-developer-infrastructure-popularity-816-corpus/manifest.json", root,
)));
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const selectionBytes = await readFile(new URL("selection.json", run));
const selection = JSON.parse(selectionBytes);
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("the agriculture 500-repository popularity cohort is pinned and traceable", async () => {
  assert.equal(snapshot.sourceCommit, "cbe2eb650dcf1294d74e4bdb1fd11674244a0d09");
  assert.equal(snapshot.runId, "agriculture-software-popularity-500");
  assert.equal(snapshot.toolVersion, "harness-score@1.8.1");
  assert.equal(snapshot.entries.length, 4186);
  assert.equal(source.entries.length, 4186);
  assert.equal(history.entries.length, 4186);
  assert.deepEqual(snapshot.selectionLedger, {
    file: "selection-2026-10-13-agriculture-software-popularity-500.json",
    sha256: createHash("sha256").update(selectionBytes).digest("hex"),
  });
  assert.equal(selection.cohort, "agriculture-software-popularity-500");
  assert.equal(selection.category, "agriculture");
  assert.equal(selection.targetCount, 500);
  assert.equal(selection.achievedCount, 500);
  assert.equal(selection.selected.length, 500);

  const cohort = projects.filter((item) => item.selection?.cohort === selection.cohort);
  assert.equal(cohort.length, 500);
  assert.equal(new Set(cohort.map((item) => item.selection.githubRepositoryId)).size, 500);
  assert.ok(cohort.every((item) => item.category === "agriculture"));
  assert.ok(cohort.every((item) => item.selection.date === "2026-10-13"));

  const sourceByName = new Map(source.entries.map((entry) => [entry.name, entry]));
  const historyByName = new Map(history.entries.map((entry) => [entry.name, entry]));
  const importedByName = new Map(snapshot.entries.map((entry) => [entry.corpusName, entry]));
  for (const candidate of selection.selected) {
    const entry = sourceByName.get(candidate.name);
    const historical = historyByName.get(candidate.name);
    const imported = importedByName.get(candidate.name);
    const listing = cohort.find((item) => item.selection.githubRepositoryId === candidate.githubRepositoryId);
    assert.ok(entry && historical && imported && listing, candidate.name);
    assert.equal(entry.commit, candidate.commit, candidate.name);
    assert.equal(entry.category, "agriculture", candidate.name);
    assert.equal(listing.repo.toLowerCase(), candidate.canonicalSlug.toLowerCase(), candidate.name);
    assert.equal(listing.commit, candidate.commit, candidate.name);
    assert.equal(listing.corpusSourceCommit, currentSnapshot.sourceCommit, candidate.name);
    assert.equal(listing.toolVersion, "1.8.1", candidate.name);
    assert.equal(listing.selection.githubStars, candidate.githubStars, candidate.name);
    assert.ok(listing.evidence.includes(`/blob/${currentSnapshot.sourceCommit}/corpus/reports/${candidate.name}.json`));

    const bytes = await readFile(new URL(imported.report, run));
    const report = JSON.parse(bytes);
    assert.equal(imported.sha256, createHash("sha256").update(bytes).digest("hex"), candidate.name);
    assert.equal(report.tool.version, "1.8.1", candidate.name);
    assert.equal(report.truncated, false, candidate.name);
    assert.equal(report.score.earned, historical.score.earned, candidate.name);
    assert.equal(imported.commit, candidate.commit, candidate.name);
  }
});
