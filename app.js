import { filterProjects, paginate, popularityLabel, rankedReports, reportVersions, repositoryCount } from "./ranking.mjs?v=20261023.1";

const PAGE_SIZE = 100;

const levels = {
  0: ["Unharnessed", "l0"],
  1: ["Documented", "l1"],
  2: ["Guarded", "l2"],
  3: ["Sensing", "l3"],
  4: ["Self-correcting", "l4"],
};

const state = { query: "", level: "all", source: "all", category: "all", cohort: "all", version: "all", page: 1 };
const projects = await fetch("./data/projects.json").then((response) => response.json());
const versions = reportVersions(projects);
const rankings = new Map(versions.map((version) => [version, rankedReports(projects, version)]));
const ranked = versions.flatMap((version) => rankings.get(version));
const rankByVersion = new Map(versions.map((version) => [
  version,
  new Map(rankings.get(version).map((project, index) => [project.repo, index + 1])),
]));
const overallRank = new Map(ranked.map((project, index) => [project, index]));
state.version = versions[0] ?? "all";

document.querySelector("#total-count").textContent = repositoryCount(projects);
document.querySelector("#scored-count").textContent = ranked.length;

const versionCounts = document.querySelector("#version-counts");
for (const version of versions) {
  const item = document.createElement("div");
  const label = document.createElement("dt");
  label.textContent = `harness-score ${version}`;
  const count = document.createElement("dd");
  count.textContent = rankings.get(version).length.toLocaleString("en-US");
  item.append(label, count);
  versionCounts.append(item);
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);

function levelPill(project) {
  const [name, className] = levels[project.level];
  return `<span class="level ${className}"><i></i>L${project.level} ${name}</span>`;
}

const versionFilter = document.querySelector("#version");
for (const version of versions) {
  const option = document.createElement("option");
  option.value = version;
  option.textContent = `harness-score ${version}`;
  versionFilter.append(option);
}
versionFilter.value = state.version;

const categoryFilter = document.querySelector("#category");
for (const category of [...new Set(projects.map((project) => project.category))].sort()) {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category.replaceAll("-", " ");
  categoryFilter.append(option);
}

const cohortFilter = document.querySelector("#cohort");
const cohorts = [...new Set(projects.map((project) => project.selection?.cohort ?? "none"))].sort();
for (const cohort of cohorts) {
  const option = document.createElement("option");
  option.value = cohort;
  option.textContent = cohort === "none" ? "No selection cohort" : popularityLabel(cohort);
  cohortFilter.append(option);
}

function renderPodium() {
  const version = state.version === "all" ? versions[0] : state.version;
  document.querySelector("#podium-version").textContent = `Measured with harness-score ${version}`;
  document.querySelector("#podium").innerHTML = rankings.get(version).slice(0, 3).map((project, index) => {
    const [owner, name] = project.repo.split("/");
    const place = ["01", "02", "03"][index];
    const labels = ["Gold standard", "Outstanding", "Outstanding"];
    return `<article class="podium-card place-${index + 1}">
    <div class="podium-place"><span>${place}</span><small>${labels[index]}</small></div>
    <div class="podium-body">
      <span class="repo-owner">${escapeHtml(owner)} /</span>
      <h3><a href="https://github.com/${escapeHtml(project.repo)}">${escapeHtml(name)}</a></h3>
      ${levelPill(project)}
    </div>
    <div class="podium-score"><strong>${project.score}</strong><span>/ ${project.maxScore}</span></div>
    <a class="proof-link" href="${project.evidence}">Inspect report ↗</a>
  </article>`;
  }).join("");
}

const rows = document.querySelector("#rows");
const empty = document.querySelector("#empty");
const pageSummary = document.querySelector("#page-summary");
const pageNumber = document.querySelector("#page-number");
const previousPage = document.querySelector("#previous-page");
const nextPage = document.querySelector("#next-page");

function matchesCommonFilters(project) {
  return project.repo.toLowerCase().includes(state.query)
    && (state.source === "all" || project.source === state.source)
    && (state.category === "all" || project.category === state.category)
    && (state.cohort === "all" || (project.selection?.cohort ?? "none") === state.cohort);
}

