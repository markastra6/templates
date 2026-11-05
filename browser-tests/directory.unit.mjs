import test from "node:test";
import assert from "node:assert/strict";
import { matches } from "../site/directory.js";
test("each query term matches regardless of order or case", () => {
  assert.equal(matches("Android app audit", " AUDIT  android "), true);
  assert.equal(matches("Android app audit", "audit desktop"), false);
  assert.equal(matches("Android app audit", ""), true);
});
