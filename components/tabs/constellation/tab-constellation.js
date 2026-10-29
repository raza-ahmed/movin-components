function initTabsConstellation(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var SKY = [
    { stars: [[62, 16], [152, 22], [96, 54], [110, 51], [124, 48], [158, 90]], lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [4, 5], [2, 5]] },
    { stars: [[112, 12], [96, 42], [128, 38], [88, 82], [136, 78], [168, 26]], lines: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]] },
    { stars: [[28, 34], [72, 66], [112, 36], [154, 70], [196, 30], [118, 92]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  ];
  var stars = root.querySelectorAll('.tabs-constellation__star');
  var group = root.querySelector('.tabs-constellation__sky g');
  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    // Armed on the first change, so nothing animates on load.
    root.setAttribute('data-armed', '');
    // The stars glide to their new places; the lines are new elements, so they draw in fresh.
    var c = SKY[i];
    stars.forEach(function (star, k) {
      star.style.setProperty('--x', c.stars[k][0] + 'px');
      star.style.setProperty('--y', c.stars[k][1] + 'px');
    });
    group.replaceChildren();
    c.lines.forEach(function (l) {
      var a = c.stars[l[0]];
      var b = c.stars[l[1]];
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'tabs-constellation__line');
      path.setAttribute('pathLength', '100');
      path.setAttribute('d', 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1]);
      group.appendChild(path);
    });
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

document.querySelectorAll('.tabs-constellation').forEach(initTabsConstellation);
