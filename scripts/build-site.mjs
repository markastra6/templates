import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";

const escape = value => String(value).replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[ch]);
const safeUrl = value => {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid source URL");
  return escape(url.href);
};
const { tools } = JSON.parse(await readFile("docs/contracts/toolchain.registry.json", "utf8"));
const template = await readFile("site/index.html", "utf8");
const cards = tools.map(tool => {
  const link = tool.repo_url || "https://github.com/markastra6/templates/blob/main/docs/CREATION-DIRECTORY.md";
  return `<li><a href="${safeUrl(link)}">${escape(tool.name)}</a><p>${escape(tool.responsibility)}</p></li>`;
});
const src = JSON.parse(await readFile("docs/references/ui-component-sources.json", "utf8"));
if (src.sources.length !== 31 || new Set(src.sources.map(s => s.id)).size !== 31) throw new Error("Expected 31 unique sources");
const manifestIds = src.sources.filter(s => ["registry", "tree"].includes(s.collection)).map(s => s.id);
const lists = await Promise.all(manifestIds.map(async id => {
  const doc = JSON.parse(await readFile(`docs/references/ui-index/${id}.json`, "utf8"));
  if (doc.source !== id || doc.count !== doc.entries.length) throw new Error("Invalid source index " + id);
  return doc.entries.map(x => ({ ...x, source: id }));
}));
const components = lists.flat();
if (new Set(components.map(c => c.id)).size !== components.length) throw new Error("Duplicate component IDs");
const sourceCards = src.sources.map(s => {
  const count = components.filter(c => c.source === s.id).length;
  const coverage = count ? count.toLocaleString("en-US") + " indexed" : s.collection === "restricted" ? "Link only" : "Discovery";
  return `<li class="resource" data-source="${escape(s.id)}" data-text="${escape([s.name,s.focus,s.group].join(" ").toLowerCase())}"><h3><a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.name)}</a></h3><p>${escape(s.focus)}</p><p class="meta">${escape(s.group)} · ${escape(coverage)}</p><p class="fine">${escape(s.notice)}</p></li>`;
}).join("\n");
const componentCards = components.map(c => {
  const sourceName = src.sources.find(s => s.id === c.source).name;
  const tags = c.tags.slice(0,5).join(", ");
  const deps = c.dependencies.slice(0,5).join(", ");
  return `<li class="resource component" data-source="${escape(c.source)}" data-text="${escape([c.name,c.slug,sourceName,tags,deps].join(" ").toLowerCase())}"><h3><a href="${safeUrl(c.url)}" target="_blank" rel="noopener noreferrer">${escape(c.name)}</a></h3><p class="meta">${escape(sourceName)} · ${escape(c.kind)}</p>${tags ? `<p class="fine">${escape(tags)}</p>` : ""}${deps ? `<p class="fine">Dependencies: ${escape(deps)}</p>` : ""}</li>`;
}).join("\n");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Explore UI design sources and public component metadata."><title>UI source explorer</title><link rel="stylesheet" href="./style.css"><script type="module" src="./ui-explorer.js"></script></head><body><main class="explorer"><a href="./index.html">← Creation directory</a><header><h1>UI source explorer</h1><p>31 design sources · ${components.length.toLocaleString("en-US")} public component references. No third-party source code or images are republished.</p></header><div class="toolbar"><label for="ui-query">Search sources and components</label><input id="ui-query" type="search" placeholder="dashboard, dialog, animation…" autocomplete="off"><label for="ui-source">Library</label><select id="ui-source"><option value="">All libraries</option>${src.sources.map(s => `<option value="${escape(s.id)}">${escape(s.name)}</option>`).join("")}</select></div><p id="ui-status" role="status" aria-live="polite"></p><section aria-labelledby="source-heading"><h2 id="source-heading">Sources</h2><ul id="ui-sources" class="explorer-grid">${sourceCards}</ul></section><section aria-labelledby="component-heading"><h2 id="component-heading">Component references</h2><p>Browse names, variants and dependencies. Follow each upstream link and check item licensing before use.</p><ul id="ui-components" class="explorer-grid">${componentCards}</ul><button type="button" id="show-more" hidden>Show more results</button></section><footer><p class="fine">Snapshot: ${escape(src.updated)}. Premium assets, gated pages, and restricted community submissions are not collected.</p></footer></main></body></html>`;
await mkdir("dist/site", { recursive: true });
await writeFile("dist/site/index.html", template.replace("<!-- registry entries -->", cards.join("\n")));
await writeFile("dist/site/ui-explorer.html", html);
for (const file of ["directory.js", "style.css", "ui-explorer.js"]) await copyFile("site/" + file, "dist/site/" + file);
