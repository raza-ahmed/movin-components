function initTabsTape(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  // A new strip each time, so its animation starts over: it peels off the old tag and lays on the new one.
  function strip(tab, mode) {
    var el = document.createElement('span');
    el.className = 'tabs-tape__strip tabs-tape__strip--' + mode;
    el.setAttribute('aria-hidden', 'true');
    el.appendChild(document.createElement('span'));
    tab.insertBefore(el, tab.firstChild);
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
    tabs.forEach(function (tab) {
      var old = tab.querySelector('.tabs-tape__strip');
      if (old) tab.removeChild(old);
    });
    strip(tabs[prev], 'peel');
    strip(tabs[i], 'lay');
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

document.querySelectorAll('.tabs-tape').forEach(initTabsTape);
