function initTabsFlock(root) {
  var SPACE = 6;
  // Every bird takes its own height of arc.
  var LIFT = [10, 17, 8, 14, 20, 11];
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var dots = root.querySelectorAll('.tabs-flock__dot');
  var DOTS = dots.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var at = [];
  var raf = 0;
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function home(i, j) {
    var t = tabs[i];
    return t.offsetLeft + t.offsetWidth / 2 + (j - (DOTS - 1) / 2) * SPACE;
  }
  function draw() {
    at.forEach(function (p, j) {
      dots[j].style.transform = 'translate(' + p.x + 'px, ' + p.y + 'px)';
      dots[j].style.visibility = 'visible';
    });
  }
  // Place the flock under the active tab, and again once the font has loaded and the labels have their real widths.
  function place() {
    if (raf) return;
    at = [];
    for (var j = 0; j < DOTS; j++) at.push({ x: home(sel, j), y: 0 });
    draw();
  }
  function fly(to) {
    cancelAnimationFrame(raf);
    var from = at.map(function (p) { return { x: p.x, y: p.y }; });
    var dests = from.map(function (p, j) { return home(to, j); });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      raf = 0;
      at = dests.map(function (x) { return { x: x, y: 0 }; });
      return draw();
    }
    // The dot nearest the destination leaves first and the rest follow it, a beat apart.
    var right = dests[0] > from[0].x;
    var start = performance.now();
    function step(now) {
      var done = true;
      at = from.map(function (p, j) {
        var order = right ? DOTS - 1 - j : j;
        var t = Math.min(1, Math.max(0, (now - start - order * 45) / 560));
        if (t < 1) done = false;
        var e = ease(t);
        return { x: p.x + (dests[j] - p.x) * e, y: p.y * (1 - e) - LIFT[j % LIFT.length] * Math.sin(Math.PI * t) };
      });
      draw();
      raf = done ? 0 : requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function select(i) {
    if (i === sel) return;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    fly(i);
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

document.querySelectorAll('.tabs-flock').forEach(initTabsFlock);
