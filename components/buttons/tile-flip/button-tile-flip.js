function initBtnTileFlip(root) {
  var grid = root.querySelector('.btn-tile-flip__tiles');
  if (!grid) return;
  var COLS = 12;
  var ROWS = 4;
  var tiles = [];
  for (var i = 0; i < COLS * ROWS; i++) {
    var t = document.createElement('span');
    t.className = 'btn-tile-flip__tile';
    grid.appendChild(t);
    tiles.push(t);
  }

  // Each tile waits by its distance from the point, and turns about the axis
  // at right angles to the line from that point, so the wave rolls outwards.
  function wave(x, y, on) {
    var w = root.clientWidth / COLS;
    var h = root.clientHeight / ROWS;
    tiles.forEach(function (t, i) {
      var dx = (i % COLS) * w + w / 2 - x;
      var dy = Math.floor(i / COLS) * h + h / 2 - y;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      t.style.setProperty('--btn-tile-flip-d', (d * 2.4).toFixed(0) + 'ms');
      if (on) {
        t.style.setProperty('--btn-tile-flip-ax', (-dy / d).toFixed(3));
        t.style.setProperty('--btn-tile-flip-ay', (dx / d).toFixed(3));
      }
    });
    root.classList.toggle('btn-tile-flip--on', on);
  }

  function at(e) {
    var box = root.getBoundingClientRect();
    return [e.clientX - box.left, e.clientY - box.top];
  }

  function enter(e) {
    var p = at(e);
    wave(p[0], p[1], true);
  }
  function leave(e) {
    var p = at(e);
    wave(p[0], p[1], false);
  }
  function focus() {
    if (root.matches(':focus-visible')) wave(root.clientWidth / 2, root.clientHeight / 2, true);
  }
  function blur() {
    if (!root.matches(':hover')) wave(root.clientWidth / 2, root.clientHeight / 2, false);
  }

  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('focus', focus);
  root.addEventListener('blur', blur);
  return function () {
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('focus', focus);
    root.removeEventListener('blur', blur);
    root.classList.remove('btn-tile-flip--on');
    tiles.forEach(function (t) {
      t.remove();
    });
  };
}

document.querySelectorAll('.btn-tile-flip').forEach(initBtnTileFlip);
