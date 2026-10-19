function initCardHolo(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function move(e) {
    var box = root.getBoundingClientRect();
    var px = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
    var py = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
    root.classList.add('card-holo--active');
    root.style.setProperty('--card-holo-rx', ((px - 0.5) * 28).toFixed(2) + 'deg');
    root.style.setProperty('--card-holo-ry', ((0.5 - py) * 28).toFixed(2) + 'deg');
    root.style.setProperty('--card-holo-x', (px * 100).toFixed(1) + '%');
    root.style.setProperty('--card-holo-y', (py * 100).toFixed(1) + '%');
    root.style.setProperty('--card-holo-o', '1');
  }

  function leave() {
    root.classList.remove('card-holo--active');
    root.style.setProperty('--card-holo-rx', '0deg');
    root.style.setProperty('--card-holo-ry', '0deg');
    root.style.setProperty('--card-holo-o', '0');
  }

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return function () {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    leave();
  };
}

document.querySelectorAll('.card-holo').forEach(initCardHolo);
