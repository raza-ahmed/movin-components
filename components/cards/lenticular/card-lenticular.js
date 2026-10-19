function initCardLenticular(root) {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function move(e) {
    var box = root.getBoundingClientRect();
    var px = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
    // Like the real thing it flips over a narrow band of angles, not linearly.
    var k = Math.max(0, Math.min(1, (px - 0.38) / 0.24));
    var t = k * k * (3 - 2 * k);
    root.style.setProperty('--card-lenticular-t', t.toFixed(3));
    root.style.setProperty('--card-lenticular-x', (px * 100).toFixed(1) + '%');
    if (!reduce) root.style.setProperty('--card-lenticular-r', ((px - 0.5) * 22).toFixed(2) + 'deg');
  }

  function leave() {
    root.style.removeProperty('--card-lenticular-t');
    root.style.removeProperty('--card-lenticular-x');
    root.style.removeProperty('--card-lenticular-r');
  }

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return function () {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    leave();
  };
}

document.querySelectorAll('.card-lenticular').forEach(initCardLenticular);
