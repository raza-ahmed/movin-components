function initTabsPuck(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var puck = root.querySelector('.tabs-puck__puck');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    root.style.setProperty('--tabs-puck-i', i);
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // It leans into the slide like something with weight, then rocks back level.
    var lean = Math.sign(i - prev) * Math.min(14, 8 + Math.abs(i - prev) * 3);
    puck.animate(
      [
        { transform: 'none' },
        { transform: 'skewX(' + -lean + 'deg) scaleY(0.94)', offset: 0.3 },
        { transform: 'skewX(' + lean * 0.35 + 'deg)', offset: 0.7 },
        { transform: 'none' },
      ],
      { duration: 520, easing: 'ease-out' }
    );
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

document.querySelectorAll('.tabs-puck').forEach(initTabsPuck);
