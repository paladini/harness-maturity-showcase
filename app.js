const levels = {
  0: ["Unharnessed", "l0"],
  1: ["Documented", "l1"],
  2: ["Guarded", "l2"],
  3: ["Sensing", "l3"],
  4: ["Self-correcting", "l4"],
};

const state = { query: "", level: "all", source: "all" };
const projects = await fetch("./data/projects.json").then((response) => response.json());
const ranked = projects
  .filter((project) => Number.isFinite(project.score))
  .sort((a, b) => b.score / b.maxScore - a.score / a.maxScore);

document.querySelector("#total-count").textContent = projects.length;
document.querySelector("#scored-count").textContent = ranked.length;

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);

function levelPill(project) {
  const [name, className] = levels[project.level];
  return `<span class="level ${className}"><i></i>L${project.level} ${name}</span>`;
}

document.querySelector("#podium").innerHTML = ranked.slice(0, 3).map((project, index) => {
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

const rows = document.querySelector("#rows");
const empty = document.querySelector("#empty");

function render() {
  const filtered = projects
    .filter((project) => project.repo.toLowerCase().includes(state.query))
    .filter((project) => state.level === "all" || String(project.level) === state.level)
    .filter((project) => state.source === "all" || project.source === state.source)
    .sort((a, b) => {
      if (Number.isFinite(a.score) !== Number.isFinite(b.score)) return Number.isFinite(a.score) ? -1 : 1;
      if (Number.isFinite(a.score)) return ranked.indexOf(a) - ranked.indexOf(b);
      return a.repo.localeCompare(b.repo);
    });

  rows.innerHTML = filtered.map((project) => {
    const numericRank = ranked.findIndex((item) => item.repo === project.repo);
    const score = Number.isFinite(project.score)
      ? `<strong>${project.score}</strong><span> / ${project.maxScore}</span>`
      : `<span class="not-ranked">badge only</span>`;
    const evidenceLabel = project.source === "study" ? "Full report" : "README badge";
    return `<tr>
      <td class="rank">${numericRank >= 0 ? String(numericRank + 1).padStart(2, "0") : "—"}</td>
      <td><a class="repo" href="https://github.com/${escapeHtml(project.repo)}">${escapeHtml(project.repo)} <span>↗</span></a><small>${escapeHtml(project.category.replaceAll("-", " "))}</small></td>
      <td>${levelPill(project)}</td>
      <td class="score">${score}</td>
      <td><a class="evidence" href="${project.evidence}">${evidenceLabel} <span>↗</span></a></td>
    </tr>`;
  }).join("");
  empty.hidden = filtered.length > 0;
}

document.querySelector("#search").addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  render();
});
document.querySelector("#source").addEventListener("change", (event) => {
  state.source = event.target.value;
  render();
});
document.querySelector(".filter-group").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  document.querySelectorAll(".filter-group button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  state.level = button.dataset.level;
  render();
});

render();