function renderFilterCounts() {
  const countsByVersion = new Map(versions.map((version) => [version, 0]));
  const countsByLevel = new Map([["all", 0], ["0", 0], ["1", 0], ["2", 0], ["3", 0], ["4", 0]]);
  let allReports = 0;

  for (const project of projects) {
    if (!matchesCommonFilters(project)) continue;

    if (state.level === "all" || String(project.level) === state.level) {
      if (Number.isFinite(project.score)) {
        allReports += 1;
        countsByVersion.set(project.toolVersion, (countsByVersion.get(project.toolVersion) ?? 0) + 1);
      }
    }

    if (state.version === "all" || project.toolVersion === state.version) {
      if (project.level !== undefined) {
        countsByLevel.set("all", countsByLevel.get("all") + 1);
        const level = String(project.level);
        if (countsByLevel.has(level)) countsByLevel.set(level, countsByLevel.get(level) + 1);
      }
    }
  }

  for (const option of versionFilter.options) {
    if (option.value === "all") continue;
    option.textContent = `harness-score ${option.value} (${(countsByVersion.get(option.value) ?? 0).toLocaleString("en-US")})`;
  }
  versionFilter.options[0].textContent = `All scanner versions (${allReports.toLocaleString("en-US")})`;

  for (const button of document.querySelectorAll(".filter-group button")) {
    const count = countsByLevel.get(button.dataset.level) ?? 0;
    const label = button.dataset.level === "all" ? "All levels" : `L${button.dataset.level}`;
    button.textContent = `${label} (${count.toLocaleString("en-US")})`;
  }
}

function render(resetPage = false) {
  if (resetPage) state.page = 1;
  const filtered = filterProjects(projects, state)
    .sort((a, b) => {
      if (Number.isFinite(a.score) !== Number.isFinite(b.score)) return Number.isFinite(a.score) ? -1 : 1;
      if (Number.isFinite(a.score)) return (overallRank.get(a) ?? Number.MAX_SAFE_INTEGER)
        - (overallRank.get(b) ?? Number.MAX_SAFE_INTEGER);
      return a.repo.localeCompare(b.repo);
    });
  const page = paginate(filtered, state.page, PAGE_SIZE);
  state.page = page.page;

  rows.innerHTML = page.items.map((project) => {
    const numericRank = rankByVersion.get(project.toolVersion)?.get(project.repo) ?? -1;
    const score = Number.isFinite(project.score)
      ? `<strong>${project.score}</strong><span> / ${project.maxScore}</span>`
      : `<span class="not-ranked">badge only</span>`;
    const evidenceLabel = project.source === "study" ? "Full report" : "README badge";
    const provenance = project.selection
      ? `<small>${escapeHtml(popularityLabel(project.selection.cohort))}${project.selection.popularityRank ? ` #${escapeHtml(project.selection.popularityRank)}` : ""} · ${escapeHtml(Number(project.selection.githubStars).toLocaleString("en-US"))} stars on ${escapeHtml(project.selection.date)}${project.selection.archived ? " · archived snapshot" : ""}</small>`
      : "";
    return `<tr>
      <td class="rank">${numericRank >= 0 ? String(numericRank + 1).padStart(2, "0") : "—"}</td>
      <td><a class="repo" href="https://github.com/${escapeHtml(project.repo)}">${escapeHtml(project.repo)} <span>↗</span></a><small>${escapeHtml(project.category.replaceAll("-", " "))}${project.isStressCase ? " · stress case" : ""}</small>${provenance}</td>
      <td>${levelPill(project)}</td>
      <td class="score">${score}</td>
      <td>${project.toolVersion ? `<span>${escapeHtml(project.toolVersion)}</span><small>${escapeHtml(project.scannedAt?.slice(0, 10) ?? "")}</small>` : "Unversioned"}</td>
      <td><a class="evidence" href="${project.evidence}">${evidenceLabel} <span>↗</span></a></td>
    </tr>`;
  }).join("");
  empty.hidden = filtered.length > 0;
  pageSummary.textContent = `Showing ${page.start.toLocaleString("en-US")}-${page.end.toLocaleString("en-US")} of ${page.total.toLocaleString("en-US")} results`;
  pageNumber.textContent = `Page ${page.page.toLocaleString("en-US")} of ${page.pageCount.toLocaleString("en-US")}`;
  previousPage.disabled = page.page === 1;
  nextPage.disabled = page.page === page.pageCount;
  renderFilterCounts();
  renderPodium();
}

document.querySelector("#search").addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  render(true);
});
document.querySelector("#source").addEventListener("change", (event) => {
  state.source = event.target.value;
  if (state.source === "badge") {
    state.version = "all";
    versionFilter.value = "all";
  }
  render(true);
});
categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  render(true);
});
cohortFilter.addEventListener("change", (event) => {
  state.cohort = event.target.value;
  render(true);
});
versionFilter.addEventListener("change", (event) => {
  state.version = event.target.value;
  if (state.version !== "all" && state.source === "badge") {
    state.source = "all";
    document.querySelector("#source").value = "all";
  }
  render(true);
});
document.querySelector(".filter-group").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  document.querySelectorAll(".filter-group button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  state.level = button.dataset.level;
  render(true);
});

previousPage.addEventListener("click", () => {
  state.page -= 1;
  render();
});
nextPage.addEventListener("click", () => {
  state.page += 1;
  render();
});

render();
