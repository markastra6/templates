import test from "node:test";
import assert from "node:assert/strict";
import { appTypes, checks, defaultBlueprint, validateBlueprint, auditSummary, frameworkAdvice } from "../site/app-blueprint-core.js";

test("blueprints ship with explicit platforms, workflow and unresolved audit gates", () => {
  const model=defaultBlueprint();
  assert.ok(appTypes[model.kind].screens.length>=3);
  assert.deepEqual(model.platforms,["windows","android"]);
  const summary=auditSummary(model);
  assert.equal(summary.ready,false);
  assert.equal(summary.counts["not-run"],checks.length);
});
test("import validator rejects malformed state and dangerous mutable structures", () => {
  assert.throws(()=>validateBlueprint({...defaultBlueprint(),platforms:[]}),/Invalid/);
  assert.throws(()=>validateBlueprint({...defaultBlueprint(),platforms:["windows","windows"]}),/Invalid/);
  assert.throws(()=>validateBlueprint({...defaultBlueprint(),audit:{security:"unknown"}}),/Invalid/);
  assert.throws(()=>validateBlueprint({...defaultBlueprint(),notes:"a".repeat(2001)}),/too long/);
  assert.throws(()=>validateBlueprint({...defaultBlueprint(),kind:"__proto__"}),/Invalid/);
});
test("full audit is readiness only when all explicit checks pass", () => {
  const model=defaultBlueprint();
  for(const check of checks) model.audit[check.id]="pass";
  assert.equal(auditSummary(model).ready,true);
  model.audit.persistence="fail";
  assert.equal(auditSummary(model).ready,false);
  assert.equal(auditSummary(model).counts.fail,1);
});
test("JSON roundtrip and framework caution remain stable", () => {
  const model=validateBlueprint(JSON.parse(JSON.stringify(defaultBlueprint())));
  assert.deepEqual(validateBlueprint(model),model);
  assert.match(frameworkAdvice({...model,framework:"tauri"}),/Android plugin/);
});
