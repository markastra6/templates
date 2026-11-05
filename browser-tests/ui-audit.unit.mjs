import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { auditCatalogue } from "../scripts/ui-audit.mjs";

const read = path => JSON.parse(readFileSync(path,"utf8"));
const directory = read("docs/references/ui-component-sources.json");
const documents = directory.sources.filter(s => ["registry","tree"].includes(s.collection))
  .map(s => read(`docs/references/ui-index/${s.id}.json`));

test("full catalogue has valid offline metadata and truthful source coverage", () => {
  const audit = auditCatalogue(directory,documents);
  assert.deepEqual(audit.errors,[]);
  assert.equal(audit.sourceCount,31);
  assert.equal(audit.indexedCount,15);
  assert.equal(audit.recordCount,9403);
  assert.equal(audit.sources.reduce((n,s)=>n+s.records,0),9403);
  assert.ok(audit.familyCount <= audit.recordCount);
  assert.ok(audit.sources.some(s=>s.status === "link-only"));
  assert.ok(audit.sources.some(s=>s.variantRecords>0));
});

test("audit detects duplicate records, bad URLs and missing manifests", () => {
  const dir={sources:[{id:"sample",name:"Sample",group:"components",collection:"registry"}]};
  const doc={source:"sample",count:2,entries:[
    {id:"sample:one",slug:"one",url:"https://example.com/a",tags:[],dependencies:[]},
    {id:"sample:one",slug:"two",url:"http://example.com/b",tags:[],dependencies:[]}
  ]};
  const audit=auditCatalogue(dir,[doc]);
  assert.ok(audit.errors.some(e=>e.includes("Duplicate")));
  assert.ok(audit.errors.some(e=>e.includes("Invalid URL")));
  assert.ok(auditCatalogue(dir,[]).errors.some(e=>e.includes("Missing index")));
});
