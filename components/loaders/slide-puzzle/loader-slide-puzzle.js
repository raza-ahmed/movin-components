function initLoaderSlidePuzzle(root) {
  var tiles = root.querySelectorAll('.loader-slide-puzzle__tile');
  if (tiles.length !== 8) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // The eight border cells of the 3x3, clockwise. The gap walks round them, and each step
  // slides the tile in its way into the hole, so the ring of tiles rotates for ever.
  var RING = [0, 1, 2, 5, 8, 7, 6, 3];
  var where = [0, 1, 2, 5, 8, 7, 6, 4]; // the cell each tile sits in; tile 7 is the centre
  var gap = 3;
  function at(cell) {
    return 'translate(' + (cell % 3) * 26 + 'px, ' + Math.floor(cell / 3) * 26 + 'px)';
  }
  var timer = setInterval(function () {
    var next = RING[(RING.indexOf(gap) + 7) % 8]; // the cell before the gap, going anticlockwise
    var t = where.indexOf(next);
    where[t] = gap;
    tiles[t].style.transform = at(gap);
    gap = next;
    root.setAttribute('data-gap', String(gap));
  }, 300);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.loader-slide-puzzle').forEach(initLoaderSlidePuzzle);
