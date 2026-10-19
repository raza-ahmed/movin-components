function initCbSelectAll(root) {
  var parent = root.querySelector('.cb-select-all__input--parent');
  var children = Array.prototype.slice.call(root.querySelectorAll('.cb-select-all__branch .cb-select-all__input'));
  if (!parent || !children.length) return;
  var timers = [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function sync() {
    var on = children.filter(function (c) {
      return c.checked;
    }).length;
    parent.checked = on === children.length;
    parent.indeterminate = on > 0 && on < children.length;
  }

  // The parent cascades down the branch one child at a time.
  function fromParent() {
    var want = parent.checked;
    parent.indeterminate = false;
    timers.forEach(clearTimeout);
    timers = [];
    children.forEach(function (c, i) {
      if (c.checked === want) return;
      timers.push(
        setTimeout(function () {
          c.checked = want;
          c.dispatchEvent(new Event('change', { bubbles: true }));
        }, reduce ? 0 : 90 * (i + 1))
      );
    });
  }

  function change(e) {
    if (e.target === parent) fromParent();
    else if (children.indexOf(e.target) !== -1) sync();
  }

  root.addEventListener('change', change);
  sync();
  return function () {
    timers.forEach(clearTimeout);
    root.removeEventListener('change', change);
  };
}

document.querySelectorAll('.cb-select-all').forEach(initCbSelectAll);
