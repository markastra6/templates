import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const readJSON = path => JSON.parse(readFileSync(path, "utf8"));
const sources = readJSON("docs/references/ui-component-sources.json");
const listed = sources.sources.filter(x => ["registry","tree"].includes(x.collection));
test("all 31 sources are unique, HTTPS, and have explicit collection policies", () => {
  assert.equal(sources.sources.length, 31);
  assert.equal(new Set(sources.sources.map(x => x.id)).size, 31);
  for(const s of sources.sources) {
    assert.equal(new URL(s.url).protocol, "https:");
    assert.ok(["registry","tree","reference","restricted"].includes(s.collection));
    assert.ok(s.notice.length > 20);
  }
});
test("all registry snapshots contain unique, well-formed metadata and no source code", () => {
  const ids = new Set();
  let count = 0;
  for(const source of listed) {
    const index = readJSON(`docs/references/ui-index/${source.id}.json`);
    assert.equal(index.source, source.id);
    assert.equal(index.count, index.entries.length);
    assert.ok(index.count > 0);
    for(const item of index.entries) {
      assert.ok(!ids.has(item.id), `duplicate: ${item.id}`);
      ids.add(item.id);
      assert.equal(new URL(item.url).protocol, "https:");
      assert.ok(Array.isArray(item.tags));
      assert.ok(Array.isArray(item.dependencies));
      assert.equal(item.code, undefined);
    }
    count += index.count;
  }
  assert.equal(count, 3776);
});
test("site build includes explorer and source references", () => {
  execFileSync(process.execPath, ["scripts/build-site.mjs"]);
  const html = readFileSync("dist/site/ui-explorer.html","utf8");
  assert.match(html, /3,776 public component references/);
  assert.match(html, /React Bits/);
  assert.match(html, /Motion Primitives/);
  assert.match(html, /Dribbble/);
  assert.match(readFileSync("dist/site/index.html","utf8"), /ui-explorer\.html/);
});
