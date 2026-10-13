import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-11-ai-ide-adoption-500-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const source = JSON.parse(await readFile(new URL("source-manifest.json", run)));
const history = JSON.parse(await readFile(new URL("source-history.json", run)));
const selectionBytes = await readFile(new URL("selection.json", run));
const selection = JSON.parse(selectionBytes);
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));
const currentSnapshot = JSON.parse(await readFile(new URL(
  "data/runs/2026-10-13-agriculture-software-popularity-500-corpus/manifest.json", root,
)));

test("the AI coding-assistant adoption cohort is pinned and traceable", async () => {
  assert.equal(snapshot.sourceCommit, "ce37e4151bb9ea7349da5afa17b4d393dfbc8fd1");
  assert.equal(snapshot.runId, "ai-ide-adoption-500");
  assert.equal(snapshot.toolVersion, "harness-score@1.8.1");
  assert.equal(snapshot.entries.length, 3186);
  assert.equal(source.entries.length, 3186);
  assert.equal(history.entries.length, 3186);
  assert.deepEqual(snapshot.selectionLedger, {
    file: "selection-2026-10-11-ai-ide-adoption-500.json",
    sha256: createHash("sha256").update(selectionBytes).digest("hex"),
  });
  assert.equal(selection.cohort, "ai-ide-adoption");
  assert.equal(selection.targetCount, 500);
  assert.equal(selection.achievedCount, 500);
  assert.equal(selection.selected.length, 500);

  const cohort = projects.filter((item) => item.selection?.cohort === "ai-ide-adoption");
  assert.equal(cohort.length, 500);
  assert.equal(new Set(cohort.map((item) => item.selection.githubRepositoryId)).size, 500);
  assert.equal(cohort.filter((item) => item.selection.githubStars > 0).length, 378);
  assert.equal(cohort.filter((item) => item.selection.githubStars === 0).length, 122);
  assert.ok(cohort.every((item) => item.selection.date === "2026-10-11" && typeof item.selection.archived === "boolean"));

  for (const candidate of selection.selected) {
    const listing = cohort.find((item) => item.selection.githubRepositoryId === Number(candidate.canonicalId));
    assert.ok(listing, candidate.canonicalSlug);
    assert.equal(listing.repo.toLowerCase(), candidate.canonicalSlug.toLowerCase(), candidate.canonicalSlug);
    assert.equal(listing.commit, candidate.commit, candidate.canonicalSlug);
    assert.equal(listing.corpusSourceCommit, currentSnapshot.sourceCommit, candidate.canonicalSlug);
    assert.ok(listing.evidence.includes(`/blob/${currentSnapshot.sourceCommit}/corpus/reports/`));
  }
});
