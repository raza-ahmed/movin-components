function initTabsStories(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var pause = root.querySelector('.tabs-stories__pause');
  var icon = pause.querySelector('path');
  var fills = tabs.map(function (tab) { return tab.querySelector('.tabs-stories__fill'); });
  function select(i) {
    // Armed on the first change, so nothing animates on load.
    root.setAttribute('data-armed', '');
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    // Bars before the current story stay full.
    fills.forEach(function (fill, k) { fill.style.setProperty('--tabs-stories-done', k < i ? 1 : 0); });
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
  // The bar fills while the story plays; when it is full the next story starts.
  function onFilled(e) {
    if (e.target.classList.contains('tabs-stories__fill')) select((sel + 1) % tabs.length);
  }
  function onPause() {
    var paused = !root.hasAttribute('data-paused');
    root.toggleAttribute('data-paused', paused);
    pause.setAttribute('aria-label', paused ? 'Play stories' : 'Pause stories');
    icon.setAttribute('d', paused ? 'M3 1.5v9l7.5-4.5Z' : 'M2.5 1.5h2.5v9H2.5ZM7 1.5h2.5v9H7Z');
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  list.addEventListener('animationend', onFilled);
  pause.addEventListener('click', onPause);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
    list.removeEventListener('animationend', onFilled);
    pause.removeEventListener('click', onPause);
  };
}

document.querySelectorAll('.tabs-stories').forEach(initTabsStories);
