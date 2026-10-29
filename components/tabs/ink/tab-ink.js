function initTabsInk(root) {
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
    // From the keyboard the ink starts in the middle of the tab.
    tabs[next].style.removeProperty('--tabs-ink-x');
    tabs[next].style.removeProperty('--tabs-ink-y');
    select(next);
    tabs[next].focus();
  }
  function onPointerDown(e) {
    var tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    // The ink starts where you pressed.
    var r = tab.getBoundingClientRect();
    tab.style.setProperty('--tabs-ink-x', e.clientX - r.left + 'px');
    tab.style.setProperty('--tabs-ink-y', e.clientY - r.top + 'px');
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  list.addEventListener('pointerdown', onPointerDown);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
    list.removeEventListener('pointerdown', onPointerDown);
  };
}

document.querySelectorAll('.tabs-ink').forEach(initTabsInk);
