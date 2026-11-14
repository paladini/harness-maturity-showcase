// Historical import assertions use the catalog as it stood through 1.8.4.
// New scanner versions are verified separately without changing those counts.
export function through184(projects) {
  return projects.filter((project) => !project.toolVersion ||
    project.toolVersion.localeCompare("1.8.4", "en", { numeric: true }) <= 0);
}
