function initBtnMoire(root) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var pointer = null;
  var x = 0.3;
  var y = 0.5;
  var raf = 0;

  // At rest the second centre circles slowly; under the cursor it follows it, eased.
  function tick(now) {
    var t = now / 1000;
    var target = pointer || { x: 0.5 + Math.cos(t * 0.6) * 0.22, y: 0.5 + Math.sin(t * 0.9) * 0.3 };
    x += (target.x - x) * 0.12;
    y += (target.y - y) * 0.12;
    root.style.setProperty('--x', (x * 100).toFixed(2) + '%');
    root.style.setProperty('--y', (y * 100).toFixed(2) + '%');
    raf = requestAnimationFrame(tick);
  }
  function move(e) {
    var r = root.getBoundingClientRect();
    pointer = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }
  function leave() { pointer = null; }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
  };
}

document.querySelectorAll('.btn-moire').forEach(initBtnMoire);
