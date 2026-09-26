// app.js：渲染结果
import { unitTable } from "./units.js";
import { toBase, total } from "./cast.js";

export function render(spec) {
  const table = unitTable();
  const mass = total(spec.mass_terms || []);
  const length = total(spec.length_terms || []);
  const normalized = (spec.mass_terms || []).map((item) => toBase(item.amount, item.unit).base);
  let maxRate = 0;
  Object.keys(table).forEach((name) => { if (table[name].rate > maxRate) maxRate = table[name].rate; });
  return { mass_total: mass.base, length_total: length.base, unit_count: Object.keys(table).length,
           max_rate: maxRate, normalized: normalized, grouped_ok: mass.group !== length.group };
}
