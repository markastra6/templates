import { appTypes, checks, defaultBlueprint, validateBlueprint, auditSummary, frameworkAdvice } from "./app-blueprint-core.js";

const $ = id => document.getElementById(id);
const storageKey = "app-blueprint-v1";
let model = defaultBlueprint();
let restored = false;
try {
  const raw = localStorage.getItem(storageKey);
  if (raw) { model = validateBlueprint(JSON.parse(raw)); restored = true; }
} catch { /* Storage is optional. Malformed saved data does not stop the editor. */ }
let view = "desktop";
const fields = ["name", "kind", "framework", "task", "offline", "notes"];
const screenList = $("mock-nav");
const checkList = $("checks");
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(model)); }
  catch { $("status").textContent = "Storage unavailable: export the project JSON to preserve your changes."; return; }
  $("status").textContent = "Saved locally. Export a backup for use on another device.";
}
function render() {
  $("name").value = model.name; $("kind").value=model.kind; $("framework").value=model.framework;
  $("task").value=model.primaryTask; $("offline").checked=model.offline; $("notes").value=model.notes;
  document.querySelectorAll('input[name="platform"]').forEach(input => { input.checked=model.platforms.includes(input.value); });
  $("advice").textContent=frameworkAdvice(model);
  $("mock-name").textContent=model.name;
  $("mock-task").textContent=model.primaryTask||appTypes[model.kind].task;
  screenList.replaceChildren(...appTypes[model.kind].screens.map(label => {
    const item=document.createElement("span"); item.textContent=label; return item;
  }));
  $("preview").className="preview "+view;
  document.querySelectorAll("[data-view]").forEach(button => {
    button.setAttribute("aria-pressed",String(button.dataset.view===view));
  });
  checkList.replaceChildren(...checks.map(check => {
    const section=document.createElement("article");section.className="check-card";
    const small=document.createElement("small");small.textContent=check.group;
    const title=document.createElement("h3");title.textContent=check.title;
    const desc=document.createElement("p");desc.textContent=check.detail;
    const label=document.createElement("label");label.textContent="Test result";
    const select=document.createElement("select");select.setAttribute("aria-label",check.title+" result");
    for(const [value,name] of [["not-run","Not tested"],["pass","Pass — evidence recorded externally"],["fail","Fail"],["blocked","Blocked"]]) {
      const option=document.createElement("option");option.value=value;option.textContent=name;select.append(option);
    }
    select.value=model.audit[check.id]||"not-run";
    select.addEventListener("change",()=>{
      if(select.value==="not-run")delete model.audit[check.id];else model.audit[check.id]=select.value;
      persist();renderAudit();
    });
    label.append(select);section.append(small,title,desc,label);return section;
  }));
  renderAudit();
}
function renderAudit(){
  const {counts,ready}=auditSummary(model);
  $("audit-summary").textContent=counts.pass+" of "+checks.length+" marked pass";
  $("release").textContent=ready
    ? "All checklist items marked pass. Verify recorded evidence and the actual native builds before releasing."
    : "Not ready for release: "+counts.fail+" failed, "+counts.blocked+" blocked, "+counts["not-run"]+" untested.";
}
for(const field of fields) {
  const target=$(field);
  target.addEventListener(field==="offline"||field==="kind"||field==="framework"?"change":"input",()=>{
    if(field==="task")model.primaryTask=target.value;
    else if(field==="offline")model.offline=target.checked;
    else if(field==="kind") {
      model.kind=target.value;model.primaryTask=appTypes[target.value].task;
    } else model[field]=target.value;
    persist();render();
    if(field==="name"||field==="task"||field==="notes")target.focus();
  });
}
document.querySelectorAll('input[name="platform"]').forEach(input=>input.addEventListener("change",()=>{
  const values=[...document.querySelectorAll('input[name="platform"]:checked')].map(e=>e.value);
  if(!values.length){input.checked=true;$("status").textContent="Select at least one platform.";return;}
  model.platforms=values;persist();render();
}));
document.querySelectorAll("[data-view]").forEach(button=>button.addEventListener("click",()=>{
  view=button.dataset.view;render();
}));
$("reset").addEventListener("click",()=>{
  if(!confirm("Replace your current blueprint and audit results? Export first to keep a backup."))return;
  model=defaultBlueprint();persist();render();
});
$("export").addEventListener("click",()=>{
  const content=JSON.stringify(validateBlueprint(model),null,2)+"\n";
  const url=URL.createObjectURL(new Blob([content],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="app-blueprint.json";document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  $("status").textContent="Project JSON exported. Preserve test evidence separately.";
});
$("import").addEventListener("change",async()=>{
  const file=$("import").files?.[0];if(!file)return;
  try{
    if(file.size>16384)throw new Error("JSON file exceeds 16 KiB");
    const next=validateBlueprint(JSON.parse(await file.text()));
    if(!confirm("Replace the current blueprint with the imported project?"))return;
    model=next;persist();render();
  }catch{$("status").textContent="Import rejected: invalid or oversized JSON. Existing blueprint unchanged.";}
  finally{$("import").value="";}
});
render();
$("status").textContent=restored?"Restored saved browser blueprint. Export a backup before clearing browser data.":"Ready. Changes are saved locally when storage is available.";
