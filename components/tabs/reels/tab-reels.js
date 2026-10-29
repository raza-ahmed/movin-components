function initTabsReels(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var N = tabs.length;
  var flip = 0;
  var strip = root.querySelector('.tabs-reels__strip');
  function setPos(pos) {
    root.style.setProperty('--tabs-reels-pos', pos);
  }
  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    // The real panels live in the middle of five copies; only the chosen one is reachable.
    panels.forEach(function (panel, k) {
      panel.setAttribute('aria-hidden', String(k !== i));
      panel.inert = k !== i;
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPos(2 * N + i);
      return;
    }
    // Spin forward one full turn plus however far it is to the pick.
    setPos(2 * N + prev + ((i - prev + N) % N) + N);
    root.setAttribute('data-spin', '');
    // Each change flips data-flip between a and b, so the keyframes restart every time.
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
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
  // Once the reel stops, snap back to the same dish in the middle copy, where the real panels live.
  function onSettle(e) {
    if (e.target !== strip) return;
    setPos(2 * N + sel);
    root.removeAttribute('data-spin');
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  strip.addEventListener('transitionend', onSettle);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
    strip.removeEventListener('transitionend', onSettle);
  };
}

document.querySelectorAll('.tabs-reels').forEach(initTabsReels);
