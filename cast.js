// cast.js：换算与相加（基线：原样返回）
import { unitTable } from "./units.js";

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

// 单趟扫描：每个项只换算一次，同时累计基准值与逐项结果，分组不一致立即报 E_INCOMPATIBLE。
export function scan(terms) {
  const table = unitTable();
  const bases = [];
  let group = null;
  let sum = 0;
  for (const item of terms) {
    const entry = table[item.unit];
    if (!entry) fail("E_UNKNOWN_UNIT", "未知单位：" + item.unit);
    if (group === null) group = entry.group;
    else if (entry.group !== group) fail("E_INCOMPATIBLE", "同一批混了不同分组的单位");
    const base = item.amount * entry.rate;
    bases.push(base);
    sum += base;
  }
  return { group, base: sum, count: terms.length, bases };
}

export function toBase(amount, unit) {
  const entry = unitTable()[unit];
  if (!entry) fail("E_UNKNOWN_UNIT", "未知单位：" + unit);
  return { group: entry.group, base: amount * entry.rate };
}

export function total(terms) {
  const result = scan(terms);
  return { group: result.group, base: result.base, count: result.count };
}
