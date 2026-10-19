function initCbSortList(root) {
  var list = root.querySelector('.cb-sort-list__items');
  var count = root.querySelector('.cb-sort-list__count');
  if (!list) return;
  var items = Array.prototype.slice.call(list.children);
  var original = items.slice();
  var doneOrder = []; // checked items, in the order they were checked
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = 0;

  function input(li) {
    return li.querySelector('.cb-sort-list__input');
  }

  function progress() {
    var done = items.filter(function (li) {
      return input(li).checked;
    }).length;
    root.style.setProperty('--cb-sort-list-p', String(done / items.length));
    if (count) count.textContent = done + ' of ' + items.length + ' done';
  }

  // FLIP: remember where each row is, reorder the DOM, then animate each row
  // from its old place to its new one.
  function reorder() {
    var before = new Map();
    items.forEach(function (li) {
      before.set(li, li.getBoundingClientRect().top);
    });
    var focused = document.activeElement;
    var open = original.filter(function (li) {
      return !input(li).checked;
    });
    open.concat(doneOrder).forEach(function (li) {
      list.appendChild(li);
    });
    if (focused && root.contains(focused)) focused.focus({ preventScroll: true });
    if (reduce) return;
    items.forEach(function (li) {
      var dy = before.get(li) - li.getBoundingClientRect().top;
      if (!dy) return;
      li.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'translateY(0)' }], {
        duration: 420,
        easing: 'cubic-bezier(0.3, 1.15, 0.5, 1)',
      });
    });
  }

  function change(e) {
    var li = e.target.closest('.cb-sort-list__item');
    if (!li) return;
    doneOrder = doneOrder.filter(function (x) {
      return x !== li;
    });
    if (e.target.checked) doneOrder.push(li);
    progress();
    // Let the tick draw before the row moves.
    clearTimeout(timer);
    timer = setTimeout(reorder, reduce ? 0 : 180);
  }

  list.addEventListener('change', change);
  original.forEach(function (li) {
    if (input(li).checked) doneOrder.push(li);
  });
  progress();
  return function () {
    clearTimeout(timer);
    list.removeEventListener('change', change);
    original.forEach(function (li) {
      list.appendChild(li);
    });
  };
}

document.querySelectorAll('.cb-sort-list').forEach(initCbSortList);
