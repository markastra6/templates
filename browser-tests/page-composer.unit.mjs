import test from "node:test";
import assert from "node:assert/strict";
import { TYPES, makeBlock, defaultProject, validateProject, moveSection, escapeHTML, buildPageBody, buildPageHTML } from "../site/page-composer-core.js";

test("Original section palette and default project validate without dependencies", () => {
  assert.deepEqual(TYPES,["hero","features","highlights","callout","footer"]);
  const project=defaultProject();
  assert.equal(validateProject(project).blocks.length,5);
  assert.ok(buildPageHTML(project).startsWith("<!doctype html>"));
  assert.match(buildPageHTML(project), /<meta name="viewport"/);
  assert.doesNotMatch(buildPageHTML(project), /<script\b/i);
});

test("Accessible section order operations preserve IDs and do not mutate originals", () => {
  const blocks=defaultProject().blocks;
  const newBlocks=moveSection(blocks,"block-2",-1);
  assert.equal(newBlocks[0].id,"block-2");
  assert.equal(blocks[0].id,"block-1");
  assert.deepEqual(moveSection(blocks,"block-1",-1),blocks);
  assert.deepEqual(moveSection(blocks,"missing",1),blocks);
});

test("Imported projects reject unknown types, duplicate IDs, oversized fields and malformed themes", () => {
  const project=defaultProject();
  const invalid=blocks=>assert.throws(()=>validateProject({...project,blocks}),/Invalid/);
  invalid([]);
  invalid([makeBlock("hero","one"),makeBlock("hero","one")]);
  invalid([{...makeBlock("hero","valid"),title:"A".repeat(101)}]);
  invalid([{...makeBlock("hero","valid"),id:"\" onmouseover=\"alert(1)"}]);
  invalid(Array.from({length:17},(_,i)=>makeBlock("hero",`block-${i+1}`)));
  assert.throws(()=>makeBlock("unknown","good"),/Invalid/);
  assert.throws(()=>makeBlock("hero","page-top"),/Invalid/);
  assert.throws(()=>validateProject({...project,theme:{...project.theme,font:"url(evil)"}}),/Invalid/);
});

test("Exported HTML escapes every user text field and keeps only internal links", () => {
  const project=defaultProject();
  project.blocks[0]={...project.blocks[0],title:'<img src=x onerror=alert(1)>',body:'Text & "quotes" </script>',action:'<script>alert(1)</script>'};
  const html=buildPageHTML(project);
  assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html,/Text &amp; &quot;quotes&quot; &lt;\/script&gt;/);
  assert.doesNotMatch(html,/<img src=x/);
  assert.doesNotMatch(html,/<script>alert/);
  assert.match(html,/href="#block-2"/);
  assert.match(html,/--ui-accent: #17694e;/);
  assert.equal(escapeHTML("&<>"),"&amp;&lt;&gt;");
});

test("Theme and section content survive strict validateProject round trip", () => {
  const before=defaultProject();
  const after=validateProject(JSON.parse(JSON.stringify(before)));
  assert.deepEqual(after,before);
  assert.match(buildPageBody(after),/id="page-top"/);
  assert.match(buildPageBody(after),/id="block-5"/);
});
