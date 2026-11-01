function initTabsString(root) {
  var W = 260, Y = 6, SAG = 6;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var line = root.querySelector('.tabs-string__line');
  var bead = root.querySelector('.tabs-string__bead');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  function centre(i) { return ((i + 0.5) * W) / tabs.length; }
  var m = { x: centre(sel), vx: 0, s: SAG, vs: 0, raf: 0 };
  function draw() {
    line.setAttribute('points', '3,' + Y + ' ' + m.x + ',' + (Y + m.s) + ' ' + (W - 3) + ',' + Y);
    bead.setAttribute('cx', m.x);
    bead.setAttribute('cy', Y + m.s);
  }
  function travel() {
    var target = centre(sel);
    cancelAnimationFrame(m.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      m.x = target;
      m.s = SAG;
      draw();
      return;
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      for (var k = 0; k < 4; k++) {
        var h = dt / 4;
        m.vx += (-170 * (m.x - target) - 22 * m.vx) * h;
        m.x += m.vx * h;
        // The bead rides up the string as it speeds along; when it slows, the sag snaps back and rings.
        var lift = Math.min(SAG + 2, Math.abs(m.vx) / 90);
        m.vs += (-900 * (m.s - (SAG - lift)) - 7 * m.vs) * h;
        m.s += m.vs * h;
      }
      draw();
      if (Math.abs(m.x - target) < 0.05 && Math.abs(m.vx) < 0.5 && Math.abs(m.s - SAG) < 0.03 && Math.abs(m.vs) < 0.5) {
        m.raf = 0;
        return;
      }
      m.raf = requestAnimationFrame(step);
    }
    m.raf = requestAnimationFrame(step);
  }
  function select(i) {
    if (i === sel) return;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    travel();
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
    cancelAnimationFrame(m.raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-string').forEach(initTabsString);
