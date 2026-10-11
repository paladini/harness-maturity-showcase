import assert from "node:assert/strict";
import test from "node:test";
import { filterProjects, rankedReports, reportVersions } from "../ranking.mjs";

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
