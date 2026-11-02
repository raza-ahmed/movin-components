function initTabsChalk(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var eraser = root.querySelector('.tabs-chalk__eraser');
  // The eraser rubs the old line out, three quick strokes, and lifts away.
  function rub(from) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var x = from * COL + COL / 2 - 13;
    var y = 41;
    function at(dx, dy, o) {
      return { transform: 'translate(' + (x + dx) + 'px, ' + (y + (dy || 0)) + 'px) rotate(' + dx / 6 + 'deg)', opacity: o === undefined ? 1 : o };
    }
    eraser.animate([at(-30, -8, 0), at(-28), at(28), at(-24), at(24), at(0, -14, 0)], { duration: 620, easing: 'ease-in-out' });
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
    // A lesson once underlined keeps a faint smudge after the line is rubbed out.
    tabs[i].classList.add('tabs-chalk__tab--used');
    rub(prev);
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
    eraser.getAnimations().forEach(function (a) { a.cancel(); });
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-chalk').forEach(initTabsChalk);
