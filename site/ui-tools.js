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

export function searchComponents(items, options = {}) {
  const words = String(options.query || "").trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  const favoriteIDs = options.favoriteIDs || new Set();
  const seen = new Set();
  return items.filter(item => {
    if (options.source && item.source !== options.source) return false;
    if (options.kind && item.kind !== options.kind) return false;
    if (options.favoritesOnly && !favoriteIDs.has(item.id)) return false;
    if (!words.every(word => item.search.includes(word))) return false;
    if (options.groupVariants) {
      const family = variantFamily(item);
      if (seen.has(family)) return false;
      seen.add(family);
    }
    return true;
  });
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
