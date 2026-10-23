export function popularityLabel(cohort) {
  return cohort === "ai-popularity" ? "AI popularity" :
    cohort === "ai-popularity-500" ? "AI software popularity" :
    cohort === "game-ai-popularity-500" ? "Video game AI popularity" :
    cohort === "crypto-popularity" ? "Crypto popularity" :
      cohort === "media-editing-popularity" ? "Media editing popularity" :
        cohort === "scientific-software-random-500" ? "Scientific software random sample" :
        cohort === "developer-infrastructure-popularity-816" ? "Developer infrastructure popularity" :
          cohort === "geospatial-mapping-popularity-1000" ? "Geospatial and mapping popularity" : "GitHub popularity";
}

export function reportVersions(projects) {
  return [...new Set(projects.filter((project) => Number.isFinite(project.score)).map((project) => project.toolVersion))]
    .sort((a, b) => b.localeCompare(a, "en", { numeric: true }));
}

export function repositoryCount(projects) {
  return new Set(projects.map((project) => project.repo.toLowerCase())).size;
}

export function paginate(items, page, pageSize) {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new RangeError("Page size must be a positive integer");

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, Number.isInteger(page) ? page : 1), pageCount);
  const offset = (currentPage - 1) * pageSize;

  return {
    items: items.slice(offset, offset + pageSize),
    page: currentPage,
    pageCount,
    total,
    start: total ? offset + 1 : 0,
    end: Math.min(offset + pageSize, total),
  };
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
