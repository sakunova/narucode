/*!
 * narucode-icons.js — narucode が使う 13 個のアイコンだけを同梱したもの
 *
 * アイコン: Lucide (lucide-static@1.31.0) — ISC License
 *   Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
 *   All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *   https://github.com/lucide-icons/lucide/blob/main/LICENSE
 *
 * 自動生成: tools/narucode-icons/build.mjs — 直接編集しない
 */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var BASE = {"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24","fill":"none","stroke":"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"};
  var ICONS = {
    "book-marked": "<path d=\"M10 2v8l3-3 3 3V2\" /> <path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20\" />",
    "book-open": "<path d=\"M12 5v16\" /> <path d=\"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z\" />",
    "camera": "<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\" /> <circle cx=\"12\" cy=\"13\" r=\"3\" />",
    "check": "<path d=\"M20 6 9 17l-5-5\" />",
    "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /> <path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
    "file-text": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\" /> <path d=\"M14 2v5a1 1 0 0 0 1 1h5\" /> <path d=\"M10 9H8\" /> <path d=\"M16 13H8\" /> <path d=\"M16 17H8\" />",
    "menu": "<path d=\"M4 5h16\" /> <path d=\"M4 12h16\" /> <path d=\"M4 19h16\" />",
    "music": "<path d=\"M9 18V5l12-2v13\" /> <circle cx=\"6\" cy=\"18\" r=\"3\" /> <circle cx=\"18\" cy=\"16\" r=\"3\" />",
    "music-2": "<circle cx=\"8\" cy=\"18\" r=\"4\" /> <path d=\"M12 18V2l7 4\" />",
    "play": "<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\" />",
    "play-circle": "<path d=\"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z\" /> <circle cx=\"12\" cy=\"12\" r=\"10\" />",
    "square": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" />",
    "x": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />"
  };

  function build(name, el, optionAttrs) {
    var svg = document.createElementNS(NS, "svg");

    // 1) アイコン既定値
    for (var k in BASE) svg.setAttribute(k, BASE[k]);
    // 2) createIcons({attrs}) で渡された既定値
    for (var o in optionAttrs) svg.setAttribute(o, String(optionAttrs[o]));
    // 3) 元要素に書かれた属性（最優先）
    var src = el.attributes;
    for (var i = 0; i < src.length; i++) {
      if (src[i].name === "class") continue;
      svg.setAttribute(src[i].name, src[i].value);
    }
    // class は連結する（本物の lucide と同じ）
    var cls = "lucide lucide-" + name;
    if (el.getAttribute("class")) cls += " " + el.getAttribute("class");
    svg.setAttribute("class", cls);

    svg.innerHTML = ICONS[name];
    return svg;
  }

  function createIcons(options) {
    options = options || {};
    var nameAttr = options.nameAttr || "data-lucide";
    var optionAttrs = options.attrs || {};
    var nodes = document.querySelectorAll("[" + nameAttr + "]");

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = el.getAttribute(nameAttr);
      if (!ICONS[name]) {
        // 同梱していないアイコン。握りつぶすと気づけないので必ず知らせる
        console.warn("[narucode-icons] 同梱していないアイコン: " + name + " — tools/narucode-icons/ に追加して再ビルドが必要");
        continue;
      }
      el.replaceWith(build(name, el, optionAttrs));
    }
  }

  window.lucide = { icons: ICONS, createIcons: createIcons };
})();
