import { searchComponents, parseFavorites } from "./ui-tools.js";

const el = id => document.getElementById(id);
const query = /** @type {HTMLInputElement} */ (el("ui-query"));
const source = /** @type {HTMLSelectElement} */ (el("ui-source"));
const kind = /** @type {HTMLSelectElement} */ (el("ui-kind"));
const category = /** @type {HTMLSelectElement} */ (el("ui-group"));
const order = /** @type {HTMLSelectElement} */ (el("ui-sort"));
const withDeps = /** @type {HTMLInputElement} */ (el("ui-has-dependencies"));
const group = /** @type {HTMLInputElement} */ (el("ui-group-variants"));
const onlySaved = /** @type {HTMLInputElement} */ (el("ui-favorites-only"));
const status = /** @type {HTMLElement} */ (el("ui-status"));
const notice = /** @type {HTMLElement} */ (el("ui-workspace-notice"));
const list = /** @type {HTMLUListElement} */ (el("ui-components"));
const more = /** @type {HTMLButtonElement} */ (el("show-more"));
const exportButton = /** @type {HTMLButtonElement} */ (el("ui-export"));
const importInput = /** @type {HTMLInputElement} */ (el("ui-import"));
const comparePanel = /** @type {HTMLElement} */ (el("ui-compare"));
const compareItems = /** @type {HTMLElement} */ (el("ui-compare-items"));
const clearCompare = /** @type {HTMLButtonElement} */ (el("ui-clear-compare"));
const sources = Array.from(document.querySelectorAll("#ui-sources > li")).map(e => /** @type {HTMLLIElement} */ (e));
const sourceNames = new Map(Array.from(source.options).map(o => [o.value, o.textContent || o.value]));
const sourceGroups = Object.fromEntries(sources.map(node => [node.dataset.source, node.dataset.group || ""]));
const storageKey = "ui-workbench-saved-v1";
let components = [], limit = 72;
let favorites = new Set(), selected = new Set(), byID = new Map();

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, favorites: [...favorites] }));
    notice.textContent = "Saved in this browser only. Export to keep a portable backup.";
  } catch { notice.textContent = "Browser storage unavailable. Export to keep your saved list."; }
}
function focusAction(id, action) {
  for (const node of list.querySelectorAll("button[data-action]")) {
    if (node.getAttribute("data-id") === id && node.getAttribute("data-action") === action) {
      /** @type {HTMLButtonElement} */ (node).focus(); break;
    }
  }
}
function action(parent, item, type) {
  const active = (type === "favorite" ? favorites : selected).has(item.id);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ui-action";
  button.dataset.action = type;
  button.dataset.id = item.id;
  button.textContent = type === "favorite" ? (active ? "Saved" : "Save") : (active ? "Comparing" : "Compare");
  button.setAttribute("aria-label", button.textContent + " " + item.name);
  button.setAttribute("aria-pressed", String(active));
  button.disabled = type === "compare" && selected.size >= 3 && !active;
  button.addEventListener("click", () => {
    if (type === "favorite") {
      if (active) favorites.delete(item.id);
      else if (favorites.size < 200) favorites.add(item.id);
      else { notice.textContent = "Save limit is 200 references."; return; }
      persist();
    } else if (active) selected.delete(item.id);
    else if (selected.size < 3) selected.add(item.id);
    refresh();
    focusAction(item.id, type);
  });
  parent.append(button);
}
function card(item) {
  const li = document.createElement("li");
  li.className = "resource component";
  const title = document.createElement("h3"), link = document.createElement("a");
  link.href = item.url; link.target = "_blank"; link.rel = "noopener noreferrer";
  link.textContent = item.name; title.append(link); li.append(title);
  const meta = document.createElement("p");
  meta.className = "meta"; meta.textContent = (sourceNames.get(item.source) || item.source) + " · " + item.kind;
  li.append(meta);
  if (item.tags.length) {
    const tags = document.createElement("p"); tags.className = "fine";
    tags.textContent = item.tags.slice(0, 5).join(", "); li.append(tags);
  }
  if (item.dependencies.length) {
    const deps = document.createElement("p"); deps.className = "fine";
    deps.textContent = "Dependencies: " + item.dependencies.slice(0, 5).join(", "); li.append(deps);
  }
  const actions = document.createElement("div"); actions.className = "component-actions";
  action(actions, item, "favorite"); action(actions, item, "compare"); li.append(actions);
  return li;
}
function renderComparison() {
  comparePanel.hidden = selected.size === 0;
  const frag = document.createDocumentFragment();
  for (const id of selected) {
    const item = byID.get(id); if (!item) continue;
    const article = document.createElement("article"); article.className = "comparison-item";
    const heading = document.createElement("h3"), link = document.createElement("a");
    link.href = item.url; link.textContent = item.name; link.target = "_blank"; link.rel = "noopener noreferrer";
    heading.append(link); article.append(heading);
    for (const [label, value] of [
      ["Library", sourceNames.get(item.source) || item.source],
      ["Type", item.kind], ["Tags", item.tags.join(", ") || "Not supplied"],
      ["Dependencies", item.dependencies.join(", ") || "Not supplied"]
    ]) {
      const p = document.createElement("p"), strong = document.createElement("strong");
      strong.textContent = label + ": "; p.append(strong, document.createTextNode(value)); article.append(p);
    }
    frag.append(article);
  }
  compareItems.replaceChildren(frag);
}
function refresh() {
  const words = query.value.toLocaleLowerCase().trim().split(/\s+/u).filter(Boolean);
  const filtered = searchComponents(components, {
    query: query.value, source: source.value, kind: kind.value,
    group: category.value, sourceGroups, hasDependencies: withDeps.checked, sort: order.value,
    groupVariants: group.checked, favoritesOnly: onlySaved.checked, favoriteIDs: favorites
  });
  const matchingSourceIDs = new Set(filtered.map(item => item.source));
  const componentFacetActive = Boolean(kind.value || withDeps.checked || onlySaved.checked);
  let sourceCount = 0;
  for (const node of sources) {
    const sourceMatches = (!source.value || source.value === node.dataset.source) &&
      (!category.value || category.value === node.dataset.group);
    const textMatches = words.every(word => (node.dataset.text || "").includes(word));
    const componentMatches = matchingSourceIDs.has(node.dataset.source);
    // A component search should also reveal its publisher, even if the search
    // phrase is absent from the publisher description.
    const visible = sourceMatches && (componentFacetActive ? componentMatches :
      words.length === 0 || textMatches || componentMatches);
    node.hidden = !visible;
    if (visible) sourceCount++;
  }
  const frag = document.createDocumentFragment();
  for (const item of filtered.slice(0, limit)) frag.append(card(item));
  list.replaceChildren(frag);
  more.hidden = filtered.length <= limit;
  exportButton.disabled = favorites.size === 0;
  status.textContent = `${sourceCount} sources · ${filtered.length.toLocaleString("en-US")} component references · ${favorites.size} saved · ${selected.size} comparing`;
  renderComparison();
}
for (const control of [query, source, kind, category, order, withDeps, group, onlySaved]) {
  control.addEventListener(control.type === "checkbox" || control.tagName === "SELECT" ? "change" : "input", () => {
    limit = 72; refresh();
  });
}
more.addEventListener("click", () => { limit += 72; refresh(); });
clearCompare.addEventListener("click", () => { selected.clear(); refresh(); });

