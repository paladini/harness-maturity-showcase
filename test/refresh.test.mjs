import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));
const runRoot = new URL("data/runs/2026-10-07/", root);
const manifest = JSON.parse(await readFile(new URL("manifest.json", runRoot)));

test("all 20 refreshed listings match complete, unchanged, pinned reports", async () => {
  assert.equal(manifest.entries.length, 20);
  assert.equal(new Set(manifest.entries.map((entry) => entry.repo)).size, 20);
  assert.equal(manifest.toolVersion, "1.8.1");
  assert.ok(manifest.completedAt);
  for (const entry of manifest.entries) {
    const raw = await readFile(new URL(entry.report, runRoot));
    const report = JSON.parse(raw);
    const project = projects.find((item) => item.repo === entry.repo && item.toolVersion === manifest.toolVersion);
    assert.equal(entry.sha256, createHash("sha256").update(raw).digest("hex"), entry.repo);
    assert.equal(entry.status, "complete");
    assert.match(entry.commit, /^[a-f0-9]{40}$/);
    assert.equal(report.verdicts.maturity.status, "complete");
    assert.equal(report.truncated, false);
    assert.deepEqual(report.scopes.effective, ["repo"]);
    assert.equal(report.tool.version, manifest.toolVersion);
    assert.equal(project.toolVersion, report.tool.version);
    assert.equal(project.source, "study");
    assert.equal(project.commit, entry.commit);
    assert.equal(project.level, report.level.index);
    assert.equal(project.score, report.score.earned);
    assert.equal(project.maxScore, report.score.max);
    assert.equal(project.scannedAt, entry.scannedAt);
    assert.equal(project.evidence, `https://github.com/paladini/harness-maturity-showcase/blob/main/data/runs/2026-10-07/${entry.report}`);
  }
});

test("the additional ActiveAdmin listing remains outside the original 20", () => {
  assert.ok(!manifest.entries.some((entry) => entry.repo === "paladini/activeadmin-aaa-theme"));
  assert.equal(projects.find((project) => project.repo === "paladini/activeadmin-aaa-theme").source, "badge");
  assert.equal(projects.length, 693);
});
