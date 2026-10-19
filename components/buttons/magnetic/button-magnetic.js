function initBtnMagnetic(root) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  // A small spring (stiffness 150, damping 15, mass 0.1) chases the target offset.
  const K = 150;
  const C = 15;
  const M = 0.1;
  const pos = { x: 0, y: 0 };
  const vel = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let frame = 0;
  let last = 0;

  function step(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    let moving = false;
    for (const axis of ['x', 'y']) {
      const force = -K * (pos[axis] - target[axis]) - C * vel[axis];
      vel[axis] += (force / M) * dt;
      pos[axis] += vel[axis] * dt;
      if (Math.abs(vel[axis]) > 0.01 || Math.abs(pos[axis] - target[axis]) > 0.01) moving = true;
    }
    root.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    frame = moving ? requestAnimationFrame(step) : 0;
  }

  function kick() {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  }

  // The button leans 35% of the way toward the cursor.
  function move(event) {
    if (reduce.matches) return;
    const rect = root.getBoundingClientRect();
    target.x = (event.clientX - (rect.left - pos.x + rect.width / 2)) * 0.35;
    target.y = (event.clientY - (rect.top - pos.y + rect.height / 2)) * 0.35;
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

document.querySelectorAll('.btn-magnetic').forEach(initBtnMagnetic);
