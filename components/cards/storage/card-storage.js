function initCardStorage(root) {
  var CATS = [
    { name: 'Photos', gb: 74 },
    { name: 'Apps', gb: 52 },
    { name: 'Documents', gb: 31 },
    { name: 'Other', gb: 25 },
  ];
  var TOTAL = 256;
  var USED = CATS.reduce(function (n, c) {
    return n + c.gb;
  }, 0);
  var segs = root.querySelectorAll('.card-storage__bar .card-storage__seg');
  var rows = root.querySelectorAll('.card-storage__row');
  var read = root.querySelector('.card-storage__read');
  var on = null;

  // The category you point at swells and the rest dim; the reading changes to its size.
  function set(next) {
    if (next === on) return;
    on = next;
    segs.forEach(function (seg, i) {
      seg.classList.toggle('card-storage__seg--on', on === i);
      seg.classList.toggle('card-storage__seg--dim', on !== null && on !== i);
    });
    rows.forEach(function (row, i) {
      row.classList.toggle('card-storage__row--on', on === i);
    });
    // A new reading replays its fade in.
    var fresh = read.cloneNode(false);
    fresh.textContent = on === null ? USED + ' of ' + TOTAL + ' GB used' : CATS[on].name + ' · ' + CATS[on].gb + ' GB';
    read.replaceWith(fresh);
    read = fresh;
  }
  function onEnter(e) {
    var i = Array.prototype.indexOf.call(segs, e.currentTarget);
    if (i < 0) i = Array.prototype.indexOf.call(rows, e.currentTarget);
    if (i > -1 && i < CATS.length) set(i);
  }
  function onOut() {
    set(null);
  }
  var hot = Array.prototype.slice.call(segs, 0, CATS.length).concat(Array.prototype.slice.call(rows));
  hot.forEach(function (el) {
    el.addEventListener('pointerenter', onEnter);
  });
  rows.forEach(function (row) {
    row.addEventListener('focus', onEnter);
    row.addEventListener('blur', onOut);
  });
  root.addEventListener('pointerleave', onOut);
  return function () {
    hot.forEach(function (el) {
      el.removeEventListener('pointerenter', onEnter);
    });
    rows.forEach(function (row) {
      row.removeEventListener('focus', onEnter);
      row.removeEventListener('blur', onOut);
    });
    root.removeEventListener('pointerleave', onOut);
  };
}

document.querySelectorAll('.card-storage').forEach(initCardStorage);
