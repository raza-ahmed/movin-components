function initBtnTilt3d(root) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Springs (stiffness 200, damping 20) chase the target tilt, so it lags and settles.
  const K = 200;
  const C = 20;
  const angle = { x: 0, y: 0 };
  const vel = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let frame = 0;
  let last = 0;

  function step(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    let moving = false;
    for (const axis of ['x', 'y']) {
      vel[axis] += (-K * (angle[axis] - target[axis]) - C * vel[axis]) * dt;
      angle[axis] += vel[axis] * dt;
      if (Math.abs(vel[axis]) > 0.01 || Math.abs(angle[axis] - target[axis]) > 0.01) moving = true;
    }
    root.style.transform = `perspective(600px) rotateX(${angle.x}deg) rotateY(${angle.y}deg)`;
    frame = moving ? requestAnimationFrame(step) : 0;
  }

  function kick() {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  }

  function move(event) {
    const rect = root.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    root.style.setProperty('--btn-tilt-3d-sx', (px + 0.5) * 220 - 60 + '%');
    root.style.setProperty('--btn-tilt-3d-sy', (py + 0.5) * 220 - 60 + '%');
    if (reduce.matches) return;
    target.x = py * -28;
    target.y = px * 28;
    kick();
  }

  function leave() {
    target.x = 0;
    target.y = 0;
    kick();
  }

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return () => {
    cancelAnimationFrame(frame);
    root.style.transform = '';
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
  };
}

document.querySelectorAll('.btn-tilt-3d').forEach(initBtnTilt3d);
