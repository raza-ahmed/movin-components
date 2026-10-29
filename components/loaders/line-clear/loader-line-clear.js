function initLoaderLineClear(root) {
  var cells = root.querySelectorAll('.loader-line-clear__cell');
  var W = 6;
  var H = 9;
  if (cells.length !== W * H) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Pieces as [col, row] cells relative to their top-left, each dropped at column x.
  // Together they fill the bottom two rows exactly, so the board clears back to empty.
  var PIECES = [
    { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], x: 0 },
    { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], x: 4 },
    { cells: [[0, 0], [1, 0], [2, 0], [2, 1]], x: 1 },
  ];

  // Every frame of one round: each piece falling, then the full rows flashing and clearing.
  function frames() {
    var board = [];
    for (var i = 0; i < W * H; i++) board.push('');
    var out = [];
    function fits(p, y) {
      return p.cells.every(function (c) { return y + c[1] < H && !board[(y + c[1]) * W + p.x + c[0]]; });
    }
    PIECES.forEach(function (p) {
      var y = 0;
      while (fits(p, y + 1)) {
        var f = board.slice();
        p.cells.forEach(function (c) { f[(y + c[1]) * W + p.x + c[0]] = 'live'; });
        out.push(f);
        y += 1;
      }
      p.cells.forEach(function (c) { board[(y + c[1]) * W + p.x + c[0]] = 'set'; });
      out.push(board.slice());
    });
    var full = [];
    for (var r = 0; r < H; r++) if (board.slice(r * W, r * W + W).every(Boolean)) full.push(r);
    for (var k = 0; k < 4; k++) {
      var g = board.slice();
      if (k % 2 === 0) full.forEach(function (row) { g.fill('flash', row * W, row * W + W); });
      out.push(g);
    }
    // Clear: drop whatever sits above the cleared rows, then a beat of rest.
    var kept = [];
    for (var q = 0; q < H; q++) if (full.indexOf(q) < 0) kept.push(q);
    var after = [];
    for (var z = 0; z < W * H; z++) after.push('');
    kept.reverse().forEach(function (row, n) {
      var line = board.slice(row * W, row * W + W);
      for (var c = 0; c < W; c++) after[(H - 1 - n) * W + c] = line[c];
    });
    out.push(after, after, after);
    return out;
  }

  var FRAMES = frames();
  var n = 0;
  var timer = setInterval(function () {
    n = (n + 1) % FRAMES.length;
    FRAMES[n].forEach(function (s, k) {
      if (s) cells[k].setAttribute('data-s', s);
      else cells[k].removeAttribute('data-s');
    });
  }, 85);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.loader-line-clear').forEach(initLoaderLineClear);
