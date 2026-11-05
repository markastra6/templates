export {};
const query = /** @type {HTMLInputElement} */ (document.getElementById("ui-query"));
const source = /** @type {HTMLSelectElement} */ (document.getElementById("ui-source"));
const status = /** @type {HTMLElement} */ (document.getElementById("ui-status"));
const sources = Array.from(document.querySelectorAll("#ui-sources > li")).map(el => /** @type {HTMLLIElement} */ (el));
const components = Array.from(document.querySelectorAll("#ui-components > li")).map(el => /** @type {HTMLLIElement} */ (el));
const more = /** @type {HTMLButtonElement} */ (document.getElementById("show-more"));
let limit = 72;
function refresh() {
  const words = query.value.toLocaleLowerCase().trim().split(/\s+/u).filter(Boolean);
  const selected = source.value;
  const matches = el => (!selected || el.dataset.source === selected) &&
    words.every(word => (el.dataset.text || "").includes(word));
  const sourceMatches = sources.filter(matches);
  const componentMatches = components.filter(matches);
  sources.forEach(el => { el.hidden = !sourceMatches.includes(el); });
  components.forEach(el => { el.hidden = !componentMatches.includes(el) || componentMatches.indexOf(el) >= limit; });
  more.hidden = componentMatches.length <= limit;
  status.textContent = `${sourceMatches.length} sources · ${componentMatches.length.toLocaleString("en-US")} component references`;
}
query.addEventListener("input", () => { limit = 72; refresh(); });
source.addEventListener("change", () => { limit = 72; refresh(); });
more.addEventListener("click", () => { limit += 72; refresh(); });
refresh();
