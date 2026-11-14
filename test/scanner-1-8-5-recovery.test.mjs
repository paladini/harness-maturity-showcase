import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { reportVersions } from "../ranking.mjs";
import { corpusListing } from "../scripts/import-corpus.mjs";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-11-14-scanner-refresh-1-8-5-recovery-1-corpus/", root);
const json = async (url) => JSON.parse(await readFile(url, "utf8"));

test("the 1.8.5 recovery publishes each pinned report and keeps eight unavailable entries explicit", async () => {
  const [snapshot, source, history, projects] = await Promise.all([
    json(new URL("manifest.json", run)), json(new URL("source-manifest.json", run)),
    json(new URL("source-history.json", run)), json(new URL("data/projects.json", root)),
  ]);
  assert.equal(source.toolVersion, "harness-score@1.8.5");
  assert.equal(snapshot.toolVersion, source.toolVersion);
  assert.equal(history.toolVersion, source.toolVersion);
  assert.equal(snapshot.runId, source.runId);
  assert.equal(history.runId, source.runId);
  assert.equal(snapshot.runDate, source.runDate);
  assert.equal(history.date, source.runDate);
  assert.match(snapshot.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(source.entries.length, 6002);
  assert.equal(history.entries.length, 6002);
  assert.equal(snapshot.entries.length, 5994);
  assert.equal(snapshot.unavailableEntries.length, 8);
  assert.equal(reportVersions(projects)[0], "1.8.5");
  const results = new Map(history.entries.map((entry) => [entry.name, entry]));
  const imported = new Map(snapshot.entries.map((entry) => [entry.corpusName, entry]));
  const missing = new Map(snapshot.unavailableEntries.map((entry) => [entry.corpusName, entry]));
  const current = projects.filter((entry) => entry.toolVersion === "1.8.5");
  const currentByRepo = new Map(current.map((entry) => [entry.repo.toLowerCase(), entry]));
  assert.equal(results.size, 6002);
  assert.equal(imported.size + missing.size, 6002);
  assert.equal(current.length, 5994);
  assert.equal(currentByRepo.size, current.length);
  for (const entry of source.entries) {
    const result = results.get(entry.name);
    assert.ok(result, entry.name);
    assert.equal(result.commit, entry.commit, entry.name);
    assert.equal(result.repoUrl, entry.repoUrl, entry.name);
    if (result.status !== "scored") {
      const unavailable = missing.get(entry.name);
      assert.ok(unavailable, entry.name);
      assert.equal(unavailable.commit, entry.commit, entry.name);
      assert.equal(unavailable.status, result.status, entry.name);
      assert.ok(unavailable.note, entry.name);
      continue;
    }
    const item = imported.get(entry.name);
    assert.ok(item, entry.name);
    const bytes = await readFile(new URL(item.report, run));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256, entry.name);
    const report = JSON.parse(bytes);
    const expected = corpusListing(entry, report, { ...result, toolVersion: history.toolVersion },
      snapshot.sourceCommit, source.runDate, entry.selection);
    const { report: reportFile, sha256, ...listing } = item;
    assert.deepEqual(listing, expected, entry.name);
    const published = currentByRepo.get(expected.repo.toLowerCase());
    assert.ok(published, entry.name);
    assert.equal(published.commit, entry.commit, entry.name);
    assert.equal(published.score, report.score.earned, entry.name);
    assert.equal(published.evidence, expected.evidence, entry.name);
  }
  assert.ok(imported.has("ai-ide-mikeydotio-lillist-1236962486"));
  assert.ok(!missing.has("ai-ide-mikeydotio-lillist-1236962486"));
  for (const evidence of snapshot.evidenceFiles) {
    const bytes = await readFile(new URL(evidence.file, run));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), evidence.sha256, evidence.file);
  }
  assert.ok(snapshot.evidenceFiles.some((item) => item.sourceFile === "corpus/checkout-audit-2026-11-14-lillist-1-8-5.md"));
});
