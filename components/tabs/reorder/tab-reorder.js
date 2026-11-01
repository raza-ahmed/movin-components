function initTabsReorder(root) {
  var list = root.querySelector('[role="tablist"]');
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var live = root.querySelector('.tabs-reorder__live');
  var drag = null;
  function tabs() { return Array.prototype.slice.call(list.querySelectorAll('[role="tab"]')); }
  function selected() { return list.querySelector('[aria-selected="true"]'); }
  function still() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function select(tab) {
    tabs().forEach(function (t) {
      t.setAttribute('aria-selected', String(t === tab));
      t.tabIndex = t === tab ? 0 : -1;
    });
    panels.forEach(function (panel) { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  }
  function announce(tab) {
    var all = tabs();
    live.textContent = tab.textContent.trim() + ', position ' + (all.indexOf(tab) + 1) + ' of ' + all.length;
  }
  function place() {
    drag.tab.style.transform = 'translateX(' + (drag.px - drag.grab - drag.tab.offsetLeft) + 'px)';
  }
  // Swap a tab with the one after it by moving that neighbour, never the tab being dragged,
  // and slide every tab that shifted from where it was.
  function swapAfter(tab) {
    var next = tab.nextElementSibling;
    var all = tabs();
    var was = all.map(function (t) { return t.offsetLeft; });
    list.insertBefore(next, tab);
    all.forEach(function (t, k) {
      if (drag && drag.tab === t) return;
      var dx = was[k] - t.offsetLeft;
      if (dx && !still()) t.animate([{ transform: 'translateX(' + dx + 'px)' }, { transform: 'none' }], { duration: 240, easing: 'cubic-bezier(0.3, 1.2, 0.5, 1)' });
    });
    if (drag) place();
  }
  function onMove(e) {
    if (!drag) return;
    if (!drag.moved && Math.abs(e.clientX - drag.startX) < 4) return;
    drag.moved = true;
    drag.tab.classList.add('tabs-reorder__tab--dragging');
    drag.px = e.clientX - list.getBoundingClientRect().left;
    place();
    // Past a neighbour's middle, swap with it.
    var el = drag.tab;
    var mid = drag.px - drag.grab + el.offsetWidth / 2;
    var prev = el.previousElementSibling, next = el.nextElementSibling;
    if (next && mid > next.offsetLeft + next.offsetWidth / 2) swapAfter(el);
    else if (prev && mid < prev.offsetLeft + prev.offsetWidth / 2) swapAfter(prev);
  }
  function onUp() {
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerup', onUp);
    removeEventListener('pointercancel', onUp);
    var d = drag;
    drag = null;
    if (!d) return;
    if (!d.moved) return select(d.tab);
    var from = d.tab.style.transform;
    d.tab.style.transform = '';
    d.tab.classList.remove('tabs-reorder__tab--dragging');
    if (!still()) d.tab.animate([{ transform: from }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.3, 1.3, 0.5, 1)' });
    announce(d.tab);
  }
  // Window listeners rather than pointer capture, so the drag carries on wherever the pointer goes.
  function onDown(e) {
    var tab = e.target.closest('[role="tab"]');
    if (!tab || e.button !== 0) return;
    var px = e.clientX - list.getBoundingClientRect().left;
    drag = { tab: tab, startX: e.clientX, grab: px - tab.offsetLeft, px: px, moved: false };
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    addEventListener('pointercancel', onUp);
  }
  function onClick(e) {
    // Enter and Space arrive as clicks with no pointer behind them.
    var tab = e.target.closest('[role="tab"]');
    if (tab && e.detail === 0) select(tab);
  }
  function onKeyDown(e) {
    var all = tabs();
    var tab = selected();
    var i = all.indexOf(tab);
    var n = all.length;
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      // Alt + arrow carries the selected tab along the row.
      e.preventDefault();
      if (e.key === 'ArrowRight' && i < n - 1) swapAfter(tab);
      else if (e.key === 'ArrowLeft' && i > 0) swapAfter(all[i - 1]);
      else return;
      tab.focus();
      announce(tab);
      return;
    }
    var next = { ArrowRight: (i + 1) % n, ArrowLeft: (i + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(all[next]);
    all[next].focus();
  }
  list.addEventListener('pointerdown', onDown);
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  return function () {
    onUp();
    list.removeEventListener('pointerdown', onDown);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-reorder').forEach(initTabsReorder);
