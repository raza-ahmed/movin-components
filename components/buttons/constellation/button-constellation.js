function initBtnConstellation(root) {
  var canvas = root.querySelector('canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var COUNT = 34;
  var LINK = 50;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(2, devicePixelRatio || 1);
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  var nodes = [];
  for (var i = 0; i < COUNT; i++) {
    nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 });
  }
  var pointer = null;
  var last = performance.now();
  var raf = 0;

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);
    // A canvas can't read CSS colours: take the ink from the button every frame, so a theme switch recolours it.
    var ink = getComputedStyle(root).color;
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    nodes.forEach(function (n) {
      if (pointer) {
        // A gentle pull toward the cursor, so the swarm never collapses onto it.
        var dx = pointer.x - n.x;
        var dy = pointer.y - n.y;
        var d = Math.hypot(dx, dy) || 1;
        if (d < 90) {
          n.vx += (dx / d) * 30 * dt;
          n.vy += (dy / d) * 30 * dt;
        }
      }
      n.vx *= 0.99;
      n.vy *= 0.99;
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      n.x = Math.max(0, Math.min(w, n.x));
      n.y = Math.max(0, Math.min(h, n.y));
    });
    for (var a = 0; a < COUNT; a++) {
      var p = nodes[a];
      for (var b = a + 1; b < COUNT; b++) {
        var q = nodes[b];
        var d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          ctx.globalAlpha = (1 - d / LINK) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      if (pointer) {
        var dp = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (dp < 80) {
          ctx.globalAlpha = (1 - dp / 80) * 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!still) raf = requestAnimationFrame(frame);
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

document.querySelectorAll('.btn-constellation').forEach(initBtnConstellation);
