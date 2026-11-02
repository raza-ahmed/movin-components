function initTabsLasso(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var Y = 22;
  var RY = 14;
  var HAND = { x: 252, y: -34 };
  var ellipse = root.querySelector('.tabs-lasso__rope ellipse');
  var rope = root.querySelector('.tabs-lasso__rope path');
  var knot = root.querySelector('.tabs-lasso__knot');
  var raf = 0;
  // The loop sits snug round a label, a little wider than its text.
  function rest(i) { return { cx: i * COL + COL / 2, cy: Y, rx: tabs[i].textContent.length * 3.6 + 14, ry: RY }; }
  function io(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  // The loop at time k (0 to 1) of a throw from tab a to tab b: it loosens and lifts, flies over
  // spinning (its height pulses as it turns), drops round the new label wide open, then cinches.
  function throwAt(a, b, k) {
    var A = rest(a);
    var B = rest(b);
    var u;
    if (k < 0.15) {
      u = k / 0.15;
      return { cx: A.cx, cy: Y - 6 * u, rx: A.rx * (1 + 0.35 * u), ry: RY * (1 + 0.6 * u) };
    }
    if (k < 0.65) {
      u = (k - 0.15) / 0.5;
      var e = io(u);
      return { cx: A.cx + (B.cx - A.cx) * e, cy: Y - 6 - 24 * Math.sin(Math.PI * u), rx: (A.rx + (B.rx - A.rx) * e) * 1.35, ry: RY * 1.6 * (0.3 + 0.7 * Math.abs(Math.cos(Math.PI * 3 * u))) };
    }
    if (k < 0.8) {
      u = (k - 0.65) / 0.15;
      return { cx: B.cx, cy: Y - 6 + 6 * u, rx: B.rx * 1.35, ry: RY * 1.6 };
    }
    u = (k - 0.8) / 0.2;
    var back = 1 + 2.7 * Math.pow(u - 1, 3) + 1.7 * Math.pow(u - 1, 2);
    return { cx: B.cx, cy: Y, rx: B.rx * (1.35 - 0.35 * back), ry: RY * (1.6 - 0.6 * back) };
  }
  // The rope leaves the loop at its upper right, through the knot, and sags up to the hand off the corner.
  function draw(loop) {
    var kx = loop.cx + loop.rx * Math.cos(-0.45);
    var ky = loop.cy + loop.ry * Math.sin(-0.45);
    var sag = 4 + Math.hypot(HAND.x - kx, HAND.y - ky) * 0.03;
    ellipse.setAttribute('cx', loop.cx.toFixed(1));
    ellipse.setAttribute('cy', loop.cy.toFixed(1));
    ellipse.setAttribute('rx', loop.rx.toFixed(1));
    ellipse.setAttribute('ry', loop.ry.toFixed(1));
    rope.setAttribute('d', 'M' + kx.toFixed(1) + ' ' + ky.toFixed(1) + 'Q' + ((kx + HAND.x) / 2).toFixed(1) + ' ' + ((ky + HAND.y) / 2 + sag).toFixed(1) + ' ' + HAND.x + ' ' + HAND.y);
    knot.setAttribute('cx', kx.toFixed(1));
    knot.setAttribute('cy', ky.toFixed(1));
  }
  function toss(from, to) {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return draw(rest(to));
    var t0 = performance.now();
    function step(now) {
      var k = Math.min(1, (now - t0) / 900);
      draw(throwAt(from, to, k));
      if (k < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    toss(prev, i);
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
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

document.querySelectorAll('.tabs-lasso').forEach(initTabsLasso);
