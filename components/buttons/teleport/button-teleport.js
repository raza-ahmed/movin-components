function initBtnTeleport(root) {
  var face = root.querySelector('.btn-teleport__face');
  if (!face) return;
  var W = 168;
  var H = 48;
  var COLS = 8;
  var ROWS = 3;
  var busy = false;
  var timers = [];
  // Seeded jitter per tile, so every run looks the same.
  var seed = 3;
  var jitter = [];
  for (var i = 0; i < COLS * ROWS; i++) jitter.push((seed = (seed * 16807) % 2147483647) / 2147483647);

  function tiles(phase) {
    root.textContent = '';
    var beam = document.createElement('span');
    beam.className = 'btn-teleport__beam';
    beam.setAttribute('aria-hidden', 'true');
    root.appendChild(beam);
    var w = W / COLS;
    var h = H / ROWS;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        // Rows go bottom-up on the way out and top-down on the way back.
        var order = phase === 'out' ? ROWS - 1 - r : r;
        var t = document.createElement('span');
        t.className = 'btn-teleport__tile';
        t.setAttribute('aria-hidden', 'true');
        t.style.cssText = 'left:' + c * w + 'px;top:' + r * h + 'px;width:' + w + 'px;height:' + h + 'px';
        t.style.setProperty('--d', (order * 0.14 + jitter[r * COLS + c] * 0.22).toFixed(2) + 's');
        var inner = document.createElement('span');
        inner.style.cssText = 'position:absolute;left:' + -c * w + 'px;top:' + -r * h + 'px';
        inner.appendChild(face.cloneNode(true));
        t.appendChild(inner);
        root.appendChild(t);
      }
    }
  }
  function click() {
    if (busy) return;
    busy = true;
    root.setAttribute('data-phase', 'out');
    tiles('out');
    timers.push(setTimeout(function () {
      root.setAttribute('data-phase', 'in');
      root.querySelectorAll('.btn-teleport__tile').forEach(function (t, i) {
        var r = Math.floor(i / COLS);
        t.style.setProperty('--d', (r * 0.14 + jitter[i] * 0.22).toFixed(2) + 's');
      });
    }, 1100));
    timers.push(setTimeout(function () {
      root.removeAttribute('data-phase');
      root.textContent = '';
      root.appendChild(face);
      busy = false;
    }, 2100));
  }
  root.addEventListener('click', click);

  return function () {
    timers.forEach(clearTimeout);
    root.removeEventListener('click', click);
  };
}

document.querySelectorAll('.btn-teleport').forEach(initBtnTeleport);
