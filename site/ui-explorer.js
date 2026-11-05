export {};

const query = /** @type {HTMLInputElement} */ (document.getElementById("ui-query"));
const source = /** @type {HTMLSelectElement} */ (document.getElementById("ui-source"));
const status = /** @type {HTMLElement} */ (document.getElementById("ui-status"));
const list = /** @type {HTMLUListElement} */ (document.getElementById("ui-components"));
const more = /** @type {HTMLButtonElement} */ (document.getElementById("show-more"));
const sources = Array.from(document.querySelectorAll("#ui-sources > li")).map(
  el => /** @type {HTMLLIElement} */ (el)
);
const sourceNames = new Map(Array.from(source.options).map(option => [
  option.value, option.textContent || option.value
]));
/** @type {Array<{id:string,name:string,slug:string,kind:string,source:string,url:string,tags:string[],dependencies:string[],search:string}>} */
let components = [];
let limit = 72;

function card(item) {
  const li = document.createElement("li");
  li.className = "resource component";
  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = item.name;
  heading.append(link);
  li.append(heading);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${sourceNames.get(item.source) || item.source} · ${item.kind}`;
  li.append(meta);

  if (item.tags.length) {
    const tags = document.createElement("p");
    tags.className = "fine";
    tags.textContent = item.tags.slice(0, 5).join(", ");
    li.append(tags);
  }
  if (item.dependencies.length) {
    const deps = document.createElement("p");
    deps.className = "fine";
    deps.textContent = "Dependencies: " + item.dependencies.slice(0, 5).join(", ");
    li.append(deps);
  }
  return li;
}

function refresh() {
  const words = query.value.toLocaleLowerCase().trim().split(/\s+/u).filter(Boolean);
  const selected = source.value;
  const matches = search => words.every(word => search.includes(word));
  let sourceCount = 0;
  for (const el of sources) {
    const show = (!selected || selected === el.dataset.source) && matches(el.dataset.text || "");
    el.hidden = !show;
    if (show) sourceCount++;
  }
  const matching = components.filter(item => (!selected || selected === item.source) && matches(item.search));
  const fragment = document.createDocumentFragment();
  for (const item of matching.slice(0, limit)) fragment.append(card(item));
  list.replaceChildren(fragment);
  more.hidden = matching.length <= limit;
  status.textContent = `${sourceCount} sources · ${matching.length.toLocaleString("en-US")} component references`;
}

query.addEventListener("input", () => { limit = 72; refresh(); });
source.addEventListener("change", () => { limit = 72; refresh(); });
more.addEventListener("click", () => { limit += 72; refresh(); });

async function load() {
  try {
    const response = await fetch("./ui-index.json", { cache: "force-cache" });
    if (!response.ok) throw new Error("Cannot read UI index");
    const index = await response.json();
    if (!Array.isArray(index.entries) || index.count !== index.entries.length) throw new Error("Invalid UI index");
    components = index.entries.map(item => {
      const url = new URL(item.url);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid component URL");
      if (!Array.isArray(item.tags) || !Array.isArray(item.dependencies)) throw new Error("Invalid component metadata");
      return {
        ...item,
        search: [item.name, item.slug, sourceNames.get(item.source), ...item.tags, ...item.dependencies]
          .filter(Boolean).join(" ").toLocaleLowerCase()
      };
    });
    list.setAttribute("aria-busy", "false");
    refresh();
  } catch {
    list.setAttribute("aria-busy", "false");
    more.hidden = true;
    status.textContent = "Component index unavailable. The source links above remain accessible.";
  }
}

void load();
