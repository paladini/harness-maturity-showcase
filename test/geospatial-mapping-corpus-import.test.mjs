import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-14-geospatial-mapping-popularity-1000-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const selectionBytes = await readFile(new URL("selection.json", run));
const selection = JSON.parse(selectionBytes);
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));
const currentSnapshot = JSON.parse(await readFile(new URL(
  "data/runs/2026-10-14-geospatial-mapping-popularity-1000-corpus/manifest.json", root,
)));

test("the 1,000-repository geospatial cohort is pinned and traceable", async () => {
  assert.match(snapshot.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(snapshot.runId, "geospatial-mapping-popularity-1000");
  assert.equal(snapshot.toolVersion, "harness-score@1.8.2");
  assert.equal(snapshot.entries.length, 6002);
  assert.equal(source.entries.length, 6002);
  assert.equal(history.entries.length, 6002);
  assert.deepEqual(snapshot.selectionLedger, {
    file: "selection-2026-10-14-geospatial-mapping-popularity-1000.json",
    sha256: createHash("sha256").update(selectionBytes).digest("hex"),
  });
  assert.equal(selection.targetCount, 1000);
  assert.equal(selection.achievedCount, 1000);
  assert.equal(selection.selected.length, 1000);

  const platformReceipts = snapshot.evidenceFiles.filter((item) => item.sourceFile?.includes("/platform-receipts/"));
  assert.equal(platformReceipts.length, 43);
  for (const item of platformReceipts) {
    const bytes = await readFile(new URL(item.file, run));
    const receipt = JSON.parse(bytes);
    const sourceEntry = source.entries.find((entry) => entry.name === receipt.manifestName);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
    assert.equal(receipt.commit, sourceEntry.commit);
    assert.equal(receipt.report.toolVersion, "1.8.2");
    const reportBytes = await readFile(new URL(`${receipt.manifestName}.json`, run));
    assert.equal(createHash("sha256").update(reportBytes).digest("hex"), receipt.report.sha256);
  }

  const cohort = projects.filter((item) => item.toolVersion !== "1.8.3" && item.selection?.cohort === "geospatial-mapping-popularity-1000");
  assert.equal(cohort.length, 1000);
  assert.equal(new Set(cohort.map((item) => item.selection.githubRepositoryId)).size, 1000);
  assert.equal(new Set(cohort.map((item) => item.commit)).size, 1000);
  for (const candidate of selection.selected) {
    const listing = cohort.find((item) => item.selection.githubRepositoryId === Number(candidate.canonicalId));
    assert.ok(listing, candidate.canonicalSlug);
    assert.equal(listing.repo.toLowerCase(), candidate.canonicalSlug.toLowerCase());
    assert.equal(listing.commit, candidate.commit);
    assert.equal(listing.corpusSourceCommit, currentSnapshot.sourceCommit);
    assert.ok(listing.evidence.includes(`/blob/${currentSnapshot.sourceCommit}/corpus/reports/`));
  }

  assert.equal(projects.length, 17047);
  assert.equal(new Set(projects.map((item) => item.repo.toLowerCase())).size, 6023);
});

test("the imported snapshot preserves every complete report and checksum", async () => {
  for (const entry of source.entries) {
    const imported = snapshot.entries.find((item) => item.corpusName === entry.name);
    assert.ok(imported, entry.name);
    const bytes = await readFile(new URL(imported.report, run));
    assert.equal(imported.sha256, createHash("sha256").update(bytes).digest("hex"), entry.name);
    const report = JSON.parse(bytes);
    const historical = history.entries.find((item) => item.name === entry.name);
    assert.ok(historical, entry.name);
    assert.equal(report.tool.version, "1.8.2", entry.name);
    assert.equal(report.truncated, false, entry.name);
    assert.equal(report.score.earned, historical.score.earned, entry.name);
    assert.equal(report.score.max, historical.score.max, entry.name);
    assert.equal(imported.commit, entry.commit, entry.name);
  }
});
