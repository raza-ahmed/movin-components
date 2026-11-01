function initTabsMeasure(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var svg = root.querySelector('.tabs-measure__dim');
  var ext = svg.querySelector('.tabs-measure__ext');
  var line = svg.querySelector('.tabs-measure__line');
  var tag = svg.querySelector('.tabs-measure__tag');
  var num = svg.querySelector('.tabs-measure__num');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var s = { l: 0, r: 0, vl: 0, vr: 0, y: 0 };
  var raf = 0;
  function edges(i) {
    var t = tabs[i];
    return { l: t.offsetLeft, r: t.offsetLeft + t.offsetWidth, y: t.offsetTop + t.offsetHeight + 16 };
  }
  // Extension lines drop from the tab's edges to a dimension line, labelled with the width it spans.
  function draw() {
    var w = Math.round(s.r - s.l);
    var tw = String(w).length * 6 + 8;
    ext.setAttribute('d', 'M' + s.l + ' ' + (s.y - 22) + 'V' + (s.y + 4) + 'M' + s.r + ' ' + (s.y - 22) + 'V' + (s.y + 4));
    line.setAttribute('d', 'M' + s.l + ' ' + s.y + 'H' + s.r + 'M' + s.l + ' ' + (s.y - 3.5) + 'v7M' + s.r + ' ' + (s.y - 3.5) + 'v7');
    tag.setAttribute('x', (s.l + s.r) / 2 - tw / 2);
    tag.setAttribute('y', s.y + 6);
    tag.setAttribute('width', tw);
    num.setAttribute('x', (s.l + s.r) / 2);
    num.setAttribute('y', s.y + 15.5);
    num.textContent = w;
    svg.style.visibility = 'visible';
  }
  function place() {
    if (raf) return;
    var g = edges(sel);
    s.l = g.l;
    s.r = g.r;
    s.y = g.y;
    draw();
  }
  // Each end of the line runs on its own spring, so the number counts through every width on the way.
  function run() {
    cancelAnimationFrame(raf);
    var g = edges(sel);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      raf = 0;
      return place();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.vl += (-170 * (s.l - g.l) - 24 * s.vl) * dt;
      s.vr += (-170 * (s.r - g.r) - 24 * s.vr) * dt;
      s.l += s.vl * dt;
      s.r += s.vr * dt;
      s.y = g.y;
      if (Math.abs(s.l - g.l) < 0.05 && Math.abs(s.r - g.r) < 0.05 && Math.abs(s.vl) + Math.abs(s.vr) < 1) {
        s.vl = s.vr = 0;
        raf = 0;
        return place();
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
  place();
  if (document.fonts) document.fonts.ready.then(place);
  return function () {
    cancelAnimationFrame(raf);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-measure').forEach(initTabsMeasure);
