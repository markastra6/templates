/** Lightweight, dependency-free catalogue logic. No third-party code is executed. */
export function variantFamily(item) {
  const slug = String(item.slug || "");
  if (item.source === "react-bits") {
    return `${item.source}:${slug.replace(/-(?:JS|TS)-(?:CSS|TW)$/i, "").toLowerCase()}`;
  }
  if (item.source === "hyperui") {
    return `${item.source}:${slug.replace(/-dark\.html$/i, ".html").toLowerCase()}`;
  }
  return item.id;
}

/** @param {Array<any>} items
 * @param {{query?:string,source?:string,kind?:string,group?:string,sourceGroups?:Record<string,string>,hasDependencies?:boolean,sort?:string,favoritesOnly?:boolean,favoriteIDs?:Set<string>,groupVariants?:boolean}} [options]
 */
export function searchComponents(items, options = {}) {
  const words = String(options.query || "").trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  const favoriteIDs = options.favoriteIDs || new Set();
  const seen = new Set();
  const filtered = items.filter(item => {
    if (options.source && item.source !== options.source) return false;
    if (options.kind && item.kind !== options.kind) return false;
    if (options.group && options.sourceGroups?.[item.source] !== options.group) return false;
    if (options.hasDependencies && (!Array.isArray(item.dependencies) || item.dependencies.length === 0)) return false;
    if (options.favoritesOnly && !favoriteIDs.has(item.id)) return false;
    if (!words.every(word => item.search.includes(word))) return false;
    if (options.groupVariants) {
      const family = variantFamily(item);
      if (seen.has(family)) return false;
      seen.add(family);
    }
    return true;
  });
  if (options.sort === "name") return filtered.sort((a,b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  if (options.sort === "source") return filtered.sort((a,b) => a.source.localeCompare(b.source) || a.name.localeCompare(b.name));
  if (options.sort === "relevance" && words.length) {
    const term = words.join(" ");
    const score = item => {
      const name = String(item.name || "").toLocaleLowerCase();
      const slug = String(item.slug || "").toLocaleLowerCase();
      return (name === term ? 100 : 0) + (name.startsWith(term) ? 40 : 0) +
        (name.includes(term) ? 20 : 0) + (slug.includes(term) ? 10 : 0) +
        words.filter(w => name.includes(w)).length * 5;
    };
    return filtered.sort((a,b) => score(b) - score(a) || a.id.localeCompare(b.id));
  }
  return filtered;
}

export function parseFavorites(input, availableIDs, cap = 200) {
  if (!input || input.version !== 1 || !Array.isArray(input.favorites)) {
    throw new Error("Unsupported saved-list format");
  }
  if (input.favorites.length > cap) throw new Error("Saved-list limit exceeded");
  const valid = new Set();
  for (const id of input.favorites) {
    if (typeof id !== "string" || id.length > 300) throw new Error("Invalid item identifier");
    if (availableIDs.has(id)) valid.add(id);
  }
  return valid;
}
