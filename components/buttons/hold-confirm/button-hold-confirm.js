function initBtnHoldConfirm(root) {
  const DURATION = 1500;
  const CIRC = 2 * Math.PI * 22;
  const arc = root.querySelector('.btn-hold-confirm__arc');
  const pct = root.querySelector('.btn-hold-confirm__pct');
  const label = root.querySelector('.btn-hold-confirm__label');
  const idleText = label.textContent;
  let frame = 0;
  let reset = 0;
  let done = false;

  function draw(p) {
    arc.style.strokeDashoffset = String(CIRC * (1 - p));
    pct.textContent = Math.round(p * 100) + '%';
  }

  // Hold for 1.5 s to fill the ring; let go early and it empties.
  function hold() {
    if (done) return;
    cancelAnimationFrame(frame);
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / DURATION, 1);
      draw(p);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      done = true;
      root.classList.add('btn-hold-confirm--done');
      pct.textContent = '\u2713';
      label.textContent = 'CONFIRMED!';
      reset = setTimeout(() => {
        done = false;
        root.classList.remove('btn-hold-confirm--done');
        label.textContent = idleText;
        draw(0);
      }, 1800);
    };
    frame = requestAnimationFrame(tick);
  }

  function release() {
    if (done) return;
    cancelAnimationFrame(frame);
    draw(0);
  }

  // Space / Enter held down works the same as a held pointer.
  function keydown(event) {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      event.preventDefault();
      hold();
    }
  }
  function keyup(event) {
    if (event.key === ' ' || event.key === 'Enter') release();
  }

  root.addEventListener('pointerdown', hold);
  root.addEventListener('pointerup', release);
  root.addEventListener('pointerleave', release);
  root.addEventListener('keydown', keydown);
  root.addEventListener('keyup', keyup);
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(reset);
    root.removeEventListener('pointerdown', hold);
    root.removeEventListener('pointerup', release);
    root.removeEventListener('pointerleave', release);
    root.removeEventListener('keydown', keydown);
    root.removeEventListener('keyup', keyup);
  };
}

document.querySelectorAll('.btn-hold-confirm').forEach(initBtnHoldConfirm);