exportButton.addEventListener("click", () => {
  const data = JSON.stringify({ version: 1, favorites: [...favorites] }, null, 2);
  const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = "ui-workbench-saved.json";
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
importInput.addEventListener("change", async () => {
  const file = importInput.files?.[0]; if (!file) return;
  try {
    if (file.size > 65536) throw new Error("File too large");
    const valid = parseFavorites(JSON.parse(await file.text()), new Set(byID.keys()), 200);
    favorites = valid; persist(); refresh();
    notice.textContent = `Imported ${favorites.size} valid references. Previous saved list replaced.`;
  } catch {
    notice.textContent = "Import failed: use an exported JSON saved list under 64 KB. Existing list is unchanged.";
  } finally { importInput.value = ""; }
});
async function load() {
  try {
    const response = await fetch("./ui-index.json", { cache: "force-cache" });
    if (!response.ok) throw new Error("Fetch failed");
    const data = await response.json();
    if (!Array.isArray(data.entries) || data.count !== data.entries.length) throw new Error("Bad index");
    const ids = new Set();
    components = data.entries.map(item => {
      const url = new URL(item.url);
      if (url.protocol !== "https:" || url.username || url.password || ids.has(item.id) ||
          !Array.isArray(item.tags) || !Array.isArray(item.dependencies)) throw new Error("Bad item");
      ids.add(item.id);
      return { ...item, search: [item.name, item.slug, sourceNames.get(item.source), item.kind,
        ...item.tags, ...item.dependencies].filter(Boolean).join(" ").toLocaleLowerCase() };
    });
    byID = new Map(components.map(item => [item.id, item]));
    for (const type of [...new Set(components.map(item => item.kind))].sort()) {
      const option = document.createElement("option");
      option.value = type; option.textContent = type.replace(/-/g, " "); kind.append(option);
    }
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) favorites = parseFavorites(JSON.parse(stored), new Set(byID.keys()), 200);
    } catch { notice.textContent = "Browser saved list could not be restored."; }
    list.setAttribute("aria-busy", "false"); refresh();
  } catch {
    list.setAttribute("aria-busy", "false");
    status.textContent = "Component index unavailable. The source links above remain accessible.";
  }
}
void load();
