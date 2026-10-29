function initBtnThermal(root) {
  var canvas = root.querySelector('canvas');
  var temp = root.querySelector('.btn-thermal__temp');
  if (!canvas || !temp) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var CELL = 6;
  var LEVELS = 6; // thermal-camera banding
  var ctx = canvas.getContext('2d');
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  var cols = Math.ceil(w / CELL);
  var rows = Math.ceil(h / CELL);
  var heat = new Float32Array(cols * rows);
  var next = new Float32Array(cols * rows);
  var pointer = null;
  var raf = 0;

  function frame() {
    if (pointer) {
      // Deposit heat in a soft disc around the cursor.
      var cx = pointer.x / CELL;
      var cy = pointer.y / CELL;
      for (var y = Math.max(0, Math.floor(cy - 4)); y < Math.min(rows, cy + 4); y++) {
        for (var x = Math.max(0, Math.floor(cx - 4)); x < Math.min(cols, cx + 4); x++) {
          var d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
          heat[y * cols + x] = Math.min(1, heat[y * cols + x] + Math.max(0, 1 - d / 3.6) * 0.22);
        }
      }
    }
    // Diffuse into neighbours and cool.
    var peak = 0;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var k = j * cols + i;
        var n = (i > 0 ? heat[k - 1] : 0) + (i < cols - 1 ? heat[k + 1] : 0) + (j > 0 ? heat[k - cols] : 0) + (j < rows - 1 ? heat[k + cols] : 0);
        next[k] = (heat[k] * 0.6 + n * 0.1) * 0.985;
        if (next[k] > peak) peak = next[k];
      }
    }
    var swap = heat;
    heat = next;
    next = swap;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = getComputedStyle(root).color;
    for (var c = 0; c < heat.length; c++) {
      var q = Math.floor(heat[c] * LEVELS) / LEVELS;
      if (q <= 0) continue;
      ctx.globalAlpha = q * 0.85;
      // Hotter cells fill more of their square, like a dithered camera readout.
      var s = CELL * (0.45 + q * 0.55);
      ctx.fillRect((c % cols) * CELL + (CELL - s) / 2, Math.floor(c / cols) * CELL + (CELL - s) / 2, s, s);
    }
    ctx.globalAlpha = 1;
    temp.textContent = (21 + peak * 46).toFixed(1) + '°C';
    raf = requestAnimationFrame(frame);
  }

  function move(e) {
    var r = root.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function leave() { pointer = null; }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  raf = requestAnimationFrame(frame);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
  };
}

document.querySelectorAll('.btn-thermal').forEach(initBtnThermal);
