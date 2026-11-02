function initTabsCrt(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var OFF = [
    { transform: 'scale(1, 1)', filter: 'brightness(1)' },
    { transform: 'scale(1, 0.012)', filter: 'brightness(4)', offset: 0.6 },
    { transform: 'scale(0, 0.012)', filter: 'brightness(4)' },
  ];
  var ON = [
    { transform: 'scale(0, 0.012)', filter: 'brightness(4)' },
    { transform: 'scale(1, 0.012)', filter: 'brightness(3)', offset: 0.35 },
    { transform: 'scale(1, 1.05)', filter: 'brightness(1.4)', offset: 0.8 },
    { transform: 'scale(1, 1)', filter: 'brightness(1)' },
  ];
  var picture = root.querySelector('.tabs-crt__picture');
  var on = sel;
  var token = 0;
  function show(i) {
    on = i;
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
  }
  // The old channel switches off, the picture swaps while it is a dot, and the new one switches on.
  function tune() {
    var mine = ++token;
    var running = picture.getAnimations();
    running.forEach(function (a) { a.cancel(); });
    if (sel === on) {
      if (running.length) picture.animate(ON, { duration: 380, easing: 'ease-out' });
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return show(sel);
    var off = picture.animate(OFF, { duration: 300, easing: 'ease-in', fill: 'forwards' });
    off.onfinish = function () {
      if (mine !== token) return;
      show(sel);
      picture.animate(ON, { duration: 380, easing: 'ease-out' });
      off.cancel();
    };
  }

  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    tune();
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
    token++;
    picture.getAnimations().forEach(function (a) { a.cancel(); });
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-crt').forEach(initTabsCrt);
