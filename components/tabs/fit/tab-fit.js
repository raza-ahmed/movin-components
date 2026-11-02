function initTabsFit(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var box = root.querySelector('.tabs-fit__box');
  var line = root.querySelector('.tabs-fit__line');
  var timer = 0;
  var out = -1;
  function settle() {
    panels.forEach(function (panel, k) {
      panel.classList.toggle('tabs-fit__panel--out', k === out);
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
    // The old panel blurs out on top while the new rows come in; the box eases to the new panel's height.
    out = prev;
    settle();
    box.style.height = panels[i].offsetHeight + 'px';
    line.style.left = i * COL + 16 + 'px';
    clearTimeout(timer);
    timer = setTimeout(function () {
      out = -1;
      settle();
    }, 220);
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
  box.style.height = panels[sel].offsetHeight + 'px';
  return function () {
    clearTimeout(timer);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-fit').forEach(initTabsFit);
