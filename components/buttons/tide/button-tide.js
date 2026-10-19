function initBtnTide(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var tilt = 0;
  var v = 0;
  var push = 0; // decays: a fast swipe tips the water, then it settles
  var lastX = null;
  var lastT = 0;
  var raf = 0;

  function tick() {
    push *= 0.9;
    v = (v + (push - tilt) * 0.08) * 0.88;
    tilt += v;
    root.style.setProperty('--btn-tide-tilt', tilt.toFixed(2) + 'deg');
    if (Math.abs(tilt) + Math.abs(v) + Math.abs(push) > 0.02) raf = requestAnimationFrame(tick);
    else {
      raf = 0;
      root.style.setProperty('--btn-tide-tilt', '0deg');
    }
  }

  function move(e) {
    var now = performance.now();
    if (lastX !== null) {
      var vx = (e.clientX - lastX) / Math.max(8, now - lastT); // px per ms
      // Moving right piles the water up on the left: tilt counter-clockwise.
      push = Math.max(-10, Math.min(10, push - vx * 5));
    }
    lastX = e.clientX;
    lastT = now;
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function leave() {
    lastX = null;
  }

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return function () {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    cancelAnimationFrame(raf);
    root.style.removeProperty('--btn-tide-tilt');
  };
}

document.querySelectorAll('.btn-tide').forEach(initBtnTide);
