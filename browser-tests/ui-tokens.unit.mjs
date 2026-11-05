import test from "node:test";
import assert from "node:assert/strict";
import { PRESETS, COLOR_KEYS, FONT_STACKS, validateTheme, contrastRatio, buildCSS } from "../site/ui-tokens.js";

test("All original presets have complete, validated, contrast-aware tokens", () => {
  assert.equal(Object.keys(PRESETS).length, 3);
  assert.equal(COLOR_KEYS.length, 7);
  for (const preset of Object.values(PRESETS)) {
    const t = validateTheme(preset);
    assert.deepEqual(Object.keys(t.colors).sort(), [...COLOR_KEYS].sort());
    assert.ok(contrastRatio(t.colors.text, t.colors.surface) >= 4.5);
    assert.ok(contrastRatio(t.colors.onAccent, t.colors.accent) >= 4.5);
    assert.ok(Object.hasOwn(FONT_STACKS, t.font));
  }
});
test("Contrast follows WCAG 2.1 relative luminance formula", () => {
  assert.ok(Math.abs(contrastRatio("#000000", "#ffffff") - 21) < 0.001);
  assert.equal(contrastRatio("#777777", "#777777"), 1);
  assert.throws(() => contrastRatio("red", "#ffffff"), /Invalid/);
});
test("CSS export is deterministic, safe, and uses only known whitelisted fields", () => {
  const css = buildCSS(PRESETS.forest);
  assert.match(css, /--ui-accent: #17694e;/);
  assert.match(css, /--ui-on-accent: #ffffff;/);
  assert.match(css, /--ui-radius: 12px;/);
  assert.match(css, /--ui-font: system-ui/);
  assert.equal(css, buildCSS(PRESETS.forest));
  const t = validateTheme({ ...PRESETS.forest, name: "bad; } CSS" });
  assert.ok(!buildCSS(t).includes("bad;"));
});
test("Validation rejects script-like values, malformed colors, invalid density and version", () => {
  const t = PRESETS.forest;
  const invalid = candidate => assert.throws(() => validateTheme(candidate), /Invalid/);
  invalid({ ...t, version: 2 });
  invalid({ ...t, font: "url(https://attacker.test/font.css)" });
  invalid({ ...t, colors: { ...t.colors, accent: "#123456; color: red" } });
  invalid({ ...t, colors: { ...t.colors, surface: "transparent" } });
  invalid({ ...t, density: Infinity });
  invalid({ ...t, radius: 100 });
  invalid({ ...t, name: "" });
  assert.notStrictEqual(validateTheme(t).colors, t.colors);
});
