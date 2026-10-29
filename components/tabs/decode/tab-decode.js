function initTabsDecode(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var GLYPHS = '#%&*+=<>/\\[]{}?!0123456789ABCDEFXYZ';
  var FRAMES = 22;
  var timer;
  var titles = Array.prototype.map.call(panels, function (panel) { return panel.querySelector('.tabs-decode__title'); });
  var words = Array.prototype.map.call(panels, function (panel) { return panel.querySelector('.tabs-decode__sr').textContent; });
  // Frame f of the decode: each letter cycles through symbols, then locks in, left to right.
  function scramble(text, f) {
    return text.split('').map(function (c, k) {
      return c === ' ' || f >= FRAMES || f > k * 1.3 + 4 ? c : GLYPHS[(k * 7 + f * 13) % GLYPHS.length];
    }).join('');
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
    clearTimeout(timer);
    titles[prev].textContent = words[prev];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      titles[i].textContent = words[i];
      root.removeAttribute('data-armed');
      return;
    }
    var frame = 0;
    root.setAttribute('data-armed', '');
    (function step() {
      titles[i].textContent = scramble(words[i], frame);
      if (frame++ < FRAMES) timer = setTimeout(step, 35);
      else root.removeAttribute('data-armed');
    })();
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
    clearTimeout(timer);
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-decode').forEach(initTabsDecode);
