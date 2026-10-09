import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-09-media-editing-popularity-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("the media editing import matches its immutable analysis source and preserves the catalog", async () => {
  assert.equal(snapshot.sourceCommit, "c3eee241e04da6eaa1ebf700b3a715779a013b55");
  assert.equal(snapshot.runId, "media-editing-popularity");
  assert.equal(snapshot.entries.length, 151);
  assert.equal(source.entries.length, 151);
  assert.equal(history.entries.length, 151);
  assert.equal(source.runDate, "2026-10-09");
  assert.equal(source.toolVersion, "harness-score@1.8.1");
  assert.equal(history.runId, source.runId);
  assert.equal(history.date, source.runDate);
  assert.equal(history.toolVersion, source.toolVersion);
  assert.equal(snapshot.previousListings.length, 147);
  assert.equal(new Set(projects.map((item) => item.repo.toLowerCase())).size, 172);
  assert.equal(projects.filter((item) => item.corpusSourceCommit).length, 172);
  assert.equal(projects.filter((item) => item.source === "study").length, 192);
  assert.equal(projects.filter((item) => item.source === "badge").length, 1);

  const mediaEditing = projects.filter((item) => item.selection?.cohort === "media-editing-popularity");
  assert.equal(mediaEditing.length, 25);
  assert.ok(mediaEditing.every((item) => Number.isInteger(item.selection.githubStars)));
  assert.ok(mediaEditing.every((item) => item.selection.popularityRank === undefined));

  for (const entry of source.entries) {
    const imported = snapshot.entries.find((item) => item.corpusName === entry.name);
    assert.ok(imported, entry.name);
    const raw = await readFile(new URL(imported.report, run));
    const report = JSON.parse(raw);
    const historical = history.entries.find((item) => item.name === entry.name);
    assert.ok(historical, entry.name);
    assert.equal(imported.sha256, createHash("sha256").update(raw).digest("hex"), entry.name);
    assert.equal(imported.commit, entry.commit, entry.name);
    assert.equal(report.truncated, false, entry.name);
    assert.equal(report.tool.version, "1.8.1", entry.name);
    const { report: reportFile, sha256, ...listing } = imported;
    assert.deepEqual(
      projects.find((item) => item.repo.toLowerCase() === imported.repo.toLowerCase() && item.toolVersion === imported.toolVersion),
      listing,
    );
  }

  for (const previous of snapshot.previousListings.filter(
    (item) => !item.evidence.includes("harness-maturity-analysis/blob/"),
  )) {
    assert.deepEqual(projects.find((item) => item.repo === previous.repo), previous);
  }
});
