function initBtnIris(root) {
  var group = root.querySelector('svg g');
  if (!group) return;
  var R = 64; // aperture radius (viewBox units)
  var N = 6;
  var CLOSED = 1;
  var OPEN = 50;
  var paths = group.children;

  // Where the ray from p along unit d leaves the aperture circle.
  function exit(p, d) {
    var b = p.x * d.x + p.y * d.y;
    var t = -b + Math.sqrt(b * b - (p.x * p.x + p.y * p.y - R * R));
    return { x: p.x + d.x * t, y: p.y + d.y * t };
  }
  // Six blades for an opening of radius r: a twisting hexagon whose edges run on to the rim, so they always tile the disc.
  function blades(r) {
    var twist = (1 - r / OPEN) * 0.9;
    var v = [];
    for (var i = 0; i < N; i++) {
      var a = (i / N) * Math.PI * 2 + twist;
      v.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
    }
    var ends = v.map(function (p, i) {
      var q = v[(i + 1) % N];
      var len = Math.hypot(q.x - p.x, q.y - p.y);
      return exit(q, { x: (q.x - p.x) / len, y: (q.y - p.y) / len });
    });
    return v.map(function (p, i) {
      var q = v[(i + 1) % N];
      var e = ends[i];
      var prev = ends[(i + N - 1) % N];
      var a0 = Math.atan2(e.y, e.x);
      var a1 = Math.atan2(prev.y, prev.x);
      while (a1 > a0) a1 -= Math.PI * 2; // walk the rim backwards from e to prev
      var d = 'M' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + 'L' + q.x.toFixed(2) + ' ' + q.y.toFixed(2) + 'L' + e.x.toFixed(2) + ' ' + e.y.toFixed(2);
      for (var s = 1; s <= 10; s++) {
        var ang = a0 + ((a1 - a0) * s) / 10;
        d += 'L' + (Math.cos(ang) * R).toFixed(2) + ' ' + (Math.sin(ang) * R).toFixed(2);
      }
      return d + 'Z';
    });
  }

  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target = CLOSED;
  var r = CLOSED;
  var raf = 0;
  function tick() {
    r = still ? target : r + (target - r) * 0.14;
    blades(r).forEach(function (d, i) { paths[i].setAttribute('d', d); });
    raf = requestAnimationFrame(tick);
  }
  function open() { target = OPEN; }
  function close() { target = CLOSED; }
  root.addEventListener('pointerenter', open);
  root.addEventListener('pointerleave', close);
  root.addEventListener('focus', open);
  root.addEventListener('blur', close);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', open);
    root.removeEventListener('pointerleave', close);
    root.removeEventListener('focus', open);
    root.removeEventListener('blur', close);
  };
}

document.querySelectorAll('.btn-iris').forEach(initBtnIris);
