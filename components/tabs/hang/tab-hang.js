function initTabsHang(root) {
  var W = 264;
  var PANEL = 200;
  var DROP = 34;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var hook = root.querySelector('.tabs-hang__hook');
  var cords = root.querySelectorAll('.tabs-hang__cord');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var s = { hook: 0, hv: 0, angle: 0, av: 0 };
  var raf = 0;
  function target(i) { return tabs[i].offsetLeft + tabs[i].offsetWidth / 2; }

  // Draws the hook, the two cords to the panel's top corners, and turns the panel to the swing angle.
  function draw() {
    // The panel drifts a third of the way towards the hook, so the cords never lie flat.
    var shift = (s.hook - W / 2) * 0.34;
    panels[sel].style.transform = 'translateX(' + shift + 'px) rotate(' + s.angle + 'rad)';
    // The panel turns about a point DROP above its top centre; its corners swing with it.
    [-PANEL / 2 + 16, PANEL / 2 - 16].forEach(function (dx, k) {
      var x = W / 2 + shift + dx * Math.cos(s.angle) - DROP * Math.sin(s.angle);
      var y = dx * Math.sin(s.angle) + DROP * Math.cos(s.angle);
      cords[k].setAttribute('d', 'M' + s.hook + ' 0L' + x + ' ' + y);
    });
    hook.setAttribute('cx', s.hook);
  }
  // The hook slides on a spring; the panel is a pendulum, pushed by how hard the hook accelerates.
  function run() {
    cancelAnimationFrame(raf);
    var goal = target(sel);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s = { hook: goal, hv: 0, angle: 0, av: 0 };
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      var acc = -150 * (s.hook - goal) - 20 * s.hv;
      s.hv += acc * dt;
      s.hook += s.hv * dt;
      s.av += (-30 * Math.sin(s.angle) - 3.4 * s.av - acc * 0.0024) * dt;
      s.angle += s.av * dt;
      if (Math.abs(s.hook - goal) < 0.05 && Math.abs(s.hv) < 0.5 && Math.abs(s.angle) < 0.0008 && Math.abs(s.av) < 0.002) {
        s = { hook: goal, hv: 0, angle: 0, av: 0 };
        raf = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function select(i) {
    if (i === sel) return;
    panels[sel].style.transform = '';
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
  function place() {
    if (raf) return;
    s.hook = target(sel);
    draw();
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

document.querySelectorAll('.tabs-hang').forEach(initTabsHang);
