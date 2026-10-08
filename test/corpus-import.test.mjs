import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { corpusListing, mergeCorpusListings } from "../scripts/import-corpus.mjs";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-08-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("every imported corpus listing has immutable, byte-verified report evidence", async () => {
  assert.equal(snapshot.entries.length, 101);
  assert.match(snapshot.sourceCommit, /^[a-f0-9]{40}$/);
  for (const entry of source.entries) {
    const imported = snapshot.entries.find(item => item.corpusName === entry.name);
    const raw = await readFile(new URL(imported.report, run));
    const report = JSON.parse(raw);
    const historical = history.entries.find(item => item.name === entry.name);
    assert.equal(imported.sha256, createHash("sha256").update(raw).digest("hex"));
    const expected = corpusListing(entry, report, { ...historical, toolVersion: history.toolVersion }, snapshot.sourceCommit, source.runDate);
    const project = projects.find(item => item.repo === imported.repo);
    assert.deepEqual(project, expected);
    assert.ok(project.evidence.includes(`/blob/${snapshot.sourceCommit}/corpus/reports/`));
    assert.equal(report.truncated, false);
  }
  assert.equal(projects.filter(item => item.selection).length, 30);
  assert.equal(new Set(projects.map(item => item.repo.toLowerCase())).size, 122);
});

test("community records and previous registry values are preserved", () => {
  const previousCommunity = snapshot.previousListings.filter(item => !item.evidence.includes("harness-maturity-analysis/blob/"));
  assert.equal(previousCommunity.length, 21);
  for (const previous of previousCommunity) assert.deepEqual(projects.find(item => item.repo === previous.repo), previous);
  assert.equal(snapshot.previousListings.filter(item => item.toolVersion === "1.5.0").length, 21);
});

test("import rejects report mismatches and replaces corpus entries without duplicate repos", () => {
  const entry = source.entries[0];
  const historical = { ...history.entries.find(item => item.name === entry.name), toolVersion: history.toolVersion };
  const report = { tool: { version: "1.8.1" }, truncated: true, level: historical.level, score: historical.score };
  assert.throws(() => corpusListing(entry, report, historical, snapshot.sourceCommit, source.runDate), /mismatch/);
  const listing = snapshot.entries[0];
  assert.deepEqual(mergeCorpusListings([
    { repo: listing.repo.toUpperCase(), evidence: "https://github.com/example/badge" },
    { repo: "example/community", evidence: "https://github.com/example/community" },
    { repo: "example/old", evidence: "https://github.com/paladini/harness-maturity-analysis/blob/old/report" },
  ], [listing]).map(item => item.repo), [listing.repo, "example/community"]);
});
