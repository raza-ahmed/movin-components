function initTabsTumble(root) {
  var GAP = 2;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var pill = root.querySelector('.tabs-tumble__pill');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  // Where the pill lies right now; it reaches sel one flip at a time.
  var at = sel, busy = false, alive = true;
  // The label the pill is resting under, if any: none while it is turning over.
  function under(i) {
    tabs.forEach(function (tab, k) { tab.classList.toggle('tabs-tumble__tab--under', k === i); });
  }
  function tumble() {
    if (busy) return;
    busy = true;
    under(-1);
    function next() {
      if (!alive || at === sel) {
        busy = false;
        under(at);
        return;
      }
      var dir = Math.sign(sel - at);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        at = sel;
        pill.style.setProperty('--tabs-tumble-at', at);
        return next();
      }
      // Hinged on the edge it is heading for, it turns over onto the next slot like a domino.
      pill.style.transformOrigin = dir > 0 ? 'calc(100% + ' + GAP + 'px) 50%' : '-' + GAP + 'px 50%';
      var steps = Math.abs(sel - at);
      var flip = pill.animate(
        [
          { transform: 'perspective(260px) rotateY(0deg)', filter: 'brightness(1)' },
          { transform: 'perspective(260px) rotateY(' + dir * -90 + 'deg)', filter: 'brightness(0.62)', offset: 0.5 },
          { transform: 'perspective(260px) rotateY(' + dir * -180 + 'deg)', filter: 'brightness(1)' },
        ],
        { duration: steps > 1 ? 230 : 320, easing: steps > 1 ? 'cubic-bezier(0.5, 0, 0.6, 1)' : 'cubic-bezier(0.45, 0, 0.3, 1)', fill: 'forwards' }
      );
      flip.finished.then(function () {
        // Landed: move the pill onto the neighbouring slot, the right way round, in the same frame the flip lets go.
        at += dir;
        pill.style.setProperty('--tabs-tumble-at', at);
        flip.cancel();
        next();
      });
    }
    next();
  }
  function select(i) {
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    tumble();
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
    alive = false;
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-tumble').forEach(initTabsTumble);
