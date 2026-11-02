function initTabsArc(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var NODE_Y = 12;
  var path = root.querySelector('.tabs-arc__bolt path');
  var raf = 0;
  function nodeX(i) { return i * COL + COL / 2; }
  // A jagged arc from one node to the other, bowed upwards, with a short fork off one of its kinks.
  function bolt(x0, x1) {
    var dx = x1 - x0;
    var h = 16 + Math.abs(dx) * 0.12;
    var steps = 10 + Math.round(Math.abs(dx) / 12);
    var main = '';
    var fork = '';
    var at = 2 + Math.floor(Math.random() * (steps - 4));
    for (var k = 0; k <= steps; k++) {
      var t = k / steps;
      var kick = (Math.random() - 0.5) * 9 * Math.sin(Math.PI * t);
      var x = x0 + dx * t + kick * 0.4;
      var y = NODE_Y - 4 * h * t * (1 - t) + kick;
      main += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      if (k === at) fork = 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'l' + ((Math.random() - 0.5) * 12).toFixed(1) + ' ' + (-6 - Math.random() * 6).toFixed(1) + 'l' + ((Math.random() - 0.5) * 8).toFixed(1) + ' -4';
    }
    return main + fork;
  }
  // The current jumps from the old source to the new one: the bolt is redrawn every few frames
  // for a third of a second, flickering, then the new node lights.
  function strike(from, to) {
    cancelAnimationFrame(raf);
    path.setAttribute('d', '');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var t0 = performance.now();
    var last = 0;
    function step(now) {
      if (now - t0 > 360) return path.setAttribute('d', '');
      if (now - last > 40) {
        last = now;
        path.setAttribute('d', bolt(nodeX(from), nodeX(to)));
        path.style.opacity = String(0.55 + Math.random() * 0.45);
      }
      raf = requestAnimationFrame(step);
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
    strike(prev, i);
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

document.querySelectorAll('.tabs-arc').forEach(initTabsArc);
