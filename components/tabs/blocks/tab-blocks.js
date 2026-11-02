function initTabsBlocks(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COLS = 12;
  var ROWS = 2;
  // A scatter that is the same every time.
  function jitter(c, r) { return ((c * 7 + r * 5) % COLS) / COLS; }
  // A fresh bed under a tab, so its blocks' animations start over: they land, crumble, or there are none.
  function bed(tab, mode) {
    var el = document.createElement('span');
    el.className = 'tabs-blocks__bed' + (mode ? ' tabs-blocks__bed--' + mode : '');
    el.setAttribute('aria-hidden', 'true');
    for (var k = 0; mode && k < ROWS * COLS; k++) {
      var r = Math.floor(k / COLS);
      var c = k % COLS;
      var j = jitter(c, r);
      var block = document.createElement('span');
      block.className = 'tabs-blocks__block' + ((c + r) % 3 === 0 ? ' tabs-blocks__block--dim' : '');
      block.style.animationDelay = Math.round(mode === 'land' ? (ROWS - 1 - r) * 140 + j * 260 : j * 160) + 'ms';
      block.style.setProperty('--spin', (j - 0.5) * 90 + 'deg');
      el.appendChild(block);
    }
    tab.replaceChild(el, tab.querySelector('.tabs-blocks__bed'));
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
    tabs.forEach(function (tab, k) { bed(tab, k === i ? 'land' : k === prev ? 'crumble' : ''); });
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

document.querySelectorAll('.tabs-blocks').forEach(initTabsBlocks);
