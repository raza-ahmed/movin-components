function initBtnFingerprint(root) {
  var ridges = root.querySelectorAll('.btn-fingerprint__lit path');
  var beam = root.querySelector('.btn-fingerprint__beam');
  var text = root.querySelector('.btn-fingerprint__text');
  var hint = root.querySelector('.btn-fingerprint__hint');
  if (!ridges.length || !beam || !text || !hint) return;
  var HOLD_MS = 1400;
  var state = 'idle';
  var holding = false;
  var p = 0;
  var doneAt = 0;
  var last = performance.now();
  var raf = 0;

  function setState(s) {
    state = s;
    root.setAttribute('data-state', s);
    text.firstChild.textContent = s === 'done' ? 'Verified' : s === 'scanning' ? 'Scanning…' : 'Touch ID';
    hint.textContent = s === 'done' ? 'Access granted' : 'Press and hold';
  }

  function tick(now) {
    var dt = now - last;
    last = now;
    if (doneAt) {
      if (now - doneAt > 1800) {
        doneAt = 0;
        setState('idle');
      }
    } else if (holding) {
      p = Math.min(1, p + dt / HOLD_MS);
      if (p >= 1) {
        doneAt = now;
        holding = false;
        setState('done');
      }
    } else {
      p = Math.max(0, p - dt / 400);
    }
    var shown = doneAt ? 1 : p;
    // Ridges fill in one after another, overlapping, across the hold.
    ridges.forEach(function (path, i) {
      path.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, shown * 1.6 - i * 0.09)));
    });
    beam.style.top = 8 + 36 * (0.5 - 0.5 * Math.cos(now / 260)) + 'px';
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (state === 'done') return;
    holding = true;
    setState('scanning');
  }
  function stop() {
    if (!holding) return;
    holding = false;
    if (state !== 'done') setState('idle');
  }
  function keydown(e) {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start();
  }
  function menu(e) { e.preventDefault(); }
  root.addEventListener('pointerdown', start);
  root.addEventListener('pointerup', stop);
  root.addEventListener('pointerleave', stop);
  root.addEventListener('keydown', keydown);
  root.addEventListener('keyup', stop);
  root.addEventListener('contextmenu', menu);
  raf = requestAnimationFrame(tick);

  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerdown', start);
    root.removeEventListener('pointerup', stop);
    root.removeEventListener('pointerleave', stop);
    root.removeEventListener('keydown', keydown);
    root.removeEventListener('keyup', stop);
    root.removeEventListener('contextmenu', menu);
  };
}

document.querySelectorAll('.btn-fingerprint').forEach(initBtnFingerprint);
