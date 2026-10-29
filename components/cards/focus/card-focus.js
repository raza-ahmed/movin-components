function initCardFocus(root) {
  var label = root.querySelector('.card-focus__hud span');
  if (!label) return;
  var f = 0.5;
  function set(v) {
    f = v;
    root.style.setProperty('--f', f.toFixed(3));
    // Layers sit at depth 0 (far), 0.5 and 1 (near); blur by distance from the focus plane f.
    root.style.setProperty('--b-far', (f * 7).toFixed(2) + 'px');
    root.style.setProperty('--b-mid', (Math.abs(f - 0.5) * 7).toFixed(2) + 'px');
    root.style.setProperty('--b-near', ((1 - f) * 7).toFixed(2) + 'px');
    root.setAttribute('aria-valuenow', String(Math.round(f * 100)));
    // Focus distance readout: the bottom is close, the top is far away.
    var m = 0.4 + Math.pow(1 - f, 2) * 60;
    label.textContent = f < 0.1 ? 'f/1.8 · ∞' : 'f/1.8 · ' + (m < 10 ? m.toFixed(1) : Math.round(m)) + ' m';
  }
  function move(e) {
    var r = root.getBoundingClientRect();
    set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
  }
  function key(e) {
    if (e.key === 'ArrowDown') set(Math.min(1, f + 0.1));
    if (e.key === 'ArrowUp') set(Math.max(0, f - 0.1));
  }
  root.addEventListener('pointermove', move);
  root.addEventListener('keydown', key);
  return function () {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.card-focus').forEach(initCardFocus);
