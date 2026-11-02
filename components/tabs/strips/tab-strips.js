function initTabsStrips(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var W = 240;
  var NARROW = 30;
  var GAP = 4;
  var WIDE = W - (n - 1) * (NARROW + GAP);
  // The open strip is wide and the rest narrow; each strip's left and width transition in the CSS.
  function layout() {
    var x = 0;
    tabs.forEach(function (tab, k) {
      var w = k === sel ? WIDE : NARROW;
      tab.style.left = x + 'px';
      tab.style.width = w + 'px';
      if (k === sel) panels.forEach(function (p) { p.style.left = x + 9 + 'px'; });
      x += w + GAP;
    });
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
    layout();
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
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-strips').forEach(initTabsStrips);
