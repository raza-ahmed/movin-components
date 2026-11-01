function initTabsSplit(root) {
  var R = 12;
  var GAP = 3;
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  function render() {
    tabs.forEach(function (tab, i) {
      // Square, touching edges make one bar; any edge next to the active tab pulls back and rounds off.
      var open = function (j) { return j === sel || j < 0 || j >= n; };
      var left = open(i - 1) || i === sel ? R : 0;
      var right = open(i + 1) || i === sel ? R : 0;
      var seg = tab.querySelector('.tabs-split__seg');
      seg.style.left = (i === sel || i - 1 === sel ? GAP : 0) + 'px';
      seg.style.right = (i === sel || i + 1 === sel ? GAP : 0) + 'px';
      seg.style.borderRadius = left + 'px ' + right + 'px ' + right + 'px ' + left + 'px';
      tab.setAttribute('aria-selected', String(i === sel));
      tab.tabIndex = i === sel ? 0 : -1;
    });
    panels.forEach(function (panel, i) { panel.hidden = i !== sel; });
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    sel = tabs.indexOf(tab);
    render();
  }
  function onKeyDown(e) {
    var next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    sel = next;
    render();
    tabs[next].focus();
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-split').forEach(initTabsSplit);
