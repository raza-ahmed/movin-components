function initCardTank(root) {
  var canvas = root.querySelector('canvas');
  var probe = root.querySelector('.card-tank__probe');
  var pct = root.querySelector('.card-tank__pct');
  var used = root.querySelector('.card-tank__used');
  var btn = root.querySelector('.card-tank__btn');
  if (!canvas || !probe || !pct || !used || !btn) return;
  var W = 230;
  var H = 150;
  var N = 47; // surface columns
  var GB = 64;
  var FULL = 0.64;
  var CLEAN = 0.38;
  var STEP = 1 / 120;
  var dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var h = new Float32Array(N);
  var v = new Float32Array(N);
  var s = { levelT: FULL, kick: 0, px: -1, py: -1, vx: 0, vy: 0, hover: false };
  var clean = false;
  var level = FULL;
  var levelV = 0;
  var tilt = 0;
  var tiltV = 0;
  var acc = 0;
  var last = performance.now();
  var raf = 0;
  var bubbles = [];
  for (var b = 0; b < 8; b++) bubbles.push({ x: 20 + ((b * 53) % 190), y: H + b * 18, r: 1.5 + (b % 3), sp: 14 + (b % 4) * 6 });
  function colX(i) { return (i / (N - 1)) * W; }
  function surf(i, t, back) {
    return H * (1 - level) + tilt * (colX(i) - W / 2) + h[i] * (back ? 0.6 : 1) + (still ? 0 : Math.sin(t * 1.8 + i * 0.35 + back * 2) * (1.2 + back));
  }

  function step(dt) {
    // The liquid leans toward the cursor, overshooting like a real slosh.
    var tiltT = s.hover ? (s.px / W - 0.5) * 0.28 : 0;
    tiltV += ((tiltT - tilt) * 40 - tiltV * 3.2) * dt;
    tilt += tiltV * dt;
    levelV += ((s.levelT - level) * 14 - levelV * 4.5) * dt;
    level += levelV * dt;
    for (var i = 0; i < N; i++) {
      var l = i > 0 ? h[i - 1] : h[i];
      var r = i < N - 1 ? h[i + 1] : h[i];
      // Changes in tilt rock the whole body: the near side drops as the far side climbs.
      v[i] += ((l + r - 2 * h[i]) * 700 - h[i] * 8 - v[i] * 1.8 - tiltV * (colX(i) - W / 2) * 0.9) * dt;
    }
    for (var k = 0; k < N; k++) h[k] = Math.max(-40, Math.min(40, h[k] + v[k] * dt));
    if (s.kick) {
      for (var j = 0; j < N; j++) v[j] += Math.sin(j * 0.9) * s.kick;
      s.kick = 0;
    }
  }

  function fill(color, back, t) {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (var i = 0; i < N; i++) ctx.lineTo(colX(i), surf(i, t, back) - back * 5);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var t = now / 1000;
    if (still) {
      level = s.levelT;
      h.fill(0);
    } else {
      // The cursor stirs the surface where it crosses it.
      if (s.hover && s.px >= 0) {
        var c = Math.round((s.px / W) * (N - 1));
        if (Math.abs(s.py - surf(c, t, 0)) < 34) {
          var f = Math.max(-260, Math.min(260, s.vy * 0.5 + Math.abs(s.vx) * 0.12));
          for (var k = -2; k <= 2; k++) if (c + k >= 0 && c + k < N) v[c + k] += f * dt * 6 * (1 - Math.abs(k) * 0.3);
        }
      }
      s.vx *= 0.8;
      s.vy *= 0.8;
      acc += dt;
      while (acc >= STEP) {
        step(STEP);
        acc -= STEP;
      }
    }
    var ink = Array.prototype.map.call(probe.children, function (el) { return getComputedStyle(el).color; });
    ctx.clearRect(0, 0, W, H);
    fill(ink[0], 1, t);
    fill(ink[1], 0, t);
    ctx.beginPath();
    for (var i = 0; i < N; i++) ctx[i ? 'lineTo' : 'moveTo'](colX(i), surf(i, t, 0));
    ctx.strokeStyle = ink[2];
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Bubbles rise and pop at the surface.
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    bubbles.forEach(function (bb) {
      if (!still) {
        bb.y -= bb.sp * dt;
        bb.x += Math.sin(t * 3 + bb.r * 7) * 0.15;
      }
      if (bb.y < surf(Math.round((bb.x / W) * (N - 1)), t, 0) + bb.r + 2) {
        bb.y = H + 6 + ((bb.r * 13) % 30);
        bb.x = 12 + ((bb.x * 7.3 + 41) % 206);
      }
      ctx.beginPath();
      ctx.arc(bb.x, bb.y, bb.r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    var p = Math.max(0, Math.min(1, level));
    pct.textContent = Math.round(p * 100) + '%';
    used.textContent = Math.round(p * GB) + ' of ' + GB + ' GB used';
    raf = requestAnimationFrame(tick);
  }

  function move(e) {
    var r = root.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    if (s.px >= 0) {
      s.vx = (x - s.px) * 60;
      s.vy = (y - s.py) * 60;
    }
    s.px = x;
    s.py = y;
    s.hover = true;
  }
  function leave() {
    s.hover = false;
    s.px = -1;
    s.py = -1;
  }
  function toggle() {
    clean = !clean;
    s.levelT = clean ? CLEAN : FULL;
    s.kick = 70;
    btn.textContent = clean ? 'Undo' : 'Clean up';
    root.setAttribute('aria-label', 'Storage: ' + Math.round(s.levelT * GB) + ' of ' + GB + ' GB used');
  }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  btn.addEventListener('click', toggle);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    btn.removeEventListener('click', toggle);
  };
}

document.querySelectorAll('.card-tank').forEach(initCardTank);
