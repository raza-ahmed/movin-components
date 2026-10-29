function initCardShowcase(root) {
  // Speed the turntable up without a jump: same animation, faster playback.
  function rate(r) {
    root.querySelectorAll('.card-showcase__product, .card-showcase__reflection').forEach(function (p) {
      p.getAnimations().forEach(function (a) { a.updatePlaybackRate(r); });
    });
  }
  function fast() { rate(6); }
  function slow() { rate(1); }
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

document.querySelectorAll('.card-showcase').forEach(initCardShowcase);
