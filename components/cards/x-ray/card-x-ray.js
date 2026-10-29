function initCardXRay(root) {
  function move(e) {
    var r = root.getBoundingClientRect();
    root.style.setProperty('--x', e.clientX - r.left + 'px');
    root.style.setProperty('--y', e.clientY - r.top + 'px');
  }
  root.addEventListener('pointermove', move);
  return function () { root.removeEventListener('pointermove', move); };
}

document.querySelectorAll('.card-x-ray').forEach(initCardXRay);
