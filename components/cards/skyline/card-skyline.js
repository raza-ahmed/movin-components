function initCardSkyline(root) {
  var canvas = root.querySelector('canvas');
  var probe = root.querySelector('.card-skyline__probe');
  var read = root.querySelector('.card-skyline__read');
  if (!canvas || !probe || !read) return;
  var W = 252;
  var H = 164;
  var WEEKS = 12;
  var S = 13; // cell pitch
  var START = new Date(2026, 7, 3); // twelve weeks ending Sunday 25 October 2026
  // Activity: a rising trend, quiet weekends and a few spikes.
  var DATA = [];
  for (var w = 0; w < WEEKS; w++) {
    var col = [];
    for (var d = 0; d < 7; d++) {
      var n = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453;
      var r = n - Math.floor(n);
      var base = (d > 4 ? 1 : 5) + w * 0.7;
      col.push(Math.max(0, Math.round(base * (0.3 + r * 1.3) + (r > 0.93 ? 10 : 0) - (r < 0.12 ? base : 0))));
    }
    DATA.push(col);
  }
  var MAX = Math.max.apply(null, [].concat.apply([], DATA));
  function rgb(c) { return (c.match(/[\d.]+/g) || ['0', '0', '0']).slice(0, 3).map(Number); }
  function mix(a, b, t) { return 'rgb(' + a.map(function (x, i) { return Math.round(x + (b[i] - x) * t); }).join(',') + ')'; }
  function easeOutBack(x) { return 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2); }
  function inside(pt, poly) {
    var hit = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      if (poly[i][1] > pt[1] !== poly[j][1] > pt[1] && pt[0] < ((poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1])) / (poly[j][1] - poly[i][1]) + poly[i][0]) hit = !hit;
    }
    return hit;
  }

  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var born = performance.now();
  var ptr = null;
  var picked = null;
  var yaw = 0.7;
  var pitch = 0.5;
  var raf = 0;

  function tick(now) {
    var t = (now - born) / 1000;
    // The pointer turns the city; at rest it drifts slowly on its own.
    var yawT = ptr ? 0.25 + (ptr.x / W) * 0.95 : 0.7 + (still ? 0 : Math.sin(now / 2600) * 0.12);
    var pitchT = ptr ? 0.38 + (ptr.y / H) * 0.22 : 0.5;
    yaw += (yawT - yaw) * 0.08;
    pitch += (pitchT - pitch) * 0.08;
    var ink = Array.prototype.map.call(probe.children, function (c) { return rgb(getComputedStyle(c).color); });
    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var zk = Math.sqrt(1 - pitch * pitch);
    function proj(x, y, z) { return [W / 2 + x * cy - y * sy, 96 + (x * sy + y * cy) * pitch - z * zk]; }
    var cells = [];
    for (var cw = 0; cw < WEEKS; cw++) {
      for (var cd = 0; cd < 7; cd++) {
        var x = (cw - (WEEKS - 1) / 2) * S;
        var y = (cd - 3) * S;
        cells.push({ w: cw, d: cd, x: x, y: y, depth: x * sy + y * cy });
      }
    }
    cells.sort(function (a, b) { return a.depth - b.depth; });
    ctx.clearRect(0, 0, W, H);
    var faces = [];
    function shape(poly, fill) {
      ctx.beginPath();
      poly.forEach(function (p, i) { ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1]); });
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }
    cells.forEach(function (c) {
      var v = DATA[c.w][c.d];
      // Bars rise in a diagonal wave from the oldest corner.
      var k = still ? 1 : easeOutBack(Math.min(1, Math.max(0, (t - (c.w + c.d) * 0.035) / 0.65)));
      var z = Math.max(1.2, (v / MAX) * 58 * k);
      var hot = picked && picked[0] === c.w && picked[1] === c.d;
      var top = mix(ink[1], ink[2], hot ? 1 : v ? 0.18 + 0.82 * Math.pow(v / MAX, 0.8) : 0);
      var q = S * 0.41;
      var corners = [[c.x - q, c.y - q], [c.x + q, c.y - q], [c.x + q, c.y + q], [c.x - q, c.y + q]];
      // Sides facing the viewer, darker the more they turn away from the light.
      [[0, 1, 0, -1], [1, 2, 1, 0], [2, 3, 0, 1], [3, 0, -1, 0]].forEach(function (s) {
        if (s[2] * sy + s[3] * cy <= 0) return;
        var a = corners[s[0]];
        var b = corners[s[1]];
        var poly = [proj(a[0], a[1], 0), proj(b[0], b[1], 0), proj(b[0], b[1], z), proj(a[0], a[1], z)];
        shape(poly, mix(rgb(top), ink[0], s[2] * cy - s[3] * sy > 0 ? 0.32 : 0.52));
        faces.push({ poly: poly, w: c.w, d: c.d });
      });
      var lid = corners.map(function (p) { return proj(p[0], p[1], z); });
      shape(lid, top);
      if (hot) {
        ctx.strokeStyle = mix(ink[0], ink[2], 0);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      faces.push({ poly: lid, w: c.w, d: c.d });
    });
    // Hit-test front to back: the first face under the pointer is the bar you see.
    var hit = null;
    if (ptr) {
      for (var i = faces.length - 1; i >= 0; i--) {
        if (inside([ptr.x, ptr.y], faces[i].poly)) {
          hit = [faces[i].w, faces[i].d];
          break;
        }
      }
    }
    if ((hit && hit[0]) !== (picked && picked[0]) || (hit && hit[1]) !== (picked && picked[1])) {
      picked = hit;
      if (hit) {
        var day = new Date(START.getFullYear(), START.getMonth(), START.getDate() + hit[0] * 7 + hit[1]);
        read.textContent = day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + DATA[hit[0]][hit[1]];
      } else read.textContent = 'Last 12 weeks';
    }
    raf = requestAnimationFrame(tick);
  }

  function move(e) {
    var r = canvas.getBoundingClientRect();
    ptr = { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function leave() { ptr = null; }
  function replay() { born = performance.now(); }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('click', replay);
  raf = requestAnimationFrame(tick);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('click', replay);
  };
}

document.querySelectorAll('.card-skyline').forEach(initCardSkyline);
