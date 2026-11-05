import { validateTheme, buildCSS, PRESETS } from "./ui-tokens.js";

/** Original, bounded page-section schema. No arbitrary HTML or third-party source. */
export const TYPES = Object.freeze(["hero","features","highlights","callout","footer"]);
const EXAMPLES = Object.freeze({
  hero: {title:"Design a better starting point.",body:"Build clear, responsive experiences with a focused visual system and reusable patterns.",action:"Explore the sections"},
  features: {title:"A calmer way to build.",body:"Start with strong fundamentals, choose useful patterns, and adapt them to your own product.",action:""},
  highlights: {title:"One workflow, many possibilities.",body:"Keep discovery, composition and validation connected from first sketch to final review.",action:""},
  callout: {title:"Ready to shape your next page?",body:"Choose the right structure, tune the design, and export a clean starting point.",action:"Continue"},
  footer: {title:"Made with intention.",body:"Original, dependency-free starter layout. Replace example copy with your own content.",action:""}
});

export function makeBlock(type,id) {
  if (!TYPES.includes(type) || !/^[a-z0-9-]{1,64}$/.test(id) || id === "page-top") throw new Error("Invalid section type or ID");
  return {id,type,...EXAMPLES[type]};
}

export function validateProject(input) {
  if (!input || input.version !== 1 || !Array.isArray(input.blocks) ||
      input.blocks.length < 1 || input.blocks.length > 16) throw new Error("Invalid page project");
  const ids = new Set();
  const blocks = input.blocks.map(block => {
    if (!block || !TYPES.includes(block.type) ||
        typeof block.id !== "string" || !/^[a-z0-9-]{1,64}$/.test(block.id) || block.id === "page-top" || ids.has(block.id)) {
      throw new Error("Invalid or duplicate section");
    }
    ids.add(block.id);
    for (const [key,max] of [["title",100],["body",240],["action",36]]) {
      if (typeof block[key] !== "string" || block[key].length > max) throw new Error("Invalid section text");
    }
    return {id:block.id,type:block.type,title:block.title,body:block.body,action:block.action};
  });
  return {version:1,theme:validateTheme(input.theme),blocks};
}

export function moveSection(blocks,id,delta) {
  const original = blocks.findIndex(item => item.id === id);
  const to = original + delta;
  if(original < 0 || !Number.isInteger(delta) || to < 0 || to >= blocks.length) return blocks.slice();
  const copy = blocks.slice();
  const [item] = copy.splice(original,1);
  copy.splice(to,0,item);
  return copy;
}

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
}

const PAGE_CSS = `
html { scroll-behavior: smooth; }
body { margin: 0; }
.composed-page { font-family: var(--ui-font); color: var(--ui-text); background: var(--ui-canvas); line-height: 1.55; min-height: 100vh; }
.composed-page * { box-sizing: border-box; }
.composed-page .page-section { padding: clamp(2.5rem, 7vw, 5rem) max(1.25rem, calc((100vw - 70rem) / 2)); }
.composed-page .page-hero { background: var(--ui-surface); min-height: 25rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
.composed-page h1 { font-size: clamp(2.4rem, 6vw, 4.8rem); line-height: 1.08; letter-spacing: -.055em; max-width: 52rem; margin: 0 0 1.5rem; }
.composed-page h2 { font-size: clamp(1.75rem, 4vw, 2.8rem); line-height: 1.15; letter-spacing: -.045em; margin: 0 0 1rem; }
.composed-page p { max-width: 45rem; color: var(--ui-muted); }
.composed-page .page-action { display: inline-block; margin-top: 1rem; background: var(--ui-accent); color: var(--ui-on-accent); text-decoration: none; padding: calc(var(--ui-density) * .8) calc(var(--ui-density) * 1.4); border-radius: var(--ui-radius); font-weight: 700; }
.composed-page .page-action:focus-visible { outline: 3px solid var(--ui-text); outline-offset: 3px; }
.composed-page .page-tiles { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--ui-density); margin-top: 2rem; }
.composed-page .page-tile { padding: calc(var(--ui-density) * 1.4); border: 1px solid var(--ui-border); border-radius: var(--ui-radius); background: var(--ui-surface); }
.composed-page .page-tile strong { display: block; font-size: 1.1rem; }
.composed-page .page-callout { background: var(--ui-accent); color: var(--ui-on-accent); }
.composed-page .page-callout p { color: var(--ui-on-accent); }
.composed-page .page-callout .page-action { background: var(--ui-on-accent); color: var(--ui-accent); }
.composed-page .page-footer { background: var(--ui-surface); padding-top: 2rem; padding-bottom: 2rem; border-top: 1px solid var(--ui-border); }
.composed-page .page-footer p { margin-bottom: 0; }
@media (max-width: 620px) { .composed-page .page-tiles { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`;

export function buildPageBody(input) {
  const project = validateProject(input);
  const blocks = project.blocks;
  const parts = blocks.map((block,index) => {
    const title = escapeHTML(block.title), body = escapeHTML(block.body);
    const next = blocks[index+1] ? blocks[index+1].id : "page-top";
    const action = block.action ? `<a class="page-action" href="#${next}">${escapeHTML(block.action)}</a>` : "";
    const id = escapeHTML(block.id);
    if (block.type === "hero") return `<section class="page-section page-hero" id="${id}"><h1>${title}</h1><p>${body}</p>${action}</section>`;
    if (block.type === "features") return `<section class="page-section" id="${id}"><h2>${title}</h2><p>${body}</p><div class="page-tiles"><div class="page-tile"><strong>Discover</strong><p>Start with the right idea.</p></div><div class="page-tile"><strong>Design</strong><p>Shape a consistent experience.</p></div><div class="page-tile"><strong>Deliver</strong><p>Refine and publish.</p></div></div></section>`;
    if (block.type === "highlights") return `<section class="page-section" id="${id}"><h2>${title}</h2><p>${body}</p><div class="page-tiles"><div class="page-tile"><strong>Clarity</strong><p>Focus on what matters.</p></div><div class="page-tile"><strong>Flexibility</strong><p>Adapt to your own product.</p></div><div class="page-tile"><strong>Quality</strong><p>Review before delivery.</p></div></div></section>`;
    if (block.type === "callout") return `<section class="page-section page-callout" id="${id}"><h2>${title}</h2><p>${body}</p>${action}</section>`;
    return `<footer class="page-section page-footer" id="${id}"><h2>${title}</h2><p>${body}</p></footer>`;
  });
  return `<div class="composed-page" id="page-top">${parts.join("\n")}</div>`;
}

export function buildPageHTML(input) {
  const project = validateProject(input);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHTML(project.blocks[0].title || "Original page")}</title>
<style>${buildCSS(project.theme)}\n${PAGE_CSS}</style>
</head><body>${buildPageBody(project)}</body></html>\n`;
}

export function defaultProject() {
  return {version:1,theme:validateTheme(PRESETS.forest),
    blocks:["hero","features","highlights","callout","footer"].map((type,i)=>makeBlock(type,`block-${i+1}`))};
}
