function initToggleOrbit(root) {
  var input = root.querySelector('input');
  var planet = root.querySelector('.toggle-orbit__planet');
  if (!input || !planet) return;
  // Each press sends the planet half a lap further; a closed path wraps, so it always moves forward.
  var laps = 0;
  function change() {
    laps += 1;
    planet.style.offsetDistance = laps * 50 + '%';
  }
  input.addEventListener('change', change);
  return function () { input.removeEventListener('change', change); };
}

document.querySelectorAll('.toggle-orbit').forEach(initToggleOrbit);
