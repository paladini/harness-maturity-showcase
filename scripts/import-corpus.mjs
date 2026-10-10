import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const upstream = "paladini/harness-maturity-analysis";

export function corpusRunPaths(manifest) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.runDate ?? "") ||
      !/^harness-score@\d+\.\d+\.\d+$/.test(manifest.toolVersion ?? "") ||
      (manifest.runId !== undefined && (typeof manifest.runId !== "string" ||
        manifest.runId.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.runId)))) {
    throw new Error("Invalid corpus run identity");
  }
  const suffix = manifest.runId ? `-${manifest.runId}` : "";
  return {
    directory: `data/runs/${manifest.runDate}${suffix}-corpus/`,
    history: `corpus/history/${manifest.runDate}-${manifest.toolVersion.replace("@", "-")}${suffix}.json`,
  };
}

export function corpusListing(entry, report, history, sourceCommit, runDate, selection) {
  const complete = report.verdicts?.maturity?.status === "complete" ||
    (!report.verdicts && Array.isArray(report.checks));
  if (report.tool.version !== history.toolVersion.replace("harness-score@", "") ||
      report.truncated || !complete ||
      !/^[a-f0-9]{40}$/.test(entry.commit) || history.repoUrl !== entry.repoUrl ||
      history.commit !== entry.commit || history.status !== "scored" ||
      report.level.index !== history.level.index ||
      JSON.stringify(report.score) !== JSON.stringify(history.score)) {
    throw new Error(`Report/history mismatch: ${entry.name}`);
  }
  return {
    repo: entry.repoUrl.replace("https://github.com/", "").replace(/\.git$/, ""),
    category: entry.category,
    level: report.level.index,
    score: report.score.earned,
    maxScore: report.score.max,
    source: "study",
    commit: entry.commit,
    evidence: `https://github.com/${upstream}/blob/${sourceCommit}/corpus/reports/${entry.name}.json`,
    toolVersion: report.tool.version,
    scannedAt: runDate,
    corpusName: entry.name,
    corpusSourceCommit: sourceCommit,
    isStressCase: entry.isStressCase,
    ...(entry.selection ? { selection: entry.selection } : {}),
    ...(selection ? { selection } : {}),
  };
}

export function selectionProvenance(candidate, cohort, date) {
  if (!candidate || typeof cohort !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") ||
      !Number.isInteger(candidate.githubRepositoryId) || !Number.isInteger(candidate.githubStars) ||
      typeof candidate.archived !== "boolean") {
    throw new Error("Invalid popularity selection candidate");
  }
  return {
    cohort,
    date,
    githubRepositoryId: candidate.githubRepositoryId,
    githubStars: candidate.githubStars,
    ...(Number.isInteger(candidate.popularityRank) ? { popularityRank: candidate.popularityRank } : {}),
    archived: candidate.archived,
  };
}

export function mergeCorpusListings(projects, listings) {
  const oldCorpus = (entry) => entry.corpusSourceCommit ||
    entry.evidence.startsWith(`https://github.com/${upstream}/blob/`);
  const byVersion = new Map();
  for (const entry of projects) {
    const repo = entry.repo.toLowerCase();
    if (oldCorpus(entry)) byVersion.set(`${repo}@${entry.toolVersion}`, entry);
    else byVersion.set(repo, entry);
  }
  for (const listing of listings) {
    const repo = listing.repo.toLowerCase();
    byVersion.delete(repo);
    byVersion.set(`${repo}@${listing.toolVersion}`, listing);
  }
  return [...byVersion.values()];
}

