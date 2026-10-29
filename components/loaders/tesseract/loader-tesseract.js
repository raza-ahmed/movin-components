function initLoaderTesseract(root) {
  var edges = root.querySelector('.loader-tesseract__edges');
  var inner = root.querySelector('.loader-tesseract__inner');
  var nodes = root.querySelectorAll('.loader-tesseract__nodes circle');
  if (!edges || !inner || nodes.length !== 16) return;
  // The 16 corners of a 4-cube (every sign combination of x, y, z, w) and its 32
  // edges: the pairs of corners that differ in exactly one coordinate.
  var V = [];
  for (var i = 0; i < 16; i++) V.push([0, 1, 2, 3].map(function (b) { return (i >> b) & 1 ? 1 : -1; }));
  var E = [];
  for (var j = 0; j < 16; j++) for (var b = 0; b < 4; b++) if (!(j & (1 << b))) E.push([j, j | (1 << b)]);

  function project(t) {
    var c = Math.cos(t * 0.9); // turn through the x-w plane: the inner cube swaps with the outer
    var s = Math.sin(t * 0.9);
    var cb = Math.cos(0.45 + t * 0.25); // and slowly through y-z, so the 3D shadow keeps moving
    var sb = Math.sin(0.45 + t * 0.25);
    return V.map(function (v) {
      var x1 = v[0] * c - v[3] * s;
      var w1 = v[0] * s + v[3] * c;
      var y1 = v[1] * cb - v[2] * sb;
      var z1 = v[1] * sb + v[2] * cb;
      var k4 = 1 / (2.6 - w1); // 4D to 3D perspective
      var k3 = 1 / (3 - z1 * k4); // 3D to 2D perspective
      return { x: 52 + x1 * k4 * k3 * 120, y: 52 + y1 * k4 * k3 * 120, w: w1 };
    });
  }

  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = 0;
  function draw(now) {
    var p = project(still ? 0.6 : now / 1000);
    var d = '';
    var din = '';
    E.forEach(function (e) {
      var a = p[e[0]];
      var q = p[e[1]];
      var seg = 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + 'L' + q.x.toFixed(1) + ' ' + q.y.toFixed(1);
      // Edges of whichever cube is nearer in w are drawn brighter.
      if (a.w > 0 && q.w > 0) din += seg;
      else d += seg;
    });
    edges.setAttribute('d', d);
    inner.setAttribute('d', din);
    nodes.forEach(function (n, k) {
      n.setAttribute('cx', p[k].x.toFixed(1));
      n.setAttribute('cy', p[k].y.toFixed(1));
      n.setAttribute('r', p[k].w > 0 ? '1.8' : '1.1');
    });
    if (!still) raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return function () { cancelAnimationFrame(raf); };
}

document.querySelectorAll('.loader-tesseract').forEach(initLoaderTesseract);
