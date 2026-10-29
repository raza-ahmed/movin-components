function initBtnLiquidChrome(root) {
  function move(e) {
    var r = root.getBoundingClientRect();
    var u = (e.clientX - r.left) / r.width;
    var v = (e.clientY - r.top) / r.height;
    // Reflections move against the cursor, as they would on a curved surface.
    root.style.setProperty('--x', (100 - u * 100).toFixed(1) + '%');
    root.style.setProperty('--y', (100 - v * 100).toFixed(1) + '%');
    root.style.setProperty('--hx', (u * 100).toFixed(1) + '%');
    root.style.setProperty('--hy', (v * 100).toFixed(1) + '%');
  }
  function leave() {
    root.style.setProperty('--x', '50%');
    root.style.setProperty('--y', '50%');
  }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return function () {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
  };
}

document.querySelectorAll('.btn-liquid-chrome').forEach(initBtnLiquidChrome);
