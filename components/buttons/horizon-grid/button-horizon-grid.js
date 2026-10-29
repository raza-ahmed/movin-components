function initBtnHorizonGrid(root) {
  var floor = root.querySelector('.btn-horizon-grid__floor');
  if (!floor) return;
  // Throttle up or down without a jump: same animation, different playback rate.
  function speed(r) {
    floor.getAnimations().forEach(function (a) { a.updatePlaybackRate(r); });
  }
  function fast() { speed(4); }
  function slow() { speed(1); }
  root.addEventListener('pointerenter', fast);
  root.addEventListener('pointerleave', slow);
  root.addEventListener('focus', fast);
  root.addEventListener('blur', slow);
  return function () {
    root.removeEventListener('pointerenter', fast);
    root.removeEventListener('pointerleave', slow);
    root.removeEventListener('focus', fast);
    root.removeEventListener('blur', slow);
  };
}

document.querySelectorAll('.btn-horizon-grid').forEach(initBtnHorizonGrid);
