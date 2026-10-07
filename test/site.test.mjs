import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { rankedReports, reportVersions } from "../ranking.mjs";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("page has one h1 and core landmarks", () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const landmark of ["<header", "<main", "<footer", "<table"]) assert.match(html, new RegExp(landmark));
});

test("section header only routes back to Harness Score", () => {
  assert.match(html, /href="https:\/\/paladini\.io\/harness-score\/" aria-label="Harness Score home"/);
  assert.match(html, /class="nav-return" href="https:\/\/paladini\.io\/harness-score\/"/);
  assert.doesNotMatch(html, /<header[\s\S]*?<nav/);
});

test("all full study records expose reproducible reports", () => {
  const study = projects.filter((project) => project.source === "study" && project.toolVersion === "1.5.0");
  assert.equal(study.length, 21);
  assert.ok(study.every((project) => project.evidence.includes("/corpus/reports/")));
});

test("historical top three stay within their scanner version", () => {
  const sorted = rankedReports(projects, "1.5.0");
  assert.deepEqual(sorted.slice(0, 3).map((project) => project.repo), [
    "paladini/harness-score",
    "anthropics/claude-cookbooks",
    "promptfoo/promptfoo",
  ]);
});

test("rankings never mix scanner versions or badge-only entries", () => {
  const sample = [
    { repo: "a/old", toolVersion: "1.5.0", score: 108, maxScore: 108 },
    { repo: "a/new", toolVersion: "1.8.1", score: 90, maxScore: 105 },
    { repo: "a/higher-ratio", toolVersion: "1.8.1", score: 50, maxScore: 50 },
    { repo: "a/badge", level: 4 },
  ];
  assert.deepEqual(reportVersions(sample), ["1.8.1", "1.5.0"]);
  assert.deepEqual(rankedReports(sample, "1.8.1").map((project) => project.repo), ["a/higher-ratio", "a/new"]);
});
