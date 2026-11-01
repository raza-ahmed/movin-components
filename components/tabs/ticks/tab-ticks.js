function initTabsTicks(root) {
  var W = 264;
  var PITCH = 4;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var ticks = root.querySelectorAll('.tabs-ticks__tick');
  var COL = W / tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var c = sel * COL + COL / 2;
  var v = 0;
  var raf = 0;
  function smooth(a, b, x) {
    var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }
  // A crest the width of a tab: ticks inside it stand tall and bright, with soft shoulders at its edges.
  // It stretches a little with speed.
  function draw() {
    var half = COL / 2 - 8 + Math.min(18, Math.abs(v) * 0.025);
    ticks.forEach(function (t, k) {
      var f = 1 - smooth(half - 6, half + 6, Math.abs(k * PITCH + 1.5 - c));
      t.style.height = 4 + 9 * f + 'px';
      t.style.background = 'color-mix(in oklab, light-dark(#373a40, #f1f2f3) ' + Math.round(f * 100) + '%, light-dark(#dbdde1, #2e3035))';
    });
  }
  function run() {
    cancelAnimationFrame(raf);
    var goal = sel * COL + COL / 2;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      c = goal;
      v = 0;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-170 * (c - goal) - 23 * v) * dt;
      c += v * dt;
      if (Math.abs(c - goal) < 0.05 && Math.abs(v) < 0.5) {
        c = goal;
        v = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function select(i) {
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    run();
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var n = tabs.length;
    var next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs[next].focus();
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  return function () {
    cancelAnimationFrame(raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-ticks').forEach(initTabsTicks);