const isMain = path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] ?? "");
if (isMain) {
  const args = process.argv.slice(2);
  const sourceCommit = args[args.indexOf("--commit") + 1];
  if (!args.includes("--commit") || !/^[a-f0-9]{40}$/.test(sourceCommit ?? "")) {
    throw new Error("Usage: node scripts/import-corpus.mjs --commit <full analysis commit SHA> [--selection-ledger <path>] [--evidence-file <path> ...]");
  }
  const selectionPath = args.includes("--selection-ledger") ? args[args.indexOf("--selection-ledger") + 1] : undefined;
  const evidencePaths = args.flatMap((arg, index) => arg === "--evidence-file" ? [args[index + 1]] : []);
  if ((args.includes("--selection-ledger") && (!selectionPath || selectionPath.startsWith("--"))) ||
      evidencePaths.some((file) => !file || file.startsWith("--")) ||
      new Set(evidencePaths.map((file) => path.basename(file))).size !== evidencePaths.length) {
    throw new Error("Invalid selection-ledger or evidence-file arguments");
  }
  const fetchBytes = async (file) => {
    const response = await fetch(`https://raw.githubusercontent.com/${upstream}/${sourceCommit}/${file}`);
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  };
  const manifestBytes = await fetchBytes("corpus/manifest.json");
  const source = JSON.parse(manifestBytes);
  const runPaths = corpusRunPaths(source);
  const run = new URL(runPaths.directory, root);
  if (existsSync(run)) throw new Error("Refusing to overwrite an existing corpus snapshot");
  const historyBytes = await fetchBytes(runPaths.history);
  const history = JSON.parse(historyBytes);
  if (history.date !== source.runDate || history.toolVersion !== source.toolVersion ||
      history.runId !== source.runId ||
      history.entries.length !== source.entries.length) throw new Error("Incomplete corpus history");
  const selectionBytes = selectionPath ? await fetchBytes(selectionPath) : undefined;
  const selection = selectionBytes ? JSON.parse(selectionBytes) : undefined;
  const selectionByName = new Map();
  if (selection) {
    if (selection.achievedCount !== selection.targetCount || !Array.isArray(selection.candidates) ||
        selection.candidates.length !== selection.targetCount || !source.runId) {
      throw new Error("Incomplete selection ledger");
    }
    const sourceByName = new Map(source.entries.map((entry) => [entry.name, entry]));
    for (const candidate of selection.candidates) {
      const entry = sourceByName.get(candidate.name);
      if (!entry || entry.commit !== candidate.commit || entry.category !== candidate.category ||
          !entry.repoUrl.toLowerCase().includes(candidate.canonicalSlug.toLowerCase())) {
        throw new Error(`Selection/source mismatch: ${candidate.name}`);
      }
      if (selectionByName.has(candidate.name)) throw new Error(`Duplicate selection candidate: ${candidate.name}`);
      selectionByName.set(candidate.name, selectionProvenance(candidate, source.runId, selection.selectionDate));
    }
  }
  const evidence = await Promise.all(evidencePaths.map(async (file) => ({
    file: path.basename(file), bytes: await fetchBytes(file),
  })));
  const listings = [];
  const reports = [];
  // Fetch and validate the full immutable source before writing the index.
  for (let offset = 0; offset < source.entries.length; offset += 12) {
    const batch = await Promise.all(source.entries.slice(offset, offset + 12).map(async (entry) => {
      if (!/^[a-z0-9-]+$/.test(entry.name)) throw new Error("Invalid corpus file name");
      const bytes = await fetchBytes(`corpus/reports/${entry.name}.json`);
      const report = JSON.parse(bytes);
      const result = history.entries.find((item) => item.name === entry.name);
      if (!result) throw new Error(`Missing history: ${entry.name}`);
      const listing = corpusListing(entry, report, { ...result, toolVersion: history.toolVersion }, sourceCommit, source.runDate,
        selectionByName.get(entry.name) ?? entry.selection);
      return { listing, report: { name: entry.name, bytes, sha256: createHash("sha256").update(bytes).digest("hex") } };
    }));
    for (const item of batch) {
      listings.push(item.listing);
      reports.push(item.report);
    }
  }
  if (new Set(listings.map((item) => `${item.repo.toLowerCase()}@${item.toolVersion}`)).size !== listings.length) {
    throw new Error("Duplicate upstream repository and scanner-version identities");
  }
  const projects = JSON.parse(await readFile(new URL("data/projects.json", root)));
  const merged = mergeCorpusListings(projects, listings);
  // Run directories are immutable; mkdir rejects an existing snapshot.
  await mkdir(run);
  await writeFile(new URL("source-manifest.json", run), manifestBytes, { flag: "wx" });
  await writeFile(new URL("source-history.json", run), historyBytes, { flag: "wx" });
  if (selectionBytes) await writeFile(new URL("selection.json", run), selectionBytes, { flag: "wx" });
  for (const item of evidence) await writeFile(new URL(item.file, run), item.bytes, { flag: "wx" });
  for (const report of reports) await writeFile(new URL(`${report.name}.json`, run), report.bytes, { flag: "wx" });
  const snapshot = {
    sourceRepository: upstream, sourceCommit, runDate: source.runDate,
    ...(source.runId ? { runId: source.runId } : {}),
    toolVersion: source.toolVersion, previousListings: projects,
    ...(selectionPath ? { selectionLedger: {
      file: path.basename(selectionPath),
      sha256: createHash("sha256").update(selectionBytes).digest("hex"),
    } } : {}),
    evidenceFiles: evidence.map((item) => ({
      file: item.file, sha256: createHash("sha256").update(item.bytes).digest("hex"),
    })),
    entries: listings.map((listing, index) => ({ ...listing, report: `${listing.corpusName}.json`, sha256: reports[index].sha256 })),
  };
  await writeFile(new URL("manifest.json", run), `${JSON.stringify(snapshot, null, 2)}\n`, { flag: "wx" });
  await writeFile(new URL("data/projects.json", root), `[\n${merged.map((entry) => `  ${JSON.stringify(entry)}`).join(",\n")}\n]\n`);
  console.log(`Imported ${listings.length} pinned corpus reports; index now has ${merged.length} repository-version records.`);
}
