import { PRESETS, validateTheme } from "./ui-tokens.js";
import { TYPES, defaultLab, validateLab, buildComponentHTML } from "./component-lab-core.js";

const el = id => document.getElementById(id);
const type = /** @type {HTMLSelectElement} */ (el("lab-type"));
const preset = /** @type {HTMLSelectElement} */ (el("lab-preset"));
const title = /** @type {HTMLInputElement} */ (el("lab-title"));
const body = /** @type {HTMLTextAreaElement} */ (el("lab-body"));
const action = /** @type {HTMLInputElement} */ (el("lab-action"));
const actionRow = /** @type {HTMLElement} */ (el("lab-action-row"));
const frame = /** @type {HTMLIFrameElement} */ (el("lab-preview"));
const shell = /** @type {HTMLElement} */ (el("lab-preview-shell"));
const source = /** @type {HTMLTextAreaElement} */ (el("lab-source"));
const status = /** @type {HTMLElement} */ (el("lab-status"));
const importInput = /** @type {HTMLInputElement} */ (el("lab-import"));
const storageKey = "ui-component-lab-v1";
let config = defaultLab();

function render() {
  const text = buildComponentHTML(config);
  type.value = config.type;
  title.value = config.title;
  body.value = config.body;
  action.value = config.action;
  actionRow.hidden = !["button","form","toast"].includes(config.type);
  frame.srcdoc = text;
  source.value = text;
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(config));
    status.textContent = "Example saved locally. Preview reset to the current component state.";
  } catch {
    status.textContent = "Browser storage unavailable. Export your work to preserve it.";
  }
}

function apply(candidate, shouldSave = true) {
  config = validateLab(candidate);
  render();
  if (shouldSave) save();
}

function download(content, filename, mime) {
  const url = URL.createObjectURL(new Blob([content], {type:mime}));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type.addEventListener("change", () => {
  if (!TYPES.includes(type.value)) return;
  apply(defaultLab(type.value,config.theme));
  status.textContent = "Showing original " + type.options[type.selectedIndex].text + " example.";
});

for (const field of [title,body,action]) {
  field.addEventListener("input", () => {
    try {
      apply({...config,title:title.value,body:body.value,action:action.value});
    } catch {
      status.textContent = "A heading is required and all fields must respect their length limits.";
    }
  });
}

preset.addEventListener("change", () => {
  if (!Object.hasOwn(PRESETS,preset.value)) {
    status.textContent = "Choose a preset or load your saved Token Studio theme.";
    return;
  }
  apply({...config,theme:PRESETS[preset.value]});
  status.textContent = preset.options[preset.selectedIndex].text + " palette applied.";
});

el("lab-saved-theme").addEventListener("click", () => {
  try {
    const raw = localStorage.getItem("ui-token-studio-v1");
    if (!raw) {
      status.textContent = "No saved Token Studio theme found. Create one in the Design Token Studio.";
      return;
    }
    const theme = validateTheme(JSON.parse(raw));
    apply({...config,theme});
    preset.value = "custom";
    status.textContent = "Validated Token Studio theme applied.";
  } catch {
    status.textContent = "Saved theme is invalid or unavailable. Current preview is unchanged.";
  }
});

for (const button of document.querySelectorAll("button[data-lab-view]")) {
  button.addEventListener("click", () => {
    const view = button.getAttribute("data-lab-view");
    if (!["desktop","tablet","mobile"].includes(view)) return;
    shell.dataset.width = view;
    for (const other of document.querySelectorAll("button[data-lab-view]")) {
      other.setAttribute("aria-pressed",String(other===button));
    }
  });
}
el("lab-reset").addEventListener("click", () => {
  apply(defaultLab(type.value,config.theme));
  status.textContent = "Component content reset. Your selected theme was retained.";
});
el("lab-export-html").addEventListener("click", () => {
  download(buildComponentHTML(config),"original-"+config.type+".html","text/html");
  status.textContent = "Standalone HTML example exported.";
});
el("lab-export-json").addEventListener("click", () => {
  download(JSON.stringify(config,null,2)+"\n","original-"+config.type+".json","application/json");
  status.textContent = "Editable component JSON exported.";
});
el("lab-copy").addEventListener("click", async () => {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard not available");
    await navigator.clipboard.writeText(buildComponentHTML(config));
    status.textContent = "Generated HTML copied.";
  } catch {
    status.textContent = "Clipboard unavailable. Use Export standalone HTML instead.";
  }
});
importInput.addEventListener("change", async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  try {
    if (file.size > 16384) throw new Error("Import too large");
    const incoming = validateLab(JSON.parse(await file.text()));
    apply(incoming);
    preset.value = "custom";
    status.textContent = "Validated component JSON imported.";
  } catch {
    status.textContent = "Import rejected. Use an exported component JSON under 16 KiB. Existing work unchanged.";
  } finally { importInput.value = ""; }
});

try {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    config = validateLab(JSON.parse(raw));
    preset.value = "custom";
  }
} catch {
  status.textContent = "Stored component could not be restored. Default example loaded.";
}
render();
