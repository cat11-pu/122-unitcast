import assert from "node:assert";
import { unitTable } from "../units.js";
import { toBase, total } from "../cast.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("unitTable returns entries", () => {
  assert.ok(Object.keys(unitTable()).length >= 1);
});

check("toBase returns group and base", () => {
  assert.strictEqual(typeof toBase(1, "mg").base, "number");
});

check("total returns a base", () => {
  assert.strictEqual(typeof total([{ amount: 1, unit: "mg" }]).base, "number");
});

check("render returns two totals", () => {
  const view = render({ mass_terms: [{ amount: 1, unit: "mg" }], length_terms: [] });
  assert.strictEqual(typeof view.mass_total, "number");
  assert.strictEqual(typeof view.length_total, "number");
});

check("render exposes unit count", () => {
  assert.strictEqual(typeof render({ mass_terms: [], length_terms: [] }).unit_count, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
