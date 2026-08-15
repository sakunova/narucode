/*!
 * narucode-timing.js — 一時的な診断用。原因が判明したら削除する。
 *
 * なぜ必要か:
 *   「Safari で開くと数分かかる」という報告に対し、通信（全リソース23〜63ms）も
 *   描画（ぼかし有無で60fps据え置き）も実機計測でシロだった。
 *   残るのは「ホームを実際に開いた時に何が起きているか」なので、
 *   開いた実績を localStorage に残し、/diag/ から読めるようにする。
 *
 *   特に見たいのは:
 *     - ページ自身の所要時間が短いのに体感が数分 → 遅れはページの外（Safari の起動・
 *       メモ帳からの受け渡し等）にあり、サイトは無罪
 *     - longtask が積み上がっている → JS が主スレッドを占有している
 *
 * 外部通信はしない。記録は端末内にだけ残る。
 */
(function () {
  "use strict";
  if (!window.performance || !window.localStorage) return;

  var KEY = "narucode_timing_log";
  var MAX = 8;
  var longTasks = [];

  try {
    if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes &&
        PerformanceObserver.supportedEntryTypes.indexOf("longtask") >= 0) {
      new PerformanceObserver(function (list) {
        var e = list.getEntries();
        for (var i = 0; i < e.length; i++) {
          longTasks.push({ s: Math.round(e[i].startTime), d: Math.round(e[i].duration) });
        }
      }).observe({ type: "longtask", buffered: true });
    }
  } catch (e) { /* 未対応ブラウザは無視 */ }

  function record() {
    try {
      var n = performance.getEntriesByType("navigation")[0] || {};
      var fcp = null;
      var paints = performance.getEntriesByType("paint");
      for (var i = 0; i < paints.length; i++) {
        if (paints[i].name === "first-contentful-paint") fcp = Math.round(paints[i].startTime);
      }
      var res = performance.getEntriesByType("resource") || [];
      var slowest = null;
      for (var j = 0; j < res.length; j++) {
        if (!slowest || res[j].duration > slowest.duration) slowest = res[j];
      }

      var big = 0;
      for (var k = 0; k < longTasks.length; k++) big += longTasks[k].d;

      var rec = {
        // ナビゲーションが始まった絶対時刻。体感の待ち時間と突き合わせるために必要。
        started: new Date(performance.timeOrigin || Date.now()).toString(),
        page: location.pathname,
        // ページ内の実所要時間
        ttfb: Math.round((n.responseStart || 0) - (n.requestStart || 0)),
        htmlDone: Math.round(n.responseEnd || 0),
        fcp: fcp,
        domReady: Math.round(n.domContentLoadedEventEnd || 0),
        loaded: Math.round(n.loadEventEnd || 0),
        proto: n.nextHopProtocol || "",
        type: n.type || "",
        redirects: n.redirectCount || 0,
        resources: res.length,
        slowest: slowest ? (slowest.name.split("/").pop().slice(0, 28) + " " + Math.round(slowest.duration) + "ms") : "-",
        // JS が主スレッドを塞いだ合計
        longTaskCount: longTasks.length,
        longTaskTotal: big,
        longTaskTop: longTasks.slice().sort(function (a, b) { return b.d - a.d; }).slice(0, 4),
        // スクリプトが動き出した時点で、ナビ開始から何ms経っていたか
        scriptAt: Math.round(performance.now()),
      };

      var log = [];
      try { log = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { log = []; }
      log.push(rec);
      while (log.length > MAX) log.shift();
      localStorage.setItem(KEY, JSON.stringify(log));
    } catch (e) { /* 記録に失敗しても本体の邪魔はしない */ }
  }

  // load 後、遅れて来る longtask も拾ってから記録する
  function schedule() { setTimeout(record, 3000); }
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule);
})();
