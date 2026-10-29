function initBtnOscilloscope(root) {
  var path = root.querySelector('.btn-oscilloscope__trace');
  if (!path) return;
  var W = 124;
  var H = 38;
  var N = 90;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hover = 0;
  var blend = 0;
  var phase = 0;
  var pulse = null;
  var last = performance.now();
  var raf = 0;

  function draw() {
    var d = '';
    var amp = 8 + 4 * blend;
    for (var i = 0; i <= N; i++) {
      var u = i / N;
      var s = Math.sin(u * Math.PI * 2 * (2 + blend) + phase);
      // tanh(7·sin) flattens the sine into a square wave as blend rises.
      var y = (s * (1 - blend) + Math.tanh(7 * s) * blend) * amp;
      if (pulse !== null) y -= 13 * Math.exp(-Math.pow((u - pulse) / 0.035, 2));
      d += (i ? 'L' : 'M') + (u * W).toFixed(1) + ' ' + (H / 2 + y).toFixed(1);
    }
    path.setAttribute('d', d);
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    blend += (hover - blend) * Math.min(1, dt * 6);
    phase -= dt * (3 + 5 * blend);
    if (pulse !== null) {
      pulse += dt * 1.4;
      if (pulse > 1.1) pulse = null;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function on() { hover = 1; }
  function off() { hover = 0; }
  function fire() { pulse = -0.1; }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);
  root.addEventListener('click', fire);
  if (still) draw();
  else raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
    root.removeEventListener('click', fire);
  };
}

document.querySelectorAll('.btn-oscilloscope').forEach(initBtnOscilloscope);
