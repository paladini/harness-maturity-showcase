import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const run = new URL("data/runs/2026-10-22-scanner-refresh-1-8-3-corpus/", root);
const snapshot = JSON.parse(await readFile(new URL("manifest.json", run)));
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("the 1.8.3 corpus refresh records all scored and unavailable source entries", () => {
  assert.equal(snapshot.sourceCommit, "f7e1eefa16c80f78650e8c163c61d98cc4064001");
  assert.equal(snapshot.toolVersion, "harness-score@1.8.3");
  assert.equal(snapshot.entries.length, 6001);
  assert.deepEqual(snapshot.unavailableEntries.map(({ corpusName, status }) => ({ corpusName, status })), [
    { corpusName: "undisciplined-alchemist8546-jiofarm", status: "not-scanned" },
  ]);

  const unavailable = snapshot.unavailableEntries[0];
  assert.match(unavailable.note, /Repository not found/);
  assert.ok(projects.some((item) => item.repo === unavailable.repo && item.toolVersion === "1.8.2"));
  assert.ok(!projects.some((item) => item.repo === unavailable.repo && item.toolVersion === "1.8.3"));
  assert.equal(projects.filter((item) => item.toolVersion === "1.8.3").length, 6001);
});

test("the 1.8.4 refresh preserves complete evidence and identifies the unavailable entry", async () => {
  const nextRun = new URL("data/runs/2026-11-11-scanner-refresh-1-8-4-recovery-2-corpus/", root);
  const next = JSON.parse(await readFile(new URL("manifest.json", nextRun)));
  assert.equal(next.sourceCommit, "d020630c9f21f61537713742fda24572cb656bf8");
  assert.equal(next.toolVersion, "harness-score@1.8.4");
  assert.equal(next.entries.length, 6001);
  assert.deepEqual(next.unavailableEntries.map(({ corpusName, status }) => ({ corpusName, status })), [
    { corpusName: "undisciplined-alchemist8546-jiofarm", status: "not-scanned" },
  ]);
  assert.equal(projects.filter((item) => item.toolVersion === "1.8.4").length, 6001);
  assert.ok(!projects.some((item) => item.repo === next.unavailableEntries[0].repo && item.toolVersion === "1.8.4"));
  for (const name of ["vibe-coding-cn", "dev-infra-lerianstudio-ring", "harness-score"]) {
    const item = next.entries.find((entry) => entry.corpusName === name);
    const report = JSON.parse(await readFile(new URL(item.report, nextRun)));
    assert.equal(report.tool.version, "1.8.4");
    assert.deepEqual(report.score, { earned: item.score, max: item.maxScore, percent: report.score.percent });
    assert.equal(report.level.index, item.level);
  }
});
