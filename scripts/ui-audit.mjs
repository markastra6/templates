import { variantFamily } from "../site/ui-tools.js";

/**
 * Audit the repository's already-collected public metadata.
 * This is an offline format and coverage audit, not a live HTTP link check,
 * license verification, malware scan or execution of third-party components.
 * @param {{sources:Array<{id:string,name:string,collection:string,group:string}>}} directory
 * @param {Array<{source:string,count:number,retrieved_date?:string,upstream?:object,entries:Array<any>}>} indexes
 */
export function auditCatalogue(directory, indexes) {
  const errors = [];
  const known = new Set();
  const bySource = new Map(indexes.map(doc => [doc.source, doc]));
  const seen = new Set();
  const sources = [];
  let total = 0;
  for (const src of directory.sources) {
    if (!src.id || known.has(src.id)) errors.push("Duplicate or missing source ID");
    known.add(src.id);
    const doc = bySource.get(src.id);
    if (!doc) {
      sources.push({ id:src.id, name:src.name, group:src.group, collection:src.collection,
        status:"link-only", records:0, families:0, variantRecords:0, dependencyDeclarations:0,
        snapshot:null, githubRepo:null });
      if (src.collection === "tree" || src.collection === "registry") errors.push("Missing index: " + src.id);
      continue;
    }
    if (!["registry","tree"].includes(src.collection)) errors.push("Indexed source not permitted: "+src.id);
    if (!Array.isArray(doc.entries) || doc.count !== doc.entries.length) {
      errors.push("Invalid index count: " + src.id); continue;
    }
    const families = new Set();
    let withDependencies = 0;
    for (const item of doc.entries) {
      if (typeof item.id !== "string" || seen.has(item.id)) errors.push("Duplicate or invalid item ID: " + String(item.id));
      seen.add(item.id);
      try {
        const url = new URL(item.url);
        if (url.protocol !== "https:" || url.username || url.password || url.hash) throw new Error("unsafe");
      } catch { errors.push("Invalid URL: " + String(item.id)); }
      if (!Array.isArray(item.tags) || !Array.isArray(item.dependencies)) {
        errors.push("Invalid array metadata: " + String(item.id));
      } else if (item.dependencies.length > 0) withDependencies++;
      families.add(variantFamily({...item,source:src.id}));
    }
    total += doc.entries.length;
    sources.push({id:src.id,name:src.name,group:src.group,collection:src.collection,
      status:"indexed",records:doc.entries.length,families:families.size,
      variantRecords:doc.entries.length-families.size,
      dependencyDeclarations:withDependencies,
      snapshot:doc.retrieved_date || null,githubRepo:doc.upstream?.repo || null});
  }
  for (const doc of indexes) if (!known.has(doc.source)) errors.push("Unlisted index: "+doc.source);
  return {schema_version:"1.0.0",audit_type:"offline-metadata-validation",
    warning:"URL syntax, data integrity and coverage only. No live availability, individual license, accessibility, security or dependency compatibility checks were performed.",
    sourceCount:directory.sources.length,indexedCount:sources.filter(s=>s.status==="indexed").length,
    recordCount:total,familyCount:sources.reduce((n,s)=>n+s.families,0),
    variantRecordCount:sources.reduce((n,s)=>n+s.variantRecords,0),
    declaredDependencyCount:sources.reduce((n,s)=>n+s.dependencyDeclarations,0),
    errors,sources};
}
