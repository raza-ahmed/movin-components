function initRadioFirmness(root) {
  // Spring stiffness and damping per surface (per unit mass), and how widely the dip spreads.
  var SURFACES = { soft: { k: 260, c: 9, spread: 2.2 }, medium: { k: 900, c: 14, spread: 1.6 }, firm: { k: 4000, c: 22, spread: 1.2 } };
  var G = 1400;
  var S = 80;
  var R = 11;
  var DROP = 64;
  var bed = root.querySelector('.radio-firmness__bed');
  var ball = root.querySelector('.radio-firmness__ball');
  var shadow = root.querySelector('.radio-firmness__shadow');
  var raf = 0;
  // The mattress top dipped under the ball, for a ball height h above the surface.
  function draw(h, spread) {
    var d = Math.max(0, -h);
    var w = 16 + d * spread;
    bed.setAttribute('d', 'M20 ' + S + 'L' + (110 - w).toFixed(1) + ' ' + S + 'Q110 ' + (S + 2 * d).toFixed(1) + ' ' + (110 + w).toFixed(1) + ' ' + S + 'L200 ' + S + 'V104Q200 108 196 108H24Q20 108 20 104Z');
    ball.setAttribute('cy', (S - h - R).toFixed(1));
    shadow.style.opacity = String(Math.max(0, 1 - h / 70) * 0.5);
  }
  // Each pick drops the ball onto the new surface. In the air only gravity acts; once it presses
  // in, the surface pushes back like a damped spring, so a soft one swallows the ball and a firm
  // one throws it back up.
  function onChange(e) {
    var o = SURFACES[e.target.value];
    var rest = -G / o.k;
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return draw(rest, o.spread);
    var h = DROP;
    var v = 0;
    var last = performance.now();
    var t0 = last;
    function step(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (var k = 0; k < 8; k++) {
        var a = -G + (h < 0 ? -o.k * h - o.c * v : 0);
        v += a * (dt / 8);
        h += v * (dt / 8);
      }
      if (now - t0 > 400 && Math.abs(v) < 3 && Math.abs(h - rest) < 0.15) return draw(rest, o.spread);
      draw(h, o.spread);
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  root.addEventListener('change', onChange);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('change', onChange);
  };
}

document.querySelectorAll('.radio-firmness').forEach(initRadioFirmness);
