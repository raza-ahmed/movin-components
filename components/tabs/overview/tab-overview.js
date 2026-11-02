function initTabsOverview(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var W = 240;
  var H = 120;
  var GAP = 24;
  var ZOOM = 0.36;
  var track = root.querySelector('.tabs-overview__track');
  function cx(i) { return i * (W + GAP) + W / 2; }
  function view(s, c) { return 'translate(' + W / 2 + 'px, ' + H / 2 + 'px) scale(' + s + ') translate(' + -c + 'px, ' + -H / 2 + 'px)'; }
  // Switching pulls back to show every panel side by side, slides along to the new one and zooms in
  // on it. It starts from wherever the view is, so a quick second pick carries on smoothly.
  function travel() {
    var m = new DOMMatrix(getComputedStyle(track).transform);
    var s0 = m.a || 1;
    var c0 = (W / 2 - m.e) / s0;
    track.getAnimations().forEach(function (a) { a.cancel(); });
    var c1 = cx(sel);
    track.style.transform = view(1, c1);
    if (Math.abs(c0 - c1) < 1 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    track.animate(
      [
        { transform: view(s0, c0), easing: 'ease-in-out' },
        { transform: view(ZOOM, c0), offset: 0.3, easing: 'ease-in-out' },
        { transform: view(ZOOM, c1), offset: 0.68, easing: 'ease-in-out' },
        { transform: view(1, c1) },
      ],
      { duration: 950 }
    );
  }

  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    // Every panel stays laid out so the overview can show them all; only the chosen one is exposed.
    panels.forEach(function (panel, k) {
      panel.setAttribute('aria-hidden', String(k !== i));
      panel.inert = k !== i;
    });
    travel();
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
    track.getAnimations().forEach(function (a) { a.cancel(); });
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-overview').forEach(initTabsOverview);
