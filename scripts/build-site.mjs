import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";

const escape = value => value.replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[ch]);
const { tools } = JSON.parse(await readFile("docs/contracts/toolchain.registry.json", "utf8"));
const template = await readFile("site/index.html", "utf8");
const cards = tools.map(tool => {
  const link = new URL(tool.repo_url || "https://github.com/markastra6/templates/blob/main/docs/CREATION-DIRECTORY.md");
  if (link.protocol !== "https:") throw new Error("Invalid registry link: " + tool.id);
  return `<li><a href="${escape(link.href)}">${escape(tool.name)}</a><p>${escape(tool.responsibility)}</p></li>`;
});
await mkdir("dist/site", { recursive: true });
await writeFile("dist/site/index.html", template.replace("<!-- registry entries -->", cards.join("\n")));
for (const file of ["directory.js", "style.css"]) await copyFile("site/" + file, "dist/site/" + file);
