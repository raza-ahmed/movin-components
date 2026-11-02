function initTabsParallax(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var W = 240;
  // How far each layer travels per place, as a share of the view's width: the far hills barely
  // move, the near ground rushes past and the words lead.
  var SPEED = [0.35, 0.7, 1.3, 1];
  // The sun drifts a little against the land and climbs as the walk gets higher.
  var SUN = ['translate(182px, 74px) scale(1.15)', 'translate(160px, 44px)', 'translate(140px, 26px) scale(0.65)'];
  var layers = root.querySelectorAll('.tabs-parallax__layer');
  var sun = root.querySelector('.tabs-parallax__sun');

  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    // Each layer's transform transitions in the CSS, all on the same curve.
    layers.forEach(function (layer, k) { layer.style.transform = 'translateX(' + -i * W * SPEED[k] + 'px)'; });
    sun.style.transform = SUN[i];
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
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-parallax').forEach(initTabsParallax);
