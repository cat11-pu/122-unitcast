// app.js：渲染结果
import { unitTable } from "./units.js";
import { scan } from "./cast.js";

export function render(spec) {
  const table = unitTable();
  const mass = scan(spec.mass_terms || []);
  const length = scan(spec.length_terms || []);
  const normalized = mass.bases;
  let maxRate = 0;
  Object.keys(table).forEach((name) => { if (table[name].rate > maxRate) maxRate = table[name].rate; });
  return { mass_total: mass.base, length_total: length.base, unit_count: Object.keys(table).length,
           max_rate: maxRate, normalized: normalized, grouped_ok: mass.group !== length.group };
}
