function initTabsFilm(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var PITCH = 80;
  var MOVE = 150;
  var HOLD = 110;
  var strip = root.querySelector('.tabs-film__strip');
  var shutter = root.querySelector('.tabs-film__shutter');
  function xOf(f) { return 80 - f * PITCH; }
  // A projector moves film in steps: the strip jumps one frame, holds, jumps again, and the shutter
  // closes over the gate during each pull so only still frames are seen.
  function advance() {
    var x0 = new DOMMatrix(getComputedStyle(strip).transform).e;
    strip.getAnimations().forEach(function (a) { a.cancel(); });
    shutter.getAnimations().forEach(function (a) { a.cancel(); });
    var x1 = xOf(sel);
    strip.style.transform = 'translateX(' + x1 + 'px)';
    var steps = Math.ceil(Math.abs(x1 - x0) / PITCH - 0.01);
    if (!steps || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var dir = Math.sign(x1 - x0);
    var total = steps * (MOVE + HOLD) - HOLD;
    var frames = [];
    var blinks = [];
    var t = 0;
    var x = x0;
    for (var k = 0; k < steps; k++) {
      var nx = k === steps - 1 ? x1 : xOf(Math.round((80 - x) / PITCH) - dir);
      frames.push({ transform: 'translateX(' + x + 'px)', offset: t / total, easing: 'cubic-bezier(0.6, 0, 0.4, 1)' });
      blinks.push({ opacity: 0, offset: t / total }, { opacity: 0.85, offset: (t + MOVE * 0.25) / total }, { opacity: 0.85, offset: (t + MOVE * 0.75) / total });
      t += MOVE;
      frames.push({ transform: 'translateX(' + nx + 'px)', offset: t / total });
      blinks.push({ opacity: 0, offset: t / total });
      t += HOLD;
      x = nx;
    }
    strip.animate(frames, { duration: total });
    shutter.animate(blinks, { duration: total });
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
    advance();
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
    strip.getAnimations().forEach(function (a) { a.cancel(); });
    shutter.getAnimations().forEach(function (a) { a.cancel(); });
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-film').forEach(initTabsFilm);
