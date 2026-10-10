import assert from "node:assert/strict";
import test from "node:test";
import { corpusRunPaths } from "../scripts/import-corpus.mjs";
import { popularityLabel } from "../ranking.mjs";

test("same-day named runs retain distinct immutable snapshot and history paths", () => {
  const base = { runDate: "2026-10-08", toolVersion: "harness-score@1.8.1" };
  assert.deepEqual(corpusRunPaths(base), {
    directory: "data/runs/2026-10-08-corpus/",
    history: "corpus/history/2026-10-08-harness-score-1.8.1.json",
  });
  assert.deepEqual(corpusRunPaths({ ...base, runId: "crypto-popularity" }), {
    directory: "data/runs/2026-10-08-crypto-popularity-corpus/",
    history: "corpus/history/2026-10-08-harness-score-1.8.1-crypto-popularity.json",
  });
  for (const runId of ["", "../overwrite", "Crypto", "a/b", "a--b", 1, "a".repeat(65)]) {
    assert.throws(() => corpusRunPaths({ ...base, runId }), /Invalid corpus run identity/);
  }
});

test("popularity provenance labels each source cohort", () => {
  assert.equal(popularityLabel("crypto-popularity"), "Crypto popularity");
  assert.equal(popularityLabel("ai-popularity"), "AI popularity");
  assert.equal(popularityLabel("ai-popularity-500"), "AI software popularity");
  assert.equal(popularityLabel("media-editing-popularity"), "Media editing popularity");
  assert.equal(popularityLabel("another-cohort"), "GitHub popularity");
});
