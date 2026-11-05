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
if (src.sources.length !== 31 || new Set(src.sources.map(s => s.id)).size !== 31) {
  throw new Error("Expected 31 unique sources");
}
const indexed = src.sources.filter(s => ["registry", "tree"].includes(s.collection));
const lists = await Promise.all(indexed.map(async s => {
  const doc = JSON.parse(await readFile(`docs/references/ui-index/${s.id}.json`, "utf8"));
  if (doc.source !== s.id || doc.count !== doc.entries.length) throw new Error("Invalid source index " + s.id);
  return doc.entries.map(entry => ({ ...entry, source: s.id }));
}));
const components = lists.flat();
const ids = new Set();
const counts = new Map();
for (const c of components) {
  if (ids.has(c.id)) throw new Error("Duplicate component ID: " + c.id);
  ids.add(c.id);
  safeUrl(c.url);
  if (!Array.isArray(c.tags) || !Array.isArray(c.dependencies)) throw new Error("Invalid metadata: " + c.id);
  counts.set(c.source, (counts.get(c.source) || 0) + 1);
}
const sourceCards = src.sources.map(s => {
  const count = counts.get(s.id) || 0;
  const coverage = count ? count.toLocaleString("en-US") + " indexed" :
    s.collection === "restricted" ? "Link only" : "Discovery";
  return `<li class="resource" data-source="${escape(s.id)}" data-text="${escape([s.name,s.focus,s.group].join(" ").toLowerCase())}"><h3><a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.name)}</a></h3><p>${escape(s.focus)}</p><p class="meta">${escape(s.group)} · ${escape(coverage)}</p><p class="fine">${escape(s.notice)}</p></li>`;
}).join("\n");
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Browse 31 UI design sources and searchable public component references.">
<title>UI source explorer</title><link rel="stylesheet" href="./style.css">
<script type="module" src="./ui-explorer.js"></script></head>
<body><main class="explorer"><a href="./index.html">← Creation directory</a>
<header><h1>UI source explorer</h1><p>31 design sources · ${components.length.toLocaleString("en-US")} public component references. The index contains links and metadata, not copied third-party code or images.</p></header>
<div class="toolbar"><label for="ui-query">Search sources and components</label>
<input id="ui-query" type="search" placeholder="dashboard, dialog, animation…" autocomplete="off">
<label for="ui-source">Library</label><select id="ui-source"><option value="">All libraries</option>${src.sources.map(s => `<option value="${escape(s.id)}">${escape(s.name)}</option>`).join("")}</select></div>
<p id="ui-status" role="status" aria-live="polite">Loading component references…</p>
<section aria-labelledby="source-heading"><h2 id="source-heading">Sources</h2><ul id="ui-sources" class="explorer-grid">${sourceCards}</ul></section>
<section aria-labelledby="component-heading"><h2 id="component-heading">Component references</h2><p>Search metadata by name, category, library and dependencies; follow upstream source links for licensing and implementation details.</p>
<noscript>JavaScript is required for local component searching; the 31 source links above remain available.</noscript>
<ul id="ui-components" class="explorer-grid" aria-busy="true"></ul>
<button type="button" id="show-more" hidden>Show more results</button></section>
<footer><p class="fine">Index snapshot: ${escape(src.updated)}. Restricted and paid content is not collected.</p></footer></main></body></html>`;

await mkdir("dist/site", { recursive: true });
await writeFile("dist/site/index.html", template.replace("<!-- registry entries -->", cards.join("\n")));
await writeFile("dist/site/ui-explorer.html", html);
await writeFile("dist/site/ui-index.json", JSON.stringify({
  schema_version: "1.0.0",
  generated_from: src.updated,
  count: components.length,
  entries: components
}) + "\n");
for (const file of ["directory.js", "style.css", "ui-explorer.js"]) {
  await copyFile("site/" + file, "dist/site/" + file);
}
