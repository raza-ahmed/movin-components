function initTabsTiles(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var n = tabs.length;
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var BIG = { x: 0, y: 0, w: 240, h: 104 };
  function small(k) { return { x: k * 82, y: 112, w: 76, h: 48 }; }
  // The chosen app takes the big slot; the others fill the small row in order. The CSS transitions
  // each tile's left, top, width and height, so the swap is one move.
  function place() {
    var k = 0;
    tabs.forEach(function (tab, j) {
      var at = j === sel ? BIG : small(k++);
      tab.style.left = at.x + 'px';
      tab.style.top = at.y + 'px';
      tab.style.width = at.w + 'px';
      tab.style.height = at.h + 'px';
    });
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
    place();
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

document.querySelectorAll('.tabs-tiles').forEach(initTabsTiles);
