function initBtnCharge(root) {
  const DURATION = 1500;
  const fill = root.querySelector('.btn-charge__fill');
  const label = root.querySelector('.btn-charge__label');
  const idleText = label.textContent;
  let phase = 'idle';
  let frame = 0;
  let reset = 0;

  function set(next, width, text) {
    phase = next;
    root.dataset.phase = next;
    fill.style.width = width + '%';
    label.textContent = text;
  }

  // Hovering fills the bar over 1.5 s; reach the end and it fires.
  function start() {
    if (phase !== 'idle') return;
    set('charging', 0, 'Charging...');
    const t0 = performance.now();
    const tick = (now) => {
      const pct = Math.min(((now - t0) / DURATION) * 100, 100);
      fill.style.width = pct + '%';
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }
      set('fired', 100, 'FIRED!');
      reset = setTimeout(() => set('idle', 0, idleText), 800);
    };
    frame = requestAnimationFrame(tick);
  }

  // Leave early and the charge drains away.
  function stop() {
    if (phase !== 'charging') return;
    cancelAnimationFrame(frame);
    set('idle', 0, idleText);
  }

  root.addEventListener('pointerenter', start);
  root.addEventListener('pointerleave', stop);
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(reset);
    root.removeEventListener('pointerenter', start);
    root.removeEventListener('pointerleave', stop);
  };
}

document.querySelectorAll('.btn-charge').forEach(initBtnCharge);
