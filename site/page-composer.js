import { makeBlock, validateProject, moveSection, buildPageBody, buildPageHTML, defaultProject } from "./page-composer-core.js";
import { validateTheme, COLOR_KEYS, FONT_STACKS } from "./ui-tokens.js";

const el = id => document.getElementById(id);
const outline = /** @type {HTMLOListElement} */ (el("composer-sections"));
const canvas = /** @type {HTMLElement} */ (el("composer-canvas"));
const frame = /** @type {HTMLElement} */ (el("composer-frame"));
const typeInput = /** @type {HTMLSelectElement} */ (el("composer-add-type"));
const titleInput = /** @type {HTMLInputElement} */ (el("composer-title"));
const bodyInput = /** @type {HTMLTextAreaElement} */ (el("composer-body"));
const actionInput = /** @type {HTMLInputElement} */ (el("composer-action"));
const actionField = /** @type {HTMLElement} */ (el("composer-action-field"));
const selectionLabel = /** @type {HTMLElement} */ (el("composer-selected-label"));
const status = /** @type {HTMLElement} */ (el("composer-status"));
const importInput = /** @type {HTMLInputElement} */ (el("composer-import"));
const storageKey = "ui-page-composer-v1";
let project = defaultProject();
let selected = project.blocks[0].id;

