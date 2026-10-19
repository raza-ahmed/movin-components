function initRadioDie(root) {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var turns = 0;

  // Every roll adds a whole turn, so the die tumbles to its face instead of
  // just rotating back, and hops while it does.
  function roll() {
    if (reduce) return;
    turns += 1;
    root.style.setProperty('--radio-die-spin', turns * 360 + 'deg');
    root.classList.remove('radio-die--rolling');
    void root.offsetWidth;
    root.classList.add('radio-die--rolling');
  }

  root.addEventListener('change', roll);
  return function () {
    root.removeEventListener('change', roll);
    root.classList.remove('radio-die--rolling');
  };
}

document.querySelectorAll('.radio-die').forEach(initRadioDie);
