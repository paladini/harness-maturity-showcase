export function popularityLabel(cohort) {
  return cohort === "ai-popularity" ? "AI popularity" :
    cohort === "ai-popularity-500" ? "AI software popularity" :
    cohort === "game-ai-popularity-500" ? "Video game AI popularity" :
    cohort === "crypto-popularity" ? "Crypto popularity" :
      cohort === "media-editing-popularity" ? "Media editing popularity" : "GitHub popularity";
}

export function reportVersions(projects) {
  return [...new Set(projects.filter((project) => Number.isFinite(project.score)).map((project) => project.toolVersion))]
    .sort((a, b) => b.localeCompare(a, "en", { numeric: true }));
}

export function repositoryCount(projects) {
  return new Set(projects.map((project) => project.repo.toLowerCase())).size;
}

export function rankedReports(projects, version) {
  return projects
    .filter((project) => Number.isFinite(project.score) && project.toolVersion === version)
    .sort((a, b) => b.score - a.score || b.score / b.maxScore - a.score / a.maxScore || a.repo.localeCompare(b.repo, "en"));
}

export function filterProjects(projects, state, omit = "") {
  return projects
    .filter((project) => project.repo.toLowerCase().includes(state.query))
    .filter((project) => omit === "level" || state.level === "all" || String(project.level) === state.level)
    .filter((project) => omit === "source" || state.source === "all" || project.source === state.source)
    .filter((project) => omit === "category" || state.category === "all" || project.category === state.category)
    .filter((project) => omit === "cohort" || state.cohort === "all" || (project.selection?.cohort ?? "none") === state.cohort)
    .filter((project) => omit === "version" || state.version === "all" || project.toolVersion === state.version);
}
