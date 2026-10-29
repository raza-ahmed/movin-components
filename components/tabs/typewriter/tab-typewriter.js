function initTabsTypewriter(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var timer;
  var lines = Array.prototype.map.call(panels, function (panel) { return panel.querySelector('[aria-hidden="true"]'); });
  var carets = lines.map(function (line) { return line.querySelector('.tabs-typewriter__caret'); });
  var texts = Array.prototype.map.call(panels, function (panel) { return panel.querySelector('.tabs-typewriter__sr').textContent; });
  function show(k, typed) {
    lines[k].replaceChildren(texts[k].slice(0, typed), carets[k]);
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
    // Screen readers get the whole sentence at once; the typing is for the eyes only.
    clearTimeout(timer);
    show(prev, 0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show(i, texts[i].length);
      return;
    }
    var typed = 0;
    (function type() {
      show(i, typed);
      if (typed++ < texts[i].length) timer = setTimeout(type, 24);
    })();
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
  return function () {
    clearTimeout(timer);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-typewriter').forEach(initTabsTypewriter);
