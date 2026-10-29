function initCardBento(root) {
  var tiles = root.querySelectorAll('.card-bento__tile');
  if (tiles.length !== 4) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Layouts on a 3 x 3 grid as [col, row, colSpan, rowSpan] per tile, in tile order.
  var LAYOUTS = [
    [[0, 0, 2, 2], [2, 0, 1, 1], [2, 1, 1, 2], [0, 2, 2, 1]],
    [[1, 0, 2, 2], [0, 0, 1, 2], [0, 2, 1, 1], [1, 2, 2, 1]],
    [[0, 1, 2, 2], [0, 0, 2, 1], [2, 0, 1, 2], [2, 2, 1, 1]],
    [[1, 1, 2, 2], [0, 2, 1, 1], [0, 0, 1, 2], [1, 0, 2, 1]],
  ];
  var GAP = 6;
  var CW = (236 - GAP * 2) / 3;
  var CH = (176 - GAP * 2) / 3;
  var n = 0;
  var timer = setInterval(function () {
    n = (n + 1) % LAYOUTS.length;
    tiles.forEach(function (t, i) {
      var l = LAYOUTS[n][i];
      t.style.left = l[0] * (CW + GAP) + 'px';
      t.style.top = l[1] * (CH + GAP) + 'px';
      t.style.width = l[2] * CW + (l[2] - 1) * GAP + 'px';
      t.style.height = l[3] * CH + (l[3] - 1) * GAP + 'px';
    });
  }, 2000);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.card-bento').forEach(initCardBento);
