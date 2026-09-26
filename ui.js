// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let group = "mass";
  parts.log.textContent = "质量项 " + (spec.mass_terms || []).length + " 个，长度项 "
    + (spec.length_terms || []).length + " 个。";

  function draw() {
    const scene = Object.assign({}, spec, { emphasis: group });
    let view = null;
    try {
      view = render(scene);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    const names = ["mass", "length"];
    names.forEach(function (name) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = name === "mass" ? "质量" : "长度";
      row.appendChild(head);
      const mark = document.createElement("span");
      mark.className = "chip" + (name === group ? " ok" : "");
      mark.textContent = name === "mass" ? view.mass_total + " 毫克" : view.length_total + " 毫米";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "单位表 " + view.unit_count + " 个，最大倍率 " + view.max_rate;
    parts.log.textContent = "同组相加是否成功：" + view.grouped_ok;
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "换算并合计";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const swapButton = document.createElement("button");
  swapButton.textContent = "换个重点分组";
  swapButton.addEventListener("click", function () {
    group = group === "mass" ? "length" : "mass";
    draw();
  });
  parts.controls.appendChild(swapButton);

  const label = document.createElement("label");
  label.textContent = "换个单位试试";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "text";
  box.value = "g";
  box.addEventListener("input", function () {
    try {
      const scene = Object.assign({}, spec, { mass_terms: [{ amount: 1, unit: box.value }] });
      const view = render(scene);
      parts.out.textContent = box.value + " 换算成 " + view.mass_total + " 毫克";
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
    }
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看最大倍率";
  readButton.addEventListener("click", function () {
    const scene = Object.assign({}, spec, { emphasis: group });
    const view = render(scene);
    parts.out.textContent = "单位表 " + view.unit_count + " 个，最大倍率 " + view.max_rate;
  });
  parts.controls.appendChild(readButton);

  draw();
}
