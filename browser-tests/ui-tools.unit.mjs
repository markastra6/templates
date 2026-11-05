import test from "node:test";
import assert from "node:assert/strict";
import { variantFamily, searchComponents, parseFavorites } from "../site/ui-tools.js";

const items = [
  { id:"react-bits:Text-TS-CSS", slug:"Text-TS-CSS", source:"react-bits", kind:"component", search:"text animated component" },
  { id:"react-bits:Text-JS-TW", slug:"Text-JS-TW", source:"react-bits", kind:"component", search:"text animated component" },
  { id:"magic-ui:card", slug:"card", source:"magic-ui", kind:"ui", search:"card dashboard ui" },
  { id:"hyperui:public/examples/1.html", slug:"public/examples/1.html", source:"hyperui", kind:"example", search:"card markup html" },
  { id:"hyperui:public/examples/1-dark.html", slug:"public/examples/1-dark.html", source:"hyperui", kind:"example", search:"card markup dark" }
];

test("Known JS/TS and light/dark variations share a family, unrelated items stay separate", () => {
  assert.equal(variantFamily(items[0]), variantFamily(items[1]));
  assert.equal(variantFamily(items[3]), variantFamily(items[4]));
  assert.notEqual(variantFamily(items[0]), variantFamily(items[2]));
});

test("Grouping variants preserves first entry while raw search includes all variants", () => {
  assert.equal(searchComponents(items, { query: "text animated" }).length, 2);
  assert.equal(searchComponents(items, { query: "text animated", groupVariants: true }).length, 1);
  assert.equal(searchComponents(items, { source:"hyperui", groupVariants: true }).length, 1);
  assert.equal(searchComponents(items, { source:"magic-ui", kind:"ui" }).length, 1);
});

test("Saved-only combines with library, type, and token filters", () => {
  const ids = new Set([items[0].id,items[2].id]);
  assert.deepEqual(searchComponents(items, { favoritesOnly:true, favoriteIDs:ids, query:"dashboard" }).map(x=>x.id),[items[2].id]);
  assert.equal(searchComponents(items,{favoritesOnly:true, favoriteIDs:ids, source:"hyperui"}).length,0);
});

test("Import rejects malformed, oversized or non-string IDs and drops unknown IDs", () => {
  const known = new Set(items.map(x=>x.id));
  assert.deepEqual([...parseFavorites({version:1,favorites:[items[0].id,items[0].id,"gone"]},known)], [items[0].id]);
  assert.throws(()=>parseFavorites({version:2,favorites:[]},known), /Unsupported/);
  assert.throws(()=>parseFavorites({version:1,favorites:[123]},known),/Invalid/);
  assert.throws(()=>parseFavorites({version:1,favorites:[items[0].id,items[1].id]},known,1), /limit/);
});
