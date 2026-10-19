function initCardDiorama(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Around the hover pose, the cursor steers the turn a little more each way.
  function move(e) {
    var box = root.getBoundingClientRect();
    var px = (e.clientX - box.left) / box.width - 0.5;
    var py = (e.clientY - box.top) / box.height - 0.5;
    root.classList.add('card-diorama--steer');
    root.style.setProperty('--card-diorama-rx', (16 - py * 18).toFixed(2) + 'deg');
    root.style.setProperty('--card-diorama-ry', (-22 + px * 30).toFixed(2) + 'deg');
  }

  function leave() {
    root.classList.remove('card-diorama--steer');
    root.style.removeProperty('--card-diorama-rx');
    root.style.removeProperty('--card-diorama-ry');
  }

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return function () {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    leave();
  };
}

document.querySelectorAll('.card-diorama').forEach(initCardDiorama);
