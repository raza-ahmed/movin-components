function initTabsWheel(root) {
  var list = root.querySelector('[role="tablist"]');
  var drum = root.querySelector('.tabs-wheel__drum');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  function select(i) {
    if (i === sel) return;
    sel = i;
    // Turning the drum by one step per day brings the chosen one to the front.
    drum.style.setProperty('--tabs-wheel-i', i);
    tabs.forEach(function (tab, k) {
      var d = Math.abs(k - i);
      var fade = [1, 0.7, 0.42, 0.18][d];
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
      // Days fade as they turn away; the ones round the back can't be clicked.
      tab.style.opacity = fade === undefined ? 0 : fade;
      tab.style.pointerEvents = d > 3 ? 'none' : '';
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var n = tabs.length;
    var next = { ArrowRight: Math.min(n - 1, sel + 1), ArrowLeft: Math.max(0, sel - 1), Home: 0, End: n - 1 }[e.key];
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

document.querySelectorAll('.tabs-wheel').forEach(initTabsWheel);
