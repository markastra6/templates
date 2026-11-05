const query = document.getElementById("ui-query");
const source = document.getElementById("ui-source");
const status = document.getElementById("ui-status");
const sources = Array.from(document.querySelectorAll("#ui-sources > li"));
const components = Array.from(document.querySelectorAll("#ui-components > li"));
const more = document.getElementById("show-more");
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
  status.textContent = `${sourceMatches.length} sources · ${componentMatches.length} component references`;
}
query.addEventListener("input", () => { limit = 72; refresh(); });
source.addEventListener("change", () => { limit = 72; refresh(); });
more.addEventListener("click", () => { limit += 72; refresh(); });
refresh();
