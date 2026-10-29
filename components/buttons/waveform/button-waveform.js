function initBtnWaveform(root) {
  var bars = root.querySelectorAll('.btn-waveform__bar');
  var count = bars.length;
  if (!count) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bars.forEach(function (b, i) {
      b.style.transform = 'scaleY(' + (0.15 + 0.12 * Math.abs(Math.sin(i * 0.7))) + ')';
    });
    return;
  }
  var cursor = { x: 0.5, on: 0 };
  var energy = 0;
  var raf = 0;

  function tick(now) {
    var t = now / 1000;
    energy += (cursor.on - energy) * 0.08;
    bars.forEach(function (b, i) {
      var u = i / (count - 1);
      var idle = 0.14 + 0.1 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 0.55));
      // A bump centred on the cursor, pulsing with a fast two-sine beat.
      var near = Math.exp(-Math.pow((u - cursor.x) / 0.16, 2));
      var beat = 0.55 + 0.45 * Math.sin(t * 11 + i * 1.7) * Math.sin(t * 5.3 + i);
      b.style.transform = 'scaleY(' + Math.min(1, idle + energy * near * beat * 0.95).toFixed(3) + ')';
      b.style.background = near * energy > 0.35 ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(#cbced3, #393c41)';
    });
    raf = requestAnimationFrame(tick);
  }

  function move(e) {
    var r = root.getBoundingClientRect();
    cursor = { x: (e.clientX - r.left - 22) / (r.width - 44), on: 1 };
  }
  function leave() { cursor.on = 0; }
  function focus() { cursor = { x: 0.5, on: 1 }; }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('focus', focus);
  root.addEventListener('blur', leave);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('focus', focus);
    root.removeEventListener('blur', leave);
  };
}

document.querySelectorAll('.btn-waveform').forEach(initBtnWaveform);
