// cast.js：换算与相加（基线：原样返回）
import { unitTable } from "./units.js";

export function toBase(amount, unit) {
  return { group: "mass", base: amount };
}

export function total(terms) {
  return { group: "mass", base: 0, count: terms.length };
}
