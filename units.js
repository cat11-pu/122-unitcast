// units.js：单位表（质量基准 mg，长度基准 mm；rate 为相对本组基准的倍率）
export function unitTable() {
  return {
    mg: { group: "mass", rate: 1 },
    g: { group: "mass", rate: 1000 },
    kg: { group: "mass", rate: 1000000 },
    mm: { group: "length", rate: 1 },
    cm: { group: "length", rate: 10 },
    m: { group: "length", rate: 1000 }
  };
}
