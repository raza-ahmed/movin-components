function initLoaderTorus(root) {
  var ctx = root.getContext && root.getContext('2d');
  if (!ctx) return;
  var MAJOR = 30; // points round the ring
  var MINOR = 10; // points round the tube
  var R = 1; // ring radius
  var r = 0.42; // tube radius
  var POINTS = [];
  for (var i = 0; i < MAJOR * MINOR; i++) {
    var u = ((i % MAJOR) / MAJOR) * Math.PI * 2;
    var v = (Math.floor(i / MAJOR) / MINOR) * Math.PI * 2;
    POINTS.push([(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]);
  }
  var size = root.clientWidth;
  var dpr = Math.min(2, devicePixelRatio || 1);
  root.width = size * dpr;
  root.height = size * dpr;
  ctx.scale(dpr, dpr);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = 0;

  function draw(now) {
    var t = still ? 1.2 : now / 1000;
    var cs = Math.cos(t * 0.7); // spin round its own axis: the points flow round the ring
    var ss = Math.sin(t * 0.7);
    var ax = 1.05 + Math.sin(t * 0.6) * 0.25; // tilted so the hole stays in view, rocking
    var ay = Math.sin(t * 0.4) * 0.5; // and swaying side to side
    var cx = Math.cos(ax);
    var sx = Math.sin(ax);
    var cy = Math.cos(ay);
    var sy = Math.sin(ay);
    // A canvas can't read CSS colours: the ink is the element's own colour, every frame.
    ctx.fillStyle = getComputedStyle(root).color;
    ctx.clearRect(0, 0, size, size);
    var projected = POINTS.map(function (p) {
      var x = p[0] * cs - p[1] * ss;
      var y = p[0] * ss + p[1] * cs;
      var x1 = x * cy + p[2] * sy;
      var z1 = -x * sy + p[2] * cy;
      var y2 = y * cx - z1 * sx;
      var z2 = y * sx + z1 * cx;
      var k = 1 / (3.2 - z2); // perspective
      return { x: size / 2 + x1 * k * size * 0.8, y: size / 2 + y2 * k * size * 0.8, z: z2 };
    });
    // Far points first, so near ones paint over them.
    projected.sort(function (a, b) { return a.z - b.z; });
    projected.forEach(function (p) {
      var depth = (p.z + R + r) / (2 * (R + r)); // 0 far, 1 near
      ctx.globalAlpha = 0.12 + depth * 0.88;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.6 + depth * 1.3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!still) raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return function () { cancelAnimationFrame(raf); };
}

document.querySelectorAll('.loader-torus').forEach(initLoaderTorus);
