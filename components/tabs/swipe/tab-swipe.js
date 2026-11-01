function initTabsSwipe(root) {
  var W = 260;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var line = root.querySelector('.tabs-swipe__line');
  var view = root.querySelector('.tabs-swipe__view');
  var strip = root.querySelector('.tabs-swipe__strip');
  var col = W / tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var dx = 0, drag = null;
  function draw() {
    // Past the first or last panel the drag meets resistance.
    var edge = (sel === 0 && dx > 0) || (sel === tabs.length - 1 && dx < 0);
    var shift = edge ? dx * 0.3 : dx;
    // Where the underline sits, in tabs: it follows the drag continuously.
    var at = Math.max(0, Math.min(tabs.length - 1, sel - shift / W));
    strip.style.transform = 'translateX(' + (-sel * W + shift) + 'px)';
    line.style.transform = 'translateX(' + (at * col + 18) + 'px)';
    // Each label brightens as the line approaches it.
    tabs.forEach(function (tab, k) {
      tab.style.color = 'color-mix(in oklab, light-dark(#373a40, #f1f2f3) ' + Math.round(Math.max(0, 1 - Math.abs(k - at)) * 100) + '%, light-dark(#5f626a, #a7abb2))';
    });
  }
  function select(i) {
    sel = Math.max(0, Math.min(tabs.length - 1, i));
    dx = 0;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === sel));
      tab.tabIndex = k === sel ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.inert = k !== sel; });
    draw();
  }
  function down(e) {
    view.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, samples: [{ t: e.timeStamp, x: e.clientX }] };
    root.classList.add('tabs-swipe--held');
  }
  function move(e) {
    if (!drag) return;
    dx = e.clientX - drag.x;
    drag.samples.push({ t: e.timeStamp, x: e.clientX });
    while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 100) drag.samples.shift();
    draw();
  }
  function end() {
    if (!drag) return;
    var s = drag.samples;
    drag = null;
    root.classList.remove('tabs-swipe--held');
    var v = s.length > 1 ? (s[s.length - 1].x - s[0].x) / Math.max(1, s[s.length - 1].t - s[0].t) : 0;
    // A long drag or a quick flick turns the page; anything else springs back.
    var step = dx < -W * 0.25 || v < -0.4 ? 1 : dx > W * 0.25 || v > 0.4 ? -1 : 0;
    select(sel + step);
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var n = tabs.length;
    var next = { ArrowRight: Math.min(n - 1, sel + 1), ArrowLeft: Math.max(0, sel - 1), Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs[next].focus();
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  view.addEventListener('pointerdown', down);
  view.addEventListener('pointermove', move);
  view.addEventListener('pointerup', end);
  view.addEventListener('pointercancel', end);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
    view.removeEventListener('pointerdown', down);
    view.removeEventListener('pointermove', move);
    view.removeEventListener('pointerup', end);
    view.removeEventListener('pointercancel', end);
  };
}

document.querySelectorAll('.tabs-swipe').forEach(initTabsSwipe);
