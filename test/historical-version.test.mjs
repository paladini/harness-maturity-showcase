import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-07-25-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("the full 1.5.0 cohort is archived and independently selectable", async () => {
  assert.equal(snapshot.sourceCommit, "0efdd6b5b8161ea253364d15eec0b5856ef094c5");
  assert.equal(snapshot.toolVersion, "harness-score@1.5.0");
  assert.equal(snapshot.entries.length, 21);
  assert.equal(source.entries.length, 21);
  assert.equal(history.entries.length, 21);

  for (const entry of snapshot.entries) {
    const raw = await readFile(new URL(entry.report, run));
    const report = JSON.parse(raw);
    const historical = history.entries.find((item) => item.name === entry.corpusName);
    const listing = projects.find((item) => item.repo.toLowerCase() === entry.repo.toLowerCase() && item.toolVersion === "1.5.0");
    assert.equal(entry.sha256, createHash("sha256").update(raw).digest("hex"), entry.corpusName);
    assert.equal(report.tool.version, "1.5.0", entry.corpusName);
    assert.equal(report.truncated, false, entry.corpusName);
    assert.deepEqual(report.score, historical.score, entry.corpusName);
    assert.equal(listing.corpusSourceCommit, snapshot.sourceCommit, entry.corpusName);
    assert.equal(listing.commit, entry.commit, entry.corpusName);
    assert.equal(listing.evidence, entry.evidence, entry.corpusName);
  }
});
