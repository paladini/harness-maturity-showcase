import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { corpusListing, mergeCorpusListings, selectionProvenance } from "../scripts/import-corpus.mjs";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-08-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("the original 101-report archive retains immutable, byte-verified evidence", async () => {
  assert.equal(snapshot.entries.length, 101);
  assert.match(snapshot.sourceCommit, /^[a-f0-9]{40}$/);
  for (const entry of source.entries) {
    const imported = snapshot.entries.find(item => item.corpusName === entry.name);
    const raw = await readFile(new URL(imported.report, run));
    const report = JSON.parse(raw);
    const historical = history.entries.find(item => item.name === entry.name);
    assert.equal(imported.sha256, createHash("sha256").update(raw).digest("hex"));
    const expected = corpusListing(entry, report, { ...historical, toolVersion: history.toolVersion }, snapshot.sourceCommit, source.runDate);
    const { report: filename, sha256, ...listing } = imported;
    assert.deepEqual(listing, expected);
    assert.ok(listing.evidence.includes(`/blob/${snapshot.sourceCommit}/corpus/reports/`));
    assert.equal(report.truncated, false);
  }
  assert.equal(snapshot.entries.filter(item => item.selection).length, 30);
  assert.equal(new Set(snapshot.entries.map(item => item.repo.toLowerCase())).size, 101);
});

test("community records are preserved while older report versions remain selectable", () => {
  const previousCommunity = snapshot.previousListings.filter(item => !item.evidence.includes("harness-maturity-analysis/blob/"));
  assert.equal(previousCommunity.length, 21);
  for (const previous of previousCommunity) assert.deepEqual(projects.find(item => item.repo === previous.repo), previous);
  assert.equal(snapshot.previousListings.filter(item => item.toolVersion === "1.5.0").length, 21);
  assert.equal(projects.filter(item => item.toolVersion === "1.5.0").length, 21);
});

test("imports retain each scanner version and replace only the matching version", () => {
  const entry = source.entries[0];
  const historical = { ...history.entries.find(item => item.name === entry.name), toolVersion: history.toolVersion };
  const report = { tool: { version: "1.8.1" }, truncated: true, level: historical.level, score: historical.score };
  assert.throws(() => corpusListing(entry, report, historical, snapshot.sourceCommit, source.runDate), /mismatch/);
  const listing = snapshot.entries[0];
  const oldVersion = { ...listing, toolVersion: "1.5.0", evidence: "https://github.com/paladini/harness-maturity-analysis/blob/old/report" };
  const merged = mergeCorpusListings([
    { repo: listing.repo.toUpperCase(), evidence: "https://github.com/example/badge" },
    { repo: "example/community", evidence: "https://github.com/example/community" },
    { repo: "example/old", evidence: "https://github.com/paladini/harness-maturity-analysis/blob/old/report" },
    oldVersion,
  ], [listing]);
  assert.deepEqual(merged.map(item => item.repo), ["example/community", "example/old", oldVersion.repo, listing.repo]);
  assert.deepEqual(merged.filter(item => item.repo.toLowerCase() === listing.repo.toLowerCase()).map(item => item.toolVersion), ["1.5.0", "1.8.1"]);
});

test("AI popularity selection provenance keeps dated stars and canonical identity", () => {
  const selection = selectionProvenance({
    githubRepositoryId: 12345,
    githubStars: 6789,
    popularityRank: 7,
    archived: false,
  }, "ai-popularity-500", "2026-10-09");
  assert.deepEqual(selection, {
    cohort: "ai-popularity-500",
    date: "2026-10-09",
    githubRepositoryId: 12345,
    githubStars: 6789,
    popularityRank: 7,
    archived: false,
  });
  assert.throws(() => selectionProvenance({ githubRepositoryId: "12345" }, "ai-popularity-500", "2026-10-09"), /Invalid popularity selection/);
});
