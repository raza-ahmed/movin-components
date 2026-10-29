function initTabsDock(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
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
  // Magnify by distance from the pointer: the icon under it grows most, its neighbours a little.
  function magnify(x) {
    tabs.forEach(function (tab) {
      var r = tab.getBoundingClientRect();
      var d = x === null ? Infinity : Math.abs(x - (r.left + r.width / 2));
      tab.style.setProperty('--tabs-dock-s', (1 + 0.45 * Math.max(0, 1 - d / 90)).toFixed(3));
    });
  }
  function onPointerMove(e) {
    if (e.pointerType === 'mouse') magnify(e.clientX);
  }
  function onPointerLeave() {
    magnify(null);
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  list.addEventListener('pointermove', onPointerMove);
  list.addEventListener('pointerleave', onPointerLeave);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
    list.removeEventListener('pointermove', onPointerMove);
    list.removeEventListener('pointerleave', onPointerLeave);
  };
}

document.querySelectorAll('.tabs-dock').forEach(initTabsDock);
