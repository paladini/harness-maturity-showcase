import assert from "node:assert/strict";
import test from "node:test";
import { filterProjects, paginate, rankedReports, reportVersions } from "../ranking.mjs";

const report = (repo, toolVersion, score, maxScore, level, extra = {}) => ({
  repo,
  toolVersion,
  score,
  maxScore,
  level,
  source: "study",
  category: "community",
  selection: { cohort: "ai-popularity" },
  ...extra,
});

test("rank uses raw score, then percentage, then repository name within each version", () => {
  const projects = [
    report("a/percent-first", "1.8.1", 98, 105, 4),
    report("a/raw-first", "1.8.1", 100, 108, 1),
    report("a/tie-z", "1.8.1", 90, 100, 3),
    report("a/tie-a", "1.8.1", 90, 100, 0),
    report("a/other-version", "1.9.0", 110, 120, 4),
    { repo: "a/badge", level: 4 },
  ];

  assert.deepEqual(rankedReports(projects, "1.8.1").map((project) => project.repo), [
    "a/raw-first",
    "a/percent-first",
    "a/tie-a",
    "a/tie-z",
  ]);
  assert.deepEqual(rankedReports(projects, "1.9.0").map((project) => project.repo), ["a/other-version"]);
  assert.deepEqual(reportVersions(projects), ["1.9.0", "1.8.1"]);
});

test("filter facets omit only their own active selection", () => {
  const projects = [
    report("a/one", "1.8.1", 100, 105, 4, { category: "ai", selection: { cohort: "ai-popularity" } }),
    report("a/two", "1.5.0", 90, 100, 4, { category: "ai", selection: { cohort: "ai-popularity" } }),
    report("b/three", "1.8.1", 80, 100, 1, { category: "web", selection: { cohort: "none" } }),
    { repo: "a/badge", level: 4, source: "badge", category: "ai", selection: { cohort: "ai-popularity" } },
  ];
  const state = {
    query: "a/",
    level: "4",
    source: "study",
    category: "ai",
    cohort: "ai-popularity",
    version: "1.8.1",
  };

  assert.deepEqual(filterProjects(projects, state).map((project) => project.repo), ["a/one"]);
  assert.deepEqual(filterProjects(projects, state, "level").map((project) => project.repo), ["a/one"]);
  assert.deepEqual(filterProjects(projects, state, "version").map((project) => project.repo), ["a/one", "a/two"]);
  assert.deepEqual(filterProjects(projects, { ...state, level: "all", version: "all" }, "level").map((project) => project.repo), [
    "a/one",
    "a/two",
  ]);
});

test("pagination preserves sorted order and clamps page numbers", () => {
  const projects = Array.from({ length: 205 }, (_, index) => ({ repo: `repo/${index}` }));

  const first = paginate(projects, 1, 100);
  const second = paginate(projects, 2, 100);
  const last = paginate(projects, 3, 100);

  assert.deepEqual({ page: first.page, pageCount: first.pageCount, total: first.total, start: first.start, end: first.end }, {
    page: 1, pageCount: 3, total: 205, start: 1, end: 100,
  });
  assert.equal(first.items.length, 100);
  assert.equal(second.items.length, 100);
  assert.equal(last.items.length, 5);
  assert.equal(new Set([...first.items, ...second.items, ...last.items]).size, 205);
  assert.deepEqual(paginate(projects, 99, 100).items, last.items);
  assert.deepEqual(paginate(projects, 0, 100).items, first.items);
});

test("empty result pagination remains on page one with a zero range", () => {
  assert.deepEqual(paginate([], 8, 100), {
    items: [], page: 1, pageCount: 1, total: 0, start: 0, end: 0,
  });
  assert.throws(() => paginate([], 1, 0), /positive integer/);
});
