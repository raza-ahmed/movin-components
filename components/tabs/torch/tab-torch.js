function initTabsTorch(root) {
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
    root.style.setProperty('--tabs-torch-i', i);
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
  function onPointerMove(e) {
    // The torch follows the pointer along the row.
    var r = list.getBoundingClientRect();
    list.style.setProperty('--tabs-torch-x', Math.round(e.clientX - r.left) + 'px');
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  list.addEventListener('pointermove', onPointerMove);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
    list.removeEventListener('pointermove', onPointerMove);
  };
}

document.querySelectorAll('.tabs-torch').forEach(initTabsTorch);
