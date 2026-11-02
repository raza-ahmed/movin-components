function initTabsPreview(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var W = 240;
  var COL = W / n;
  var TOP = 84;
  // A sketch of each page for the hover card: its size, then rows of [width %, kind].
  var PAGES = [
    { w: 132, h: 66, rows: [[70, 'head'], [92, 'line'], [60, 'line'], [100, 'box']] },
    { w: 156, h: 74, rows: [[50, 'head'], [100, 'cols']] },
    { w: 118, h: 70, rows: [[60, 'head'], [90, 'line'], [80, 'line'], [86, 'line'], [50, 'line']] },
    { w: 144, h: 62, rows: [[100, 'box'], [75, 'head'], [55, 'line']] },
  ];
  var card = root.querySelector('.tabs-preview__card');
  var nub = root.querySelector('.tabs-preview__nub');
  var under = root.querySelector('.tabs-preview__line-under');
  var peek = { i: 0, on: false };
  var timer = 0;
  // The card glides and resizes to the tab's page; its sketch is redrawn so it fades in anew.
  function show() {
    var p = PAGES[peek.i];
    card.style.left = Math.max(0, Math.min(W - p.w, peek.i * COL + COL / 2 - p.w / 2)) + 'px';
    card.style.top = TOP - p.h + 'px';
    card.style.width = p.w + 'px';
    card.style.height = p.h + 'px';
    card.classList.toggle('tabs-preview__card--on', peek.on);
    nub.style.left = peek.i * COL + COL / 2 + 'px';
    nub.classList.toggle('tabs-preview__nub--on', peek.on);
  }
  function sketch() {
    var page = document.createElement('div');
    page.className = 'tabs-preview__page';
    PAGES[peek.i].rows.forEach(function (row) {
      var el = document.createElement('span');
      el.className = 'tabs-preview__' + row[1];
      if (row[1] === 'cols') el.innerHTML = '<span></span><span></span><span></span>';
      else el.style.width = row[0] + '%';
      page.appendChild(el);
    });
    card.replaceChild(page, card.firstElementChild);
  }
  function peekAt(i) {
    var moved = i !== peek.i;
    peek = { i: i, on: true };
    if (moved) sketch();
    show();
  }
  // The first hover waits a moment before the card shows; after that it follows at once from tab to tab.
  function onEnter(e) {
    if (e.pointerType !== 'mouse') return;
    var i = tabs.indexOf(e.currentTarget);
    clearTimeout(timer);
    if (peek.on) return peekAt(i);
    timer = setTimeout(function () { peekAt(i); }, 160);
  }
  function onLeave() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      peek.on = false;
      show();
    }, 120);
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
    under.style.left = i * COL + 14 + 'px';
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
  tabs.forEach(function (tab) { tab.addEventListener('pointerenter', onEnter); });
  list.addEventListener('pointerleave', onLeave);
  return function () {
    clearTimeout(timer);
    tabs.forEach(function (tab) { tab.removeEventListener('pointerenter', onEnter); });
    list.removeEventListener('pointerleave', onLeave);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-preview').forEach(initTabsPreview);
