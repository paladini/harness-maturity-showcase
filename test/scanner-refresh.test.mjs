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
