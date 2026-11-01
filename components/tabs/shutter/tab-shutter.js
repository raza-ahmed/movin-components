function initTabsShutter(root) {
  var R = 20;
  var C = 22;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var name = root.querySelector('.tabs-shutter__name');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var amt = tabs.map(function (_, i) { return i === sel ? 1 : 0; });
  var raf = 0;
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /** The blades as one shape: the disc with a turning hexagonal hole, plus the seams between the six blades. */
  function iris(a) {
    var h = R * 1.3 * (1 - a);
    var rot = (a * Math.PI) / 3;
    var v = [];
    for (var k = 0; k < 6; k++) v.push([C + h * Math.cos(rot + (k * Math.PI) / 3), C + h * Math.sin(rot + (k * Math.PI) / 3)]);
    var seams = v.map(function (p, k) {
      var n = v[(k + 1) % 6];
      var len = Math.hypot(n[0] - p[0], n[1] - p[1]) || 1;
      return 'M' + p[0] + ' ' + p[1] + 'L' + (p[0] + ((n[0] - p[0]) / len) * R * 2.2) + ' ' + (p[1] + ((n[1] - p[1]) / len) * R * 2.2);
    });
    var hole = 'M' + v.map(function (p) { return p.join(' '); }).join('L') + 'Z';
    var disc = 'M' + (C - R - 2) + ' ' + C + 'a' + (R + 2) + ' ' + (R + 2) + ' 0 1 0 ' + (2 * R + 4) + ' 0a' + (R + 2) + ' ' + (R + 2) + ' 0 1 0 ' + (-2 * R - 4) + ' 0Z';
    return { d: disc + hole, seams: seams.join('') };
  }
  function draw() {
    tabs.forEach(function (tab, i) {
      var a = amt[i];
      var g = tab.querySelector('g[clip-path]');
      // The blades only exist while they are at least partly closed.
      if (a > 0.001) {
        var b = iris(a);
        if (!g) {
          g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('clip-path', 'url(#tabs-shutter-lens-' + i + ')');
          g.innerHTML = '<path class="tabs-shutter__blades"></path><path class="tabs-shutter__seams"></path>';
          tab.querySelector('.tabs-shutter__rim').after(g);
        }
        g.firstElementChild.setAttribute('d', b.d);
        g.lastElementChild.setAttribute('d', b.seams);
        g.lastElementChild.style.opacity = Math.min(1, (1 - a) * 4);
      } else if (g) {
        g.remove();
      }
      tab.classList.toggle('tabs-shutter__tab--closed', a > 0.6);
    });
  }
  // The new tab's blades close and the old tab's open, over the same short beat.
  function select(i) {
    if (i === sel) return;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    name.textContent = tabs[i].getAttribute('aria-label');
    cancelAnimationFrame(raf);
    var from = amt.slice();
    var to = tabs.map(function (_, k) { return k === i ? 1 : 0; });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      amt = to;
      return draw();
    }
    var start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / 420);
      amt = from.map(function (a, k) { return a + (to[k] - a) * ease(t); });
      draw();
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
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

document.querySelectorAll('.tabs-shutter').forEach(initTabsShutter);
