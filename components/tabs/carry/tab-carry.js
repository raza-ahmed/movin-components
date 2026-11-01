function initTabsCarry(root) {
  var SMALL = 13;
  var BIG = 22;
  var FLY = { duration: 560, easing: 'cubic-bezier(0.32, 0.72, 0.2, 1)' };
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var ghost = root.querySelector('.tabs-carry__ghost');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });

  function select(i) {
    if (i === sel) return;
    var from = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // The new heading starts where its tab label is and grows into place; the old one shrinks back to its tab.
    var box = root.getBoundingClientRect();
    var head = panels[i].querySelector('.tabs-carry__head span');
    var h = head.getBoundingClientRect();
    var to = tabs[i].querySelector('span').getBoundingClientRect();
    var back = tabs[from].querySelector('span').getBoundingClientRect();
    var s = SMALL / BIG;
    head.animate([{ transform: 'translate(' + (to.left - h.left) + 'px, ' + (to.top - h.top) + 'px) scale(' + s + ')' }, { transform: 'none' }], FLY);
    ghost.textContent = tabs[from].textContent.trim();
    var at = 'translate(' + (h.left - box.left) + 'px, ' + (h.top - box.top) + 'px)';
    var home = 'translate(' + (back.left - box.left) + 'px, ' + (back.top - box.top) + 'px) scale(' + s + ')';
    ghost.animate([{ transform: at, opacity: 1 }, { transform: home, opacity: 1, offset: 0.92 }, { transform: home, opacity: 0 }], FLY);
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

document.querySelectorAll('.tabs-carry').forEach(initTabsCarry);
