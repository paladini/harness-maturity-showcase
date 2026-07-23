import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));

test("page has one h1 and core landmarks", () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const landmark of ["<header", "<main", "<footer", "<table"]) assert.match(html, new RegExp(landmark));
});

test("shared navigation keeps Harness Score as the product home", () => {
  assert.match(html, /href="https:\/\/paladini\.io\/harness-score\/" aria-label="Harness Score home"/);
  assert.match(html, />Guide<\/a>/);
  assert.match(html, />Maturity Model<\/a>/);
  assert.match(html, /aria-current="page">Showcase<\/a>/);
});

test("all full study records expose reproducible reports", () => {
  const study = projects.filter((project) => project.source === "study");
  assert.equal(study.length, 20);
  assert.ok(study.every((project) => project.evidence.includes("/corpus/reports/")));
});

test("top three are ordered by normalized score", () => {
  const scored = projects.filter((project) => Number.isFinite(project.score));
  const sorted = [...scored].sort((a, b) => b.score / b.maxScore - a.score / a.maxScore);
  assert.deepEqual(sorted.slice(0, 3).map((project) => project.repo), [
    "paladini/harness-score",
    "anthropics/anthropic-cookbook",
    "promptfoo/promptfoo",
  ]);
});
