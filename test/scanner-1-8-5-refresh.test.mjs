import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { reportVersions } from "../ranking.mjs";
import { corpusListing } from "../scripts/import-corpus.mjs";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-11-14-scanner-refresh-1-8-5-corpus/", root);
const json = async (url) => JSON.parse(await readFile(url, "utf8"));

test("the 1.8.5 refresh publishes every complete pinned report and retains unavailable entries", async () => {
  const [snapshot, source, history, projects] = await Promise.all([
    json(new URL("manifest.json", run)),
    json(new URL("source-manifest.json", run)),
    json(new URL("source-history.json", run)),
    json(new URL("data/projects.json", root)),
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
  assert.equal(history.entries.length, source.entries.length);
  const byHistory = new Map(history.entries.map((entry) => [entry.name, entry]));
  const bySnapshot = new Map(snapshot.entries.map((entry) => [entry.corpusName, entry]));
  const byUnavailable = new Map((snapshot.unavailableEntries ?? []).map((entry) => [entry.corpusName, entry]));
  const current = projects.filter((entry) => entry.toolVersion === "1.8.5");
  const currentByRepo = new Map(current.map((entry) => [entry.repo.toLowerCase(), entry]));
  assert.equal(byHistory.size, source.entries.length);
  assert.equal(bySnapshot.size + byUnavailable.size, source.entries.length);
  assert.equal(reportVersions(projects)[0], "1.8.5");
  assert.ok(current.length >= bySnapshot.size);
  assert.equal(currentByRepo.size, current.length);

  for (const entry of source.entries) {
    const result = byHistory.get(entry.name);
    assert.ok(result, entry.name);
    assert.equal(result.commit, entry.commit, entry.name);
    assert.equal(result.repoUrl, entry.repoUrl, entry.name);
    if (result.status !== "scored") {
      const unavailable = byUnavailable.get(entry.name);
      assert.ok(unavailable, entry.name);
      assert.equal(unavailable.commit, entry.commit, entry.name);
      assert.equal(unavailable.status, result.status, entry.name);
      assert.ok(unavailable.note, entry.name);
      continue;
    }
    const imported = bySnapshot.get(entry.name);
    assert.ok(imported, entry.name);
    const bytes = await readFile(new URL(imported.report, run));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), imported.sha256, entry.name);
    const report = JSON.parse(bytes);
    const expected = corpusListing(entry, report, { ...result, toolVersion: history.toolVersion },
      snapshot.sourceCommit, source.runDate, entry.selection);
    const { report: reportFile, sha256, ...listing } = imported;
    assert.deepEqual(listing, expected, entry.name);
    const publicEntry = currentByRepo.get(expected.repo.toLowerCase());
    assert.ok(publicEntry, entry.name);
    assert.equal(publicEntry.commit, entry.commit, entry.name);
    assert.equal(publicEntry.score, report.score.earned, entry.name);
  }
  for (const required of [
    "corpus/refresh-audit-2026-11-14-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-ccxt-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-llm-action-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-needle-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-vibe-coding-cn-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-aidlearning-framework-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-super-mario-bros-v0-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-dsh-mc-agent-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-ai4vj-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-everything-claude-unity-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-headscale-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-fuels-ts-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-sabaqai-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-agentsmesh-1-8-5.md",
    "corpus/checkout-audit-2026-11-14-ring-1-8-5.md",
    "corpus/source-audit-2026-11-14-genpark-tutor.md",
    "corpus/source-audit-2026-11-14-jiofarm.md",
    "corpus/source-audit-2026-11-14-ai-ide-unavailable.md",
  ]) assert.ok(snapshot.evidenceFiles.some((item) => item.sourceFile === required), required);
  assert.equal(snapshot.evidenceFiles.filter((item) =>
    item.sourceFile.startsWith("corpus/platform-receipts/harness-score-1.8.5-2026-11-14/")).length, 36);
  for (const evidence of snapshot.evidenceFiles) {
    const bytes = await readFile(new URL(evidence.file, run));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), evidence.sha256, evidence.file);
  }
});
