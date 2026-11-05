import { PRESETS, COLOR_KEYS, FONT_STACKS, validateTheme, contrastRatio, buildCSS } from "./ui-tokens.js";

const el = id => document.getElementById(id);
const preset = /** @type {HTMLSelectElement} */ (el("studio-preset"));
const name = /** @type {HTMLInputElement} */ (el("studio-name"));
const font = /** @type {HTMLSelectElement} */ (el("studio-font"));
const radius = /** @type {HTMLInputElement} */ (el("studio-radius"));
const density = /** @type {HTMLInputElement} */ (el("studio-density"));
const radiusValue = /** @type {HTMLOutputElement} */ (el("studio-radius-value"));
const densityValue = /** @type {HTMLOutputElement} */ (el("studio-density-value"));
const status = /** @type {HTMLElement} */ (el("studio-status"));
const preview = /** @type {HTMLElement} */ (el("studio-preview"));
const frame = /** @type {HTMLElement} */ (el("studio-frame"));
const contrastBody = /** @type {HTMLElement} */ (el("contrast-body"));
const contrastAction = /** @type {HTMLElement} */ (el("contrast-action"));
const importInput = /** @type {HTMLInputElement} */ (el("studio-import"));
const colors = Array.from(document.querySelectorAll("input[data-color]")).map(node => /** @type {HTMLInputElement} */ (node));
const storageKey = "ui-token-studio-v1";
let lastPreset = "forest";
let theme = validateTheme(PRESETS.forest);

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(theme));
    status.textContent = "Theme saved in this browser. Export to keep a portable copy.";
  } catch {
    status.textContent = "Browser storage is unavailable. Export before leaving this page.";
  }
}

function showContrast(node, label, foreground, background) {
  const ratio = contrastRatio(foreground, background);
  const pass = ratio >= 4.5;
  node.dataset.pass = String(pass);
  node.textContent = `${label}: ${ratio.toFixed(2)}:1 — ${pass ? "Pass AA" : "Below AA (4.5:1)"}`;
}

function render() {
  for (const input of colors) {
    const key = input.dataset.color;
    input.value = theme.colors[key];
  }
  name.value = theme.name;
  font.value = theme.font;
  radius.value = String(theme.radius);
  density.value = String(theme.density);
  radiusValue.textContent = theme.radius + " px";
  densityValue.textContent = theme.density.toFixed(2) + "×";
  for (const key of COLOR_KEYS) {
    const variable = "--ui-" + key.replace(/[A-Z]/g, x => "-" + x.toLowerCase());
    preview.style.setProperty(variable, theme.colors[key]);
  }
  preview.style.setProperty("--ui-radius", theme.radius + "px");
  preview.style.setProperty("--ui-density", theme.density + "rem");
  preview.style.setProperty("--ui-font", FONT_STACKS[theme.font]);
  showContrast(contrastBody, "Body text / surface", theme.colors.text, theme.colors.surface);
  showContrast(contrastAction, "Accent label / accent", theme.colors.onAccent, theme.colors.accent);
}

function apply(next, save = true) {
  theme = validateTheme(next);
  render();
  if (save) persist();
}

preset.addEventListener("change", () => {
  if (!Object.hasOwn(PRESETS, preset.value)) return;
  lastPreset = preset.value;
  apply(PRESETS[lastPreset]);
});
el("studio-reset").addEventListener("click", () => {
  preset.value = lastPreset;
  apply(PRESETS[lastPreset]);
  status.textContent = "Preset reset.";
});
for (const input of colors) {
  input.addEventListener("input", () => {
    const key = input.dataset.color;
    apply({ ...theme, colors: { ...theme.colors, [key]: input.value } });
    preset.value = "custom";
  });
}
name.addEventListener("change", () => {
  const text = name.value.trim();
  if (!text) {
    name.value = theme.name;
    status.textContent = "Theme name cannot be empty.";
    return;
  }
  apply({ ...theme, name:text });
  preset.value = "custom";
});
font.addEventListener("change", () => { apply({ ...theme, font:font.value }); preset.value = "custom"; });
radius.addEventListener("input", () => { apply({ ...theme, radius:Number(radius.value) }); preset.value = "custom"; });
density.addEventListener("input", () => {
  apply({ ...theme, density:Number(Number(density.value).toFixed(2)) });
  preset.value = "custom";
});

for (const button of document.querySelectorAll("button[data-width]")) {
  button.addEventListener("click", () => {
    const width = button.getAttribute("data-width");
    if (!["desktop","tablet","mobile"].includes(width)) return;
    frame.dataset.width = width;
    for (const other of document.querySelectorAll("button[data-width]")) {
      other.setAttribute("aria-pressed", String(other === button));
    }
  });
}

function download(content, filename, mimeType) {
  const url = URL.createObjectURL(new Blob([content], { type:mimeType }));
  const link = document.createElement("a");
  link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
el("studio-export-css").addEventListener("click", () => {
  const filename = theme.name.toLocaleLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g,"") || "design";
  download(buildCSS(theme), filename + "-tokens.css", "text/css");
  status.textContent = "CSS tokens exported. Copy them into your app's root stylesheet.";
});
el("studio-export-json").addEventListener("click", () => {
  download(JSON.stringify(theme, null, 2) + "\n", "ui-theme.json", "application/json");
  status.textContent = "Theme JSON exported.";
});
importInput.addEventListener("change", async () => {
  const file = importInput.files?.[0];
  if (!file) return;
  try {
    if (file.size > 16384) throw new Error("File too large");
    const imported = validateTheme(JSON.parse(await file.text()));
    apply(imported);
    preset.value = "custom";
    status.textContent = "Validated theme imported and saved locally.";
  } catch {
    status.textContent = "Import rejected. Select a valid design-token JSON file under 16 KB; your current theme is unchanged.";
  } finally { importInput.value = ""; }
});

try {
  const value = localStorage.getItem(storageKey);
  if (value) {
    theme = validateTheme(JSON.parse(value));
    preset.value = "custom";
  }
} catch {
  status.textContent = "Stored theme could not be loaded. Using the default theme.";
}
render();
