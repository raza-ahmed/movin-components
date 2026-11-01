function initTabsScroller(root) {
  var scroll = root.querySelector('.tabs-scroller__scroll');
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var pill = root.querySelector('.tabs-scroller__pill');
  var arrows = root.querySelectorAll('.tabs-scroller__arrow');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  function smooth() { return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }
  // Fade an edge and show its arrow only where there is more row to see.
  function edges() {
    var start = scroll.scrollLeft < 2;
    var end = scroll.scrollLeft > scroll.scrollWidth - scroll.clientWidth - 2;
    scroll.style.setProperty('--tabs-scroller-l', start ? '0px' : '40px');
    scroll.style.setProperty('--tabs-scroller-r', end ? '0px' : '40px');
    arrows[0].toggleAttribute('data-hidden', start);
    arrows[1].toggleAttribute('data-hidden', end);
  }
  function place() {
    var t = tabs[sel];
    pill.style.left = t.offsetLeft + 'px';
    pill.style.width = t.offsetWidth + 'px';
  }
  function select(i) {
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    place();
    // The chosen tab glides to the middle of the row.
    var t = tabs[i];
    scroll.scrollTo({ left: t.offsetLeft + t.offsetWidth / 2 - scroll.clientWidth / 2, behavior: smooth() });
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var n = tabs.length;
    var next = { ArrowRight: Math.min(n - 1, sel + 1), ArrowLeft: Math.max(0, sel - 1), Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs[next].focus({ preventScroll: true });
  }
  // Pointer conveniences; keyboard users move along the tabs with the arrow keys.
  function back() { scroll.scrollBy({ left: -160, behavior: smooth() }); }
  function on() { scroll.scrollBy({ left: 160, behavior: smooth() }); }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  scroll.addEventListener('scroll', edges);
  arrows[0].addEventListener('click', back);
  arrows[1].addEventListener('click', on);
  place();
  edges();
  if (document.fonts) document.fonts.ready.then(function () { place(); edges(); });
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
    scroll.removeEventListener('scroll', edges);
    arrows[0].removeEventListener('click', back);
    arrows[1].removeEventListener('click', on);
  };
}

document.querySelectorAll('.tabs-scroller').forEach(initTabsScroller);
