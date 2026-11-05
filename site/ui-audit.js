export {};
const status = /** @type {HTMLElement} */ (document.getElementById("audit-status"));
const table = /** @type {HTMLTableSectionElement} */ (document.getElementById("audit-rows"));
const stats = /** @type {HTMLElement} */ (document.getElementById("audit-stats"));
async function load() {
  try {
    const response = await fetch("./ui-audit.json");
    if (!response.ok) throw new Error("Could not read report");
    const audit = await response.json();
    if (audit.schema_version !== "1.0.0" || !Array.isArray(audit.sources) ||
        !Array.isArray(audit.errors) || audit.errors.length || audit.sources.length !== audit.sourceCount) {
      throw new Error("Invalid report");
    }
    for (const [label,number] of [
      ["Design sources", audit.sourceCount],["Indexed sources",audit.indexedCount],
      ["Metadata records",audit.recordCount],["Distinct source families",audit.familyCount]
    ]) {
      const item = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = Number(number).toLocaleString("en-US");
      const span = document.createElement("span");
      span.textContent = label;
      item.append(strong,span);
      stats.append(item);
    }
    const body = document.createDocumentFragment();
    for (const s of audit.sources) {
      const tr = document.createElement("tr");
      const values = [s.name,s.status,s.records,s.families,s.variantRecords,
        s.dependencyDeclarations,s.snapshot || "Not indexed"];
      for(const value of values) {
        const td = document.createElement("td");
        td.textContent = typeof value === "number" ? value.toLocaleString("en-US") : String(value);
        tr.append(td);
      }
      body.append(tr);
    }
    table.replaceChildren(body);
    status.textContent = "Offline integrity checks passed. This report does not verify live links or component quality.";
  } catch {
    status.textContent = "Audit report unavailable or invalid. Run the local build to regenerate it.";
  }
}
void load();
