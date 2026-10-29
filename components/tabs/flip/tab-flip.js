function initTabsFlip(root) {
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
    // The panel you left stays visible, out of reach, while the new one comes in over it.
    panels.forEach(function (panel, k) {
      panel.hidden = k !== i && k !== prev;
      panel.toggleAttribute('data-on', k === i);
      panel.toggleAttribute('data-prev', k === prev);
      panel.inert = k === prev;
      if (k === prev) panel.setAttribute('aria-hidden', 'true');
      else panel.removeAttribute('aria-hidden');
    });
    root.setAttribute('data-armed', '');
    // The card turns one way going right and the other going left.
    root.style.setProperty('--tabs-flip-d', i > prev ? -1 : 1);
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
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-flip').forEach(initTabsFlip);
