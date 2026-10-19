function initBtnParticleText(root) {
  var canvas = root.querySelector('.btn-particle-text__canvas');
  var label = root.querySelector('.btn-particle-text__label');
  if (!canvas || !label || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var COLOR = '';
  var parts = []; // flat: x, y, vx, vy, homeX, homeY, alpha — in device pixels
  var STRIDE = 7;
  var dpr = 1;
  var pointer = null; // device px inside the canvas, or null
  var pull = 0.07; // spring towards home; dropped after a burst so the dust drifts first
  var raf = 0;
  var dead = false;

  function build() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    COLOR = getComputedStyle(root).color; // particles in the button's text colour
    var box = canvas.getBoundingClientRect();
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    var lb = label.getBoundingClientRect();
    var cs = getComputedStyle(label);
    // Sample the word: draw it once, keep every inked pixel as a particle.
    var off = document.createElement('canvas');
    off.width = canvas.width;
    off.height = canvas.height;
    var o = off.getContext('2d');
    o.scale(dpr, dpr);
    o.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    if ('letterSpacing' in o) o.letterSpacing = cs.letterSpacing;
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillStyle = '#000';
    o.fillText(label.textContent.trim(), lb.left - box.left + lb.width / 2, lb.top - box.top + lb.height / 2 + 1);
    var data = o.getImageData(0, 0, off.width, off.height).data;
    var out = [];
    for (var y = 0; y < off.height; y++) {
      for (var x = 0; x < off.width; x++) {
        var a = data[(y * off.width + x) * 4 + 3];
        if (a > 24) out.push(x, y, 0, 0, x, y, a / 255);
      }
    }
    parts = new Float32Array(out);
    root.classList.add('btn-particle-text--live');
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR;
    for (var i = 0; i < parts.length; i += STRIDE) {
      ctx.globalAlpha = parts[i + 6];
      ctx.fillRect(parts[i], parts[i + 1], 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  function tick() {
    var R = 30 * dpr;
    var R2 = R * R;
    var energy = 0;
    pull = Math.min(0.07, pull * 1.06);
    for (var i = 0; i < parts.length; i += STRIDE) {
      var x = parts[i], y = parts[i + 1], vx = parts[i + 2], vy = parts[i + 3];
      if (pointer) {
        var dx = x - pointer.x;
        var dy = y - pointer.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          var d = Math.sqrt(d2) || 1;
          var f = (1 - d / R) * 2.4 * dpr;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        }
      }
      vx = (vx + (parts[i + 4] - x) * pull) * 0.86;
      vy = (vy + (parts[i + 5] - y) * pull) * 0.86;
      parts[i] = x + vx;
      parts[i + 1] = y + vy;
      parts[i + 2] = vx;
      parts[i + 3] = vy;
      energy += Math.abs(vx) + Math.abs(vy) + Math.abs(parts[i + 4] - x) + Math.abs(parts[i + 5] - y);
    }
    if (!pointer && energy < parts.length * 0.002) {
      // Settled: snap home so the resting frame is the crisp word.
      for (var j = 0; j < parts.length; j += STRIDE) {
        parts[j] = parts[j + 4];
        parts[j + 1] = parts[j + 5];
        parts[j + 2] = parts[j + 3] = 0;
      }
      draw();
      raf = 0;
      return;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function kick() {
    if (!raf && !dead) raf = requestAnimationFrame(tick);
  }

  function onMove(e) {
    var box = canvas.getBoundingClientRect();
    var x = e.clientX - box.left;
    var y = e.clientY - box.top;
    pointer = x >= 0 && y >= 0 && x <= box.width && y <= box.height ? { x: x * dpr, y: y * dpr } : null;
    if (pointer) kick();
  }

  function onLeave() {
    pointer = null;
  }

  function burst(e) {
    var box = canvas.getBoundingClientRect();
    // From the click point; from the centre for a keyboard press.
    var cx = (e.detail ? e.clientX - box.left : box.width / 2) * dpr;
    var cy = (e.detail ? e.clientY - box.top : box.height / 2) * dpr;
    for (var i = 0; i < parts.length; i += STRIDE) {
      var dx = parts[i] - cx;
      var dy = parts[i + 1] - cy;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var speed = (2 + Math.random() * 7) * dpr;
      var turn = (Math.random() - 0.5) * 1.2;
      parts[i + 2] += ((dx / d) * Math.cos(turn) - (dy / d) * Math.sin(turn)) * speed;
      parts[i + 3] += ((dx / d) * Math.sin(turn) + (dy / d) * Math.cos(turn)) * speed - Math.random() * 2 * dpr;
    }
    pull = 0.004;
    kick();
  }

  var ro = new ResizeObserver(function () {
    if (!dead) build();
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
    if (dead) return;
    build();
    ro.observe(root);
  });
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  root.addEventListener('click', burst);

  return function () {
    dead = true;
    ro.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('click', burst);
    root.classList.remove('btn-particle-text--live');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

document.querySelectorAll('.btn-particle-text').forEach(initBtnParticleText);
