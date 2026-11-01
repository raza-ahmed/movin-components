function initTabsRipple(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });

  // Every letter bobs once, later and smaller the further it sits from where the ripple started.
  function ripple(x) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = root.getBoundingClientRect();
    root.querySelectorAll('.tabs-ripple__letter').forEach(function (l) {
      var r = l.getBoundingClientRect();
      var d = Math.abs(r.left + r.width / 2 - box.left - x);
      var a = 7 * Math.exp(-d / 170);
      if (a < 0.5) return;
      l.animate(
        [
          { transform: 'none' },
          { transform: 'translateY(' + -a + 'px)', offset: 0.3 },
          { transform: 'translateY(' + a * 0.28 + 'px)', offset: 0.65 },
          { transform: 'none' },
        ],
        { duration: 620, delay: d / 0.42, easing: 'ease-in-out' }
      );
    });
  }
  function select(i, x) {
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    ripple(x === undefined ? tabs[i].offsetLeft + tabs[i].offsetWidth / 2 : x);
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    // A pointer starts the ripple where it pressed; Enter and Space start it at the tab's centre.
    select(tabs.indexOf(tab), e.detail ? e.clientX - root.getBoundingClientRect().left : undefined);
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

document.querySelectorAll('.tabs-ripple').forEach(initTabsRipple);
