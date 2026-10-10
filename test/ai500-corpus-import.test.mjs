import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-09-ai-popularity-500-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));
const selectionBytes = await readFile(new URL("selection.json", run));
const selection = JSON.parse(selectionBytes);

test("the 500-project AI popularity cohort is pinned and traceable", async () => {
  assert.equal(snapshot.sourceCommit, "b26cd4ef0fab3864c0053ddbba4c752b8678ba99");
  assert.equal(snapshot.entries.length, 651);
  assert.equal(source.entries.length, 651);
  assert.equal(history.entries.length, 651);
  assert.deepEqual(snapshot.selectionLedger, {
    file: "selection-2026-10-09-ai-500.json",
    sha256: createHash("sha256").update(selectionBytes).digest("hex"),
  });
  assert.equal(selection.candidates.length, 500);

  const cohort = projects.filter((item) => item.selection?.cohort === "ai-popularity-500");
  assert.equal(cohort.length, 500);
  assert.equal(new Set(cohort.map((item) => item.selection.githubRepositoryId)).size, 500);
  assert.deepEqual(cohort.map((item) => item.selection.popularityRank).sort((a, b) => a - b),
    Array.from({ length: 500 }, (_, index) => index + 1));
  assert.ok(cohort.every((item) => item.selection.date === "2026-10-09" && item.selection.githubStars > 0));
  assert.equal(cohort.filter((item) => item.selection.archived).length, 25);

  for (const candidate of selection.candidates) {
    const listing = cohort.find((item) => item.selection.githubRepositoryId === candidate.githubRepositoryId);
    assert.ok(listing, candidate.canonicalSlug);
    assert.equal(listing.commit, candidate.commit, candidate.canonicalSlug);
    assert.equal(listing.repo.toLowerCase(), candidate.canonicalSlug.toLowerCase(), candidate.canonicalSlug);
    assert.ok(listing.evidence.includes(`/blob/${listing.corpusSourceCommit}/corpus/reports/`));
  }
  for (const item of snapshot.evidenceFiles) {
    const bytes = await readFile(new URL(item.file, run));
    assert.equal(item.sha256, createHash("sha256").update(bytes).digest("hex"), item.file);
  }
  assert.equal(projects.filter((item) => item.selection?.cohort === "ai-popularity").length, 30);
  assert.equal(projects.filter((item) => item.selection?.cohort === "crypto-popularity").length, 25);
  assert.equal(projects.filter((item) => item.selection?.cohort === "media-editing-popularity").length, 25);
  assert.equal(projects.length, 2228);
  assert.equal(new Set(projects.map((item) => item.repo.toLowerCase())).size, 2207);
  assert.equal(projects.filter((item) => item.toolVersion === "1.5.0").length, 21);
});

test("every imported report matches the complete immutable source history", async () => {
  for (const entry of source.entries) {
    const imported = snapshot.entries.find((item) => item.corpusName === entry.name);
    assert.ok(imported, entry.name);
    const bytes = await readFile(new URL(imported.report, run));
    assert.equal(imported.sha256, createHash("sha256").update(bytes).digest("hex"), entry.name);
    const report = JSON.parse(bytes);
    const historical = history.entries.find((item) => item.name === entry.name);
    assert.equal(report.tool.version, "1.8.1", entry.name);
    assert.equal(report.truncated, false, entry.name);
    assert.equal(report.score.earned, historical.score.earned, entry.name);
    assert.equal(report.score.max, historical.score.max, entry.name);
    assert.equal(imported.commit, entry.commit, entry.name);
  }
});

test("all community and badge listings survive the refreshed corpus", () => {
  const community = snapshot.previousListings.filter((item) => !item.corpusSourceCommit &&
    !item.evidence.startsWith("https://github.com/paladini/harness-maturity-analysis/blob/"));
  assert.equal(community.length, 21);
  for (const previous of community) {
    assert.ok(projects.some((item) => item.repo === previous.repo && item.evidence === previous.evidence), previous.repo);
  }
  const badge = projects.find((item) => item.source === "badge");
  assert.ok(badge);
  assert.equal("score" in badge, false);
});
