// cast.js：换算到基准值并按同一分组合计
import { unitTable } from "./units.js";

function codedError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function toBase(amount, unit) {
  const entry = unitTable()[unit];
  if (!entry) {
    throw codedError("E_UNKNOWN_UNIT", "unknown unit: " + unit);
  }
  return { group: entry.group, base: Math.round(amount * entry.rate) };
}

export function total(terms) {
  const table = unitTable();
  let group = null;
  let base = 0;
  for (const term of terms) {
    const entry = table[term.unit];
    if (!entry) {
      throw codedError("E_UNKNOWN_UNIT", "unknown unit: " + term.unit);
    }
    if (group === null) {
      group = entry.group;
    } else if (entry.group !== group) {
      throw codedError("E_INCOMPATIBLE", "mixed groups in one batch: " + group + " vs " + entry.group);
    }
    base += Math.round(term.amount * entry.rate);
  }
  return { group: group, base: base, count: terms.length };
}
