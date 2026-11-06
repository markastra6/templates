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

test("Category and dependency facets restrict results without mutating source entries", () => {
  const richer = items.map(item => ({ ...item, name: item.slug, dependencies: item.source === "magic-ui" ? ["motion"] : [] }));
  const groups = { "react-bits": "motion", "magic-ui": "motion", hyperui: "components" };
  assert.deepEqual(searchComponents(richer, {group: "components", sourceGroups: groups}).map(x => x.source), ["hyperui","hyperui"]);
  assert.deepEqual(searchComponents(richer, {hasDependencies: true}).map(x => x.id), ["magic-ui:card"]);
  assert.equal(searchComponents(richer, {group:"motion",sourceGroups:groups,hasDependencies:true}).length,1);
  assert.equal(searchComponents(richer,{source:"hyperui",group:"motion",sourceGroups:groups}).length,0);
});

test("Ranking is deterministic and prioritizes exact name over description matches", () => {
  const data = [
    {id:"b",name:"Cards collection",slug:"cards-collection",source:"demo",kind:"block",search:"cards collection card"},
    {id:"c",name:"Card",slug:"card",source:"demo",kind:"block",search:"card"},
    {id:"a",name:"Special layout",slug:"layout",source:"demo",kind:"block",search:"special layout card"}
  ];
  assert.deepEqual(searchComponents(data,{query:"card",sort:"relevance"}).map(x=>x.id),["c","b","a"]);
  assert.deepEqual(searchComponents(data,{query:"card",sort:"name"}).map(x=>x.id),["c","b","a"]);
  assert.deepEqual(data.map(x=>x.id),["b","c","a"]);
});

test("best relevant grouped variant wins regardless of upstream order", () => {
  const data=[
    {id:"react-bits:Chip-JS-TW",name:"Fancy chip",slug:"Chip-JS-TW",source:"react-bits",kind:"component",search:"chip"},
    {id:"react-bits:Chip-TS-CSS",name:"Chip",slug:"Chip-TS-CSS",source:"react-bits",kind:"component",search:"chip"}
  ];
  assert.deepEqual(searchComponents(data,{query:"chip",sort:"relevance",groupVariants:true}).map(x=>x.id),["react-bits:Chip-TS-CSS"]);
});
