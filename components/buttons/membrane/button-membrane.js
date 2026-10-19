function initBtnMembrane(root) {
  var path = root.querySelector('.btn-membrane__fill');
  if (!path || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Each side of the rounded rectangle is a quadratic curve whose control point
  // rides a spring: n = bulge along the outward normal (px), a = where along
  // the side (0..1) the bulge peaks.
  var REACH = 64; // how far an edge follows the cursor before it lets go
  var w = 0;
  var h = 0;
  var r = 14;
  var sides = [0, 1, 2, 3].map(function () {
    return { n: 0, vn: 0, tn: 0, a: 0.5, va: 0, ta: 0.5 };
  });
  var label = { x: 0, vx: 0, tx: 0, y: 0, vy: 0, ty: 0 };
  var armed = false; // the cursor has been inside, so leaving drags an edge
  var held = false;
  var active = false;
  var raf = 0;
  var last = 0;

  function draw() {
    var t = sides[0], rt = sides[1], b = sides[2], l = sides[3];
    var sw = w - 2 * r;
    var sh = h - 2 * r;
    path.setAttribute(
      'd',
      'M' + r + ' 0' +
        'Q' + (r + t.a * sw) + ' ' + -2 * t.n + ' ' + (w - r) + ' 0' +
        'A' + r + ' ' + r + ' 0 0 1 ' + w + ' ' + r +
        'Q' + (w + 2 * rt.n) + ' ' + (r + rt.a * sh) + ' ' + w + ' ' + (h - r) +
        'A' + r + ' ' + r + ' 0 0 1 ' + (w - r) + ' ' + h +
        'Q' + (r + b.a * sw) + ' ' + (h + 2 * b.n) + ' ' + r + ' ' + h +
        'A' + r + ' ' + r + ' 0 0 1 0 ' + (h - r) +
        'Q' + -2 * l.n + ' ' + (r + l.a * sh) + ' 0 ' + r +
        'A' + r + ' ' + r + ' 0 0 1 ' + r + ' 0Z'
    );
    root.style.setProperty('--btn-membrane-lx', label.x.toFixed(2) + 'px');
    root.style.setProperty('--btn-membrane-ly', label.y.toFixed(2) + 'px');
  }

  function tick(now) {
    var dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    var moving = false;
    for (var i = 0; i < 4; i++) {
      var s = sides[i];
      s.vn += (520 * (s.tn - s.n) - 16 * s.vn) * dt; // loose: it wobbles
      s.n += s.vn * dt;
      s.va += (260 * (s.ta - s.a) - 30 * s.va) * dt;
      s.a += s.va * dt;
      if (Math.abs(s.vn) > 0.02 || Math.abs(s.tn - s.n) > 0.02 || Math.abs(s.va) > 0.001 || Math.abs(s.ta - s.a) > 0.001) moving = true;
    }
    label.vx += (300 * (label.tx - label.x) - 22 * label.vx) * dt;
    label.x += label.vx * dt;
    label.vy += (300 * (label.ty - label.y) - 22 * label.vy) * dt;
    label.y += label.vy * dt;
    if (Math.abs(label.vx) + Math.abs(label.vy) > 0.02 || Math.abs(label.tx - label.x) + Math.abs(label.ty - label.y) > 0.02) moving = true;
    draw();
    raf = moving ? requestAnimationFrame(tick) : 0;
  }

  function kick() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function aim(px, py) {
    var rest = held ? -5 : 0;
    for (var i = 0; i < 4; i++) {
      sides[i].tn = rest;
      sides[i].ta = 0.5;
    }
    label.tx = 0;
    label.ty = 0;
    var inside = px >= 0 && px <= w && py >= 0 && py <= h;
    if (inside) {
      armed = true;
      label.tx = (px - w / 2) * 0.1;
      label.ty = (py - h / 2) * 0.16;
    } else if (armed) {
      // The side the cursor left through is the one it is furthest past.
      var d = [-py, px - w, py - h, -px];
      var side = 0;
      for (var j = 1; j < 4; j++) if (d[j] > d[side]) side = j;
      var dist = d[side];
      if (dist > REACH) {
        armed = false; // it lets go; the spring does the wobble
      } else {
        var s = sides[side];
        s.tn = dist * 0.8;
        s.ta = clamp(side % 2 === 0 ? (px - r) / (w - 2 * r) : (py - r) / (h - 2 * r), 0.12, 0.88);
        label.tx = clamp(side === 1 ? dist * 0.18 : side === 3 ? -dist * 0.18 : (px - w / 2) * 0.08, -12, 12);
        label.ty = clamp(side === 0 ? -dist * 0.22 : side === 2 ? dist * 0.22 : (py - h / 2) * 0.1, -12, 12);
      }
    }
  }

  function onMove(e) {
    var box = root.getBoundingClientRect();
    var px = e.clientX - box.left;
    var py = e.clientY - box.top;
    var near = armed || held || (px >= 0 && px <= w && py >= 0 && py <= h);
    if (!near && !active) return; // nothing to do far away
    active = near;
    aim(px, py);
    kick();
  }

  function release() {
    armed = false;
    active = false;
    aim(-1e4, -1e4);
    kick();
  }

  function onDown() {
    held = true;
    for (var i = 0; i < 4; i++) sides[i].tn = -5;
    kick();
  }

  function onUp() {
    if (!held) return;
    held = false;
    for (var i = 0; i < 4; i++) {
      sides[i].tn = Math.max(0, sides[i].tn);
      sides[i].vn += 150; // the boing
    }
    kick();
  }

  function measure() {
    w = root.offsetWidth;
    h = root.offsetHeight;
    r = Math.min(14, h / 2 - 1);
    draw();
  }

  var ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  root.classList.add('btn-membrane--live');
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', release);
  window.addEventListener('blur', release);
  root.addEventListener('pointerdown', onDown);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);

  return function () {
    ro.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', release);
    window.removeEventListener('blur', release);
    root.removeEventListener('pointerdown', onDown);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    root.classList.remove('btn-membrane--live');
    path.removeAttribute('d');
  };
}

document.querySelectorAll('.btn-membrane').forEach(initBtnMembrane);
