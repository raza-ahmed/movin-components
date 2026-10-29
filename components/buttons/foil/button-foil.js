function initBtnFoil(root) {
  // The pale band of the foil follows the pointer across the letters.
  function onMove(e) {
    var r = root.getBoundingClientRect();
    root.style.setProperty('--btn-foil-x', Math.round(((e.clientX - r.left) / r.width) * 100) + '%');
  }
  root.addEventListener('pointermove', onMove);
  return function () { root.removeEventListener('pointermove', onMove); };
}

document.querySelectorAll('.btn-foil').forEach(initBtnFoil);