function persist() {
  try {
    localStorage.setItem(storageKey,JSON.stringify(project));
    status.textContent = "Page saved in this browser. Export JSON to keep a portable backup.";
  } catch {
    status.textContent = "Browser storage unavailable. Export your page to keep it.";
  }
}
function download(text, filename, type) {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const link = document.createElement("a");
  link.href = url; link.download = filename; document.body.append(link);
  link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function applyTheme() {
  const theme = project.theme;
  for (const key of COLOR_KEYS) {
    canvas.style.setProperty("--ui-" + key.replace(/[A-Z]/g, x => "-" + x.toLowerCase()), theme.colors[key]);
  }
  canvas.style.setProperty("--ui-radius", theme.radius + "px");
  canvas.style.setProperty("--ui-density", theme.density + "rem");
  canvas.style.setProperty("--ui-font", FONT_STACKS[theme.font]);
}
function focusOutline(id, action) {
  for(const button of outline.querySelectorAll("button[data-action]")) {
    if(button.getAttribute("data-id") === id && button.getAttribute("data-action") === action) {
      /** @type {HTMLButtonElement} */ (button).focus(); break;
    }
  }
}
function addButton(parent, block, label, action, disabled, handler) {
  const button = document.createElement("button");
  button.type = "button"; button.textContent = label;
  button.dataset.action = action; button.dataset.id = block.id;
  button.disabled = disabled;
  if (action === "select") button.setAttribute("aria-pressed", String(selected === block.id));
  button.setAttribute("aria-label", label + " " + block.title);
  button.addEventListener("click", () => { handler(); focusOutline(block.id, action); });
  parent.append(button);
}
function renderOutline() {
  const frag = document.createDocumentFragment();
  project.blocks.forEach((block,index) => {
    const li = document.createElement("li");
    li.dataset.active = String(block.id === selected);
    const heading = document.createElement("span");
    heading.className = "composer-outline-title"; heading.textContent = block.title || "Untitled section";
    const kind = document.createElement("span");
    kind.className = "composer-outline-type"; kind.textContent = " · " + block.type;
    heading.append(kind); li.append(heading);
    const actions = document.createElement("div"); actions.className = "composer-outline-actions";
    addButton(actions,block,"Edit","select",false,()=>{ selected=block.id; render(); });
    addButton(actions,block,"Move up","up",index===0,()=>{
      project.blocks=moveSection(project.blocks,block.id,-1); persist(); render(false);
    });
    addButton(actions,block,"Move down","down",index===project.blocks.length-1,()=>{
      project.blocks=moveSection(project.blocks,block.id,1); persist(); render(false);
    });
    addButton(actions,block,"Remove","remove",project.blocks.length===1,()=>{
      const at=project.blocks.findIndex(x=>x.id===block.id);
      project.blocks=project.blocks.filter(x=>x.id!==block.id);
      if(selected===block.id)selected=project.blocks[Math.min(at,project.blocks.length-1)].id;
      persist();render();
      focusOutline(selected,"select");
    });
    li.append(actions);frag.append(li);
  });
  outline.replaceChildren(frag);
}
function render(syncInputs = true) {
  renderOutline();
  const current = project.blocks.find(x=>x.id===selected) || project.blocks[0];
  if(syncInputs) {
    titleInput.value = current.title; bodyInput.value = current.body;
    actionInput.value = current.action;
  }
  selectionLabel.textContent = "Editing " + current.type + " · " + (project.blocks.findIndex(x=>x.id===current.id)+1) + " of " + project.blocks.length;
  actionField.hidden = !["hero","callout"].includes(current.type);
  applyTheme();
  canvas.innerHTML = buildPageBody(project);
  const highlighted = canvas.querySelector('[id="' + selected + '"]');
  if (highlighted) /** @type {HTMLElement} */ (highlighted).dataset.selected = "true";
}
function edit(key, value) {
  const updated = project.blocks.map(block=>block.id===selected?{...block,[key]:value}:block);
  project=validateProject({...project,blocks:updated});
  persist();render(false);
}
titleInput.addEventListener("input",()=>edit("title",titleInput.value));
bodyInput.addEventListener("input",()=>edit("body",bodyInput.value));
actionInput.addEventListener("input",()=>edit("action",actionInput.value));

el("composer-add").addEventListener("click",()=>{
  if(project.blocks.length>=16){status.textContent="Maximum of 16 sections reached.";return;}
  let number=1;
  while(project.blocks.some(x=>x.id==="block-"+number))number++;
  const block=makeBlock(typeInput.value,"block-"+number);
  project.blocks.push(block);selected=block.id;persist();render();focusOutline(block.id,"select");
});
el("composer-theme").addEventListener("click",()=>{
  try {
    const saved=localStorage.getItem("ui-token-studio-v1");
    if(!saved){status.textContent="No saved token-studio theme found in this browser.";return;}
    project=validateProject({...project,theme:validateTheme(JSON.parse(saved))});
    persist();render();
    status.textContent="Saved Design Token Studio theme applied.";
  }catch{status.textContent="Saved theme unavailable or invalid. Current page theme was preserved.";}
});
for (const button of document.querySelectorAll("button[data-viewport]")) {
  button.addEventListener("click",()=>{
    const width=button.getAttribute("data-viewport");
    if(!["desktop","tablet","mobile"].includes(width))return;
    frame.dataset.viewport=width;
    for(const other of document.querySelectorAll("button[data-viewport]"))
      other.setAttribute("aria-pressed",String(other===button));
  });
}
el("composer-export-html").addEventListener("click",()=>{
  download(buildPageHTML(project),"original-page.html","text/html");
  status.textContent="Standalone HTML exported. Review page content before publishing.";
});
el("composer-export-json").addEventListener("click",()=>{
  download(JSON.stringify(project,null,2)+"\n","original-page.project.json","application/json");
  status.textContent="Editable JSON project exported.";
});
importInput.addEventListener("change",async()=>{
  const file=importInput.files?.[0];if(!file)return;
  try{
    if(file.size>65536)throw new Error("File too large");
    const imported=validateProject(JSON.parse(await file.text()));
    project=imported;selected=project.blocks[0].id;
    persist();render();status.textContent="Validated page project imported.";
  }catch{status.textContent="Import rejected. Use a valid exported project JSON file under 64 KB; current page unchanged.";}
  finally{importInput.value="";}
});
el("composer-reset").addEventListener("click",()=>{
  if(!window.confirm("Replace your local page with the original example? Export a backup first."))return;
  project=defaultProject();selected=project.blocks[0].id;persist();render();
  status.textContent="Original example restored.";
});
try{
  const raw=localStorage.getItem(storageKey);
  if(raw){project=validateProject(JSON.parse(raw));selected=project.blocks[0].id;}
}catch{status.textContent="Stored project could not be restored; using original example.";}
render();
