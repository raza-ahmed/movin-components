function initTabsFocus(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var labels = root.querySelectorAll('.tabs-focus__label');
  var mark = root.querySelector('.tabs-focus__mark');
  var hover = null;
  var s = { f: sel, v: 0 };
  var raf = 0;
  function draw() {
    mark.style.transform = 'translateX(' + (s.f * COL + COL / 2) + 'px)';
    labels.forEach(function (el, i) {
      var d = Math.abs(i - s.f);
      el.style.filter = 'blur(' + Math.min(0.9, d * 0.6).toFixed(2) + 'px)';
      el.style.opacity = String(1 - Math.min(0.2, d * 0.1));
      el.style.transform = 'scale(' + (1 - Math.min(0.08, d * 0.04)) + ')';
    });
  }
  // Depth of field across the row: each label softens with its distance from the plane of focus,
  // and racking focus to a tab sweeps that plane across, sharpening each label as it passes.
  // Pointing at a tab racks to it for a look; letting go racks back.
  function rack() {
    cancelAnimationFrame(raf);
    var goal = hover === null ? sel : hover;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s = { f: goal, v: 0 };
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-110 * (s.f - goal) - 20 * s.v) * dt;
      s.f += s.v * dt;
      if (Math.abs(s.f - goal) < 0.002 && Math.abs(s.v) < 0.01) {
        s = { f: goal, v: 0 };
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function onEnter(e) {
    if (e.pointerType !== 'mouse') return;
    hover = tabs.indexOf(e.currentTarget);
    rack();
  }
  function onLeave() {
    hover = null;
    rack();
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
    rack();
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
  tabs.forEach(function (tab) { tab.addEventListener('pointerenter', onEnter); });
  list.addEventListener('pointerleave', onLeave);
  return function () {
    cancelAnimationFrame(raf);
    tabs.forEach(function (tab) { tab.removeEventListener('pointerenter', onEnter); });
    list.removeEventListener('pointerleave', onLeave);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-focus').forEach(initTabsFocus);
