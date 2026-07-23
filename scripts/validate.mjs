import { readFile } from "node:fs/promises";

const projects = JSON.parse(await readFile(new URL("../data/projects.json", import.meta.url)));
const seen = new Set();
const errors = [];

for (const [index, project] of projects.entries()) {
  const label = `Entry ${index + 1}`;
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(project.repo ?? "")) {
    errors.push(`${label}: repo must use owner/name format`);
  }
  if (seen.has(project.repo?.toLowerCase())) errors.push(`${label}: duplicate repo ${project.repo}`);
  seen.add(project.repo?.toLowerCase());
  if (!Number.isInteger(project.level) || project.level < 0 || project.level > 4) {
    errors.push(`${label}: level must be an integer from 0 through 4`);
  }
  if (!["study", "badge"].includes(project.source)) {
    errors.push(`${label}: source must be study or badge`);
  }
  if (!project.evidence?.startsWith("https://github.com/")) {
    errors.push(`${label}: evidence must be a GitHub URL`);
  }
  if (project.source === "study") {
    if (!Number.isFinite(project.score) || !Number.isFinite(project.maxScore)) {
      errors.push(`${label}: study entries require score and maxScore`);
    } else if (project.score < 0 || project.score > project.maxScore) {
      errors.push(`${label}: score must be between zero and maxScore`);
    }
    if (!/^[a-f0-9]{40}$/.test(project.commit ?? "")) {
      errors.push(`${label}: study entries require a 40-character commit SHA`);
    }
  } else if ("score" in project || "maxScore" in project) {
    errors.push(`${label}: badge entries cannot claim a numeric score`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${projects.length} unique repository records.`);
