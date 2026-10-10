import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { corpusListing, corpusRunPaths } from "../scripts/import-corpus.mjs";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-08-crypto-popularity-corpus/", root);

test("the prior 126-report crypto snapshot remains intact in the current registry", async () => {
  const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
  const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
  const history = JSON.parse(await readFile(new URL("source-history.json", run)));
  const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));
  assert.equal(snapshot.entries.length, 126);
  assert.equal(source.entries.length, 126);
  assert.equal(history.entries.length, 126);
  assert.equal(snapshot.runId, "crypto-popularity");
  assert.equal(source.runId, history.runId);
  assert.equal(history.date, source.runDate);
  assert.equal(history.toolVersion, source.toolVersion);
  assert.equal(corpusRunPaths(source).directory, "data/runs/2026-10-08-crypto-popularity-corpus/");
  assert.match(snapshot.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(new Set(projects.map(item => item.repo.toLowerCase())).size, 1207);
  assert.equal(projects.filter(item => item.source === "study").length, 1227);
  assert.equal(projects.filter(item => item.source === "badge").length, 1);
  assert.equal(projects.filter(item => item.corpusSourceCommit).length, 1207);
  for (const entry of source.entries) {
    const imported = snapshot.entries.find(item => item.corpusName === entry.name);
    assert.ok(imported, entry.name);
    const raw = await readFile(new URL(imported.report, run));
    const report = JSON.parse(raw);
    const historical = history.entries.find(item => item.name === entry.name);
    assert.ok(historical, entry.name);
    assert.equal(imported.sha256, createHash("sha256").update(raw).digest("hex"), entry.name);
    const expected = corpusListing(entry, report, { ...historical, toolVersion: history.toolVersion }, snapshot.sourceCommit, source.runDate);
    const { report: filename, sha256, ...listing } = imported;
    assert.deepEqual(listing, expected);
    const current = projects.find(item => item.repo === imported.repo && item.toolVersion === imported.toolVersion);
    assert.equal(current.commit, expected.commit, entry.name);
    assert.equal(current.score, expected.score, entry.name);
    assert.equal(current.corpusSourceCommit, "ba3ba209cc652f1c2849f8756a833b82d623faf9", entry.name);
    assert.equal(report.truncated, false);
  }
  const crypto = projects.filter(item => item.selection?.cohort === "crypto-popularity");
  assert.equal(crypto.length, 25);
  assert.equal(crypto.filter(item => item.selection.archived).length, 3);
  assert.deepEqual(crypto.map(item => item.selection.popularityRank).sort((a,b) => a-b), Array.from({ length: 25 }, (_,i) => i+1));
  assert.equal(projects.filter(item => item.selection?.cohort === "ai-popularity").length, 30);
  assert.equal(projects.filter(item => item.selection?.cohort === "media-editing-popularity").length, 25);
  for (const item of crypto) assert.ok(Number.isInteger(item.selection.githubStars) && item.selection.githubStars > 0);
  const archivedRun = new URL("data/runs/2026-10-08-corpus/", root);
  const archivedSource = JSON.parse(await readFile(new URL("source-manifest.json", archivedRun)));
  const archivedHistory = JSON.parse(await readFile(new URL("source-history.json", archivedRun)));
  for (const previous of archivedSource.entries) {
    assert.deepEqual(source.entries.find(item => item.name === previous.name), previous);
    const previousScore = archivedHistory.entries.find(item => item.name === previous.name);
    const currentScore = history.entries.find(item => item.name === previous.name);
    assert.deepEqual(currentScore.score, previousScore.score);
    assert.deepEqual(currentScore.level, previousScore.level);
  }
  const previousCommunity = snapshot.previousListings.filter(item => !item.evidence.includes("harness-maturity-analysis/blob/"));
  assert.equal(snapshot.previousListings.length, 122);
  assert.equal(previousCommunity.length, 21);
  for (const previous of previousCommunity) assert.deepEqual(projects.find(item => item.repo === previous.repo), previous);
});

test("CCXT supplemental evidence records the complete static Linux scan", async () => {
  const files = {
    "scan-environment-2026-10-08-ccxt.json": "97f552f6fb4d9eb34b2fe91242d8ce0e9b28dba0c1748f8bfac3e398a696ac83",
    "checkout-audit-2026-10-08-crypto-popularity-ccxt-linux.json": "b4d08de59ebb8a7a22530866513783d98d53fca28499c86ffec1fb263c04be7c",
  };
  const records = {};
  for (const [file, sha256] of Object.entries(files)) {
    const bytes = await readFile(new URL(file, run));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), sha256);
    records[file] = JSON.parse(bytes);
  }
  const receipt = records["scan-environment-2026-10-08-ccxt.json"];
  const audit = records["checkout-audit-2026-10-08-crypto-popularity-ccxt-linux.json"].entries[0];
  const report = JSON.parse(await readFile(new URL("ccxt.json", run)));
  assert.equal(receipt.platform, "linux");
  assert.equal(receipt.codeExecutedFromTarget, false);
  assert.equal(receipt.maturityStatus, "complete");
  assert.equal(receipt.truncated, false);
  assert.equal(audit.commit, receipt.commit);
  assert.equal(audit.checkoutStatus, "complete");
  assert.equal(audit.codeEvidence.status, "verified");
  assert.equal(report.score.earned, 74);
  assert.equal(report.score.max, 105);
  assert.equal(report.level.index, 1);
});
