/** Original design-token utilities. No external assets, code evaluation or dependencies. */
export const COLOR_KEYS = ["canvas", "surface", "text", "muted", "accent", "onAccent", "border"];
export const FONT_STACKS = Object.freeze({
  system: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, "SFMono-Regular", Consolas, monospace'
});
export const PRESETS = Object.freeze({
  forest: {
    version: 1, name: "Forest", font: "system", radius: 12, density: 1,
    colors: { canvas:"#f1f6f2",surface:"#ffffff",text:"#183428",muted:"#496354",
      accent:"#17694e",onAccent:"#ffffff",border:"#d2e1d6" }
  },
  ocean: {
    version: 1, name: "Ocean", font: "system", radius: 12, density: 1,
    colors: { canvas:"#f3f7ff",surface:"#ffffff",text:"#162c4d",muted:"#496785",
      accent:"#155eef",onAccent:"#ffffff",border:"#d5e0f2" }
  },
  night: {
    version: 1, name: "Night", font: "system", radius: 14, density: 1,
    colors: { canvas:"#101b20",surface:"#182930",text:"#eff9f6",muted:"#a4bab5",
      accent:"#7be1bf",onAccent:"#0d2720",border:"#38524e" }
  }
});
const hexPattern = /^#[0-9a-fA-F]{6}$/;

/** Return a known, safe schema; never spread untrusted JSON into a CSS declaration. */
export function validateTheme(candidate) {
  if (!candidate || candidate.version !== 1 || typeof candidate !== "object" ||
      typeof candidate.name !== "string" || !candidate.name.trim() || candidate.name.length > 48 ||
      !candidate.colors || typeof candidate.colors !== "object" ||
      !Object.hasOwn(FONT_STACKS, candidate.font) ||
      !Number.isInteger(candidate.radius) || candidate.radius < 0 || candidate.radius > 32 ||
      typeof candidate.density !== "number" || !Number.isFinite(candidate.density) ||
      candidate.density < 0.75 || candidate.density > 1.5) {
    throw new Error("Invalid design-token schema");
  }
  const colors = {};
  for (const key of COLOR_KEYS) {
    const color = candidate.colors[key];
    if (typeof color !== "string" || !hexPattern.test(color)) throw new Error("Invalid color " + key);
    colors[key] = color.toLowerCase();
  }
  return { version: 1, name: candidate.name.trim(), font: candidate.font,
    radius: candidate.radius, density: candidate.density, colors };
}

export function contrastRatio(foreground, background) {
  const lum = color => {
    if (typeof color !== "string" || !hexPattern.test(color)) throw new Error("Invalid contrast color");
    const values = [1, 3, 5].map(i => parseInt(color.slice(i,i+2),16) / 255);
    const rgb = values.map(v => v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4));
    return rgb[0]*0.2126 + rgb[1]*0.7152 + rgb[2]*0.0722;
  };
  const a = lum(foreground), b = lum(background);
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}

export function buildCSS(input) {
  const t = validateTheme(input);
  const lines = COLOR_KEYS.map(key => `  --ui-${key.replace(/[A-Z]/g, x => "-" + x.toLowerCase())}: ${t.colors[key]};`);
  lines.push(`  --ui-radius: ${t.radius}px;`);
  lines.push(`  --ui-density: ${t.density}rem;`);
  lines.push(`  --ui-font: ${FONT_STACKS[t.font]};`);
  return ":root {\n" + lines.join("\n") + "\n}\n";
}
