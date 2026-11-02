function initTabsDrop(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var timer = 0;
  var out = -1;
  function settle(replay) {
    panels.forEach(function (panel, k) {
      panel.classList.remove('tabs-drop__panel--in', 'tabs-drop__panel--out');
      // Reading a layout value between removing and adding a class restarts its animation.
      if (replay) void panel.offsetWidth;
      panel.classList.toggle('tabs-drop__panel--in', k === sel);
      panel.classList.toggle('tabs-drop__panel--out', k === out);
      if (k === out) panel.setAttribute('aria-hidden', 'true');
      else panel.removeAttribute('aria-hidden');
      panel.hidden = k !== sel && k !== out;
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
    // The old panel falls out of the bottom tipping over while the new one drops in and bounces.
    out = prev;
    settle(true);
    clearTimeout(timer);
    timer = setTimeout(function () {
      out = -1;
      panels[prev].classList.remove('tabs-drop__panel--out');
      panels[prev].removeAttribute('aria-hidden');
      panels[prev].hidden = prev !== sel;
    }, 450);
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
    clearTimeout(timer);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-drop').forEach(initTabsDrop);
