function initTabsPin(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COL = 240 / n;
  var PIN_Y = 14;
  var pin = root.querySelector('.tabs-pin__pin');
  function pinX(i) { return i * COL + COL / 2; }
  function lift(s, d) { return 'drop-shadow(' + d / 2 + 'px ' + d + 'px ' + d / 2 + 'px rgba(0, 0, 0, ' + (0.45 - s * 0.2) + '))'; }
  // The pin pulls out, arcs over to the next note growing as it lifts (its shadow falls further away),
  // and pushes in with a small squash. A pick mid-flight starts from wherever the pin is.
  function fly(from, to) {
    var m = new DOMMatrix(getComputedStyle(pin).transform);
    var moving = pin.getAnimations().length;
    var fx = moving ? m.e : pinX(from);
    var fy = moving ? m.f : PIN_Y;
    pin.getAnimations().forEach(function (a) { a.cancel(); });
    var tx = pinX(to);
    pin.style.transform = 'translate(' + tx + 'px, ' + PIN_Y + 'px)';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pin.animate(
      [
        { transform: 'translate(' + fx + 'px, ' + fy + 'px) scale(1)', filter: lift(0, 1) },
        { transform: 'translate(' + fx + 'px, ' + (PIN_Y - 9) + 'px) scale(1.25)', filter: lift(0.6, 6), offset: 0.2 },
        { transform: 'translate(' + (fx + tx) / 2 + 'px, ' + (PIN_Y - 22) + 'px) scale(1.35)', filter: lift(1, 10), offset: 0.5 },
        { transform: 'translate(' + tx + 'px, ' + (PIN_Y - 9) + 'px) scale(1.25)', filter: lift(0.6, 6), offset: 0.8 },
        { transform: 'translate(' + tx + 'px, ' + PIN_Y + 'px) scale(0.88)', filter: lift(0, 1), offset: 0.9 },
        { transform: 'translate(' + tx + 'px, ' + PIN_Y + 'px) scale(1)', filter: lift(0, 1) },
      ],
      { duration: 760, easing: 'ease-in-out' }
    );
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
    // The swing of the newly pinned note is a CSS animation, held back until the first pick.
    root.setAttribute('data-live', '');
    fly(prev, i);
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
    pin.getAnimations().forEach(function (a) { a.cancel(); });
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-pin').forEach(initTabsPin);
