function initTabsRise(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var rule = root.querySelector('.tabs-rise__rule');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var leaving = null, timer;
  // Each letter is a column of three rows (muted, lit, muted); data-row picks which shows.
  function rows() {
    tabs.forEach(function (tab, k) {
      tab.setAttribute('data-row', k === sel ? 1 : k === leaving ? 2 : 0);
      // Back to the first row without being seen: the lowest row and the first are the same muted letter.
      if (k !== sel && k !== leaving) tab.setAttribute('data-reset', '');
      else tab.removeAttribute('data-reset');
    });
  }
  function measure() {
    var t = tabs[sel];
    rule.style.left = t.offsetLeft + 4 + 'px';
    rule.style.width = t.offsetWidth - 8 - 0.16 * 12 + 'px';
  }
  function select(i) {
    if (i === sel) return;
    clearTimeout(timer);
    // The tab just left keeps rolling upward to its last row, then resets out of sight.
    leaving = sel;
    var letters = tabs[sel].getAttribute('aria-label').length;
    sel = i;
    timer = setTimeout(function () {
      leaving = null;
      rows();
    }, 600 + 28 * letters + 50);
    rows();
    measure();
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
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  measure();
  if (document.fonts) document.fonts.ready.then(measure);
  return function () {
    clearTimeout(timer);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-rise').forEach(initTabsRise);
