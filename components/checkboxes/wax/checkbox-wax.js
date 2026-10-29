function initCbWax(root) {
  var input = root.querySelector('input');
  if (!input) return;
  // Animate only after the first change, so nothing plays on page load.
  function arm() { root.setAttribute('data-armed', ''); }
  input.addEventListener('change', arm);
  return function () { input.removeEventListener('change', arm); };
}

document.querySelectorAll('.cb-wax').forEach(initCbWax);
