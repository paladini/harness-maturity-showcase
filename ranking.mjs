export function popularityLabel(cohort) {
  return cohort === "ai-popularity" ? "AI popularity" :
    cohort === "crypto-popularity" ? "Crypto popularity" :
      cohort === "media-editing-popularity" ? "Media editing popularity" : "GitHub popularity";
}

export function reportVersions(projects) {
  return [...new Set(projects.filter((project) => Number.isFinite(project.score)).map((project) => project.toolVersion))]
    .sort((a, b) => b.localeCompare(a, "en", { numeric: true }));
}

export function rankedReports(projects, version) {
  return projects
    .filter((project) => Number.isFinite(project.score) && project.toolVersion === version)
    .sort((a, b) => b.score / b.maxScore - a.score / a.maxScore || a.repo.localeCompare(b.repo, "en"));
}
