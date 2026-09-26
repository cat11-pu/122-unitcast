import fs from "node:fs";
import { unitTable } from "./units.js";
import { toBase, total } from "./cast.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/terms.json", "utf8"));
const view = render(spec);
const table = unitTable();

emit("质量合计毫克 =", view.mass_total);
emit("长度合计毫米 =", view.length_total);
emit("单位表条数 =", view.unit_count);
emit("最大倍率 =", view.max_rate);
emit("质量项换算结果 =", JSON.stringify(view.normalized));
emit("两组是否各自成组 =", view.grouped_ok);
emit("未知单位的错误码 =", spec.unknown_error_code);
emit("单位不兼容的错误码 =", spec.incompatible_error_code);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  toBase(1, "furlong");
  emit("未知单位的错误码", "没有报错");
} catch (error) {
  emit("未知单位的错误码", error && error.code ? error.code : String(error.message));
}
try {
  total([{ amount: 1, unit: "kg" }, { amount: 1, unit: "m" }]);
  emit("单位不兼容的错误码", "没有报错");
} catch (error) {
  emit("单位不兼容的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "质量合计毫克": 3201500,
  "长度合计毫米": 2300,
  "单位表条数": 6,
  "最大倍率": 1000000,
  "质量项换算结果": [
    3000000,
    200000,
    1500
  ],
  "两组是否各自成组": true,
  "未知单位的错误码": "E_UNKNOWN_UNIT",
  "单位不兼容的错误码": "E_INCOMPATIBLE"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
