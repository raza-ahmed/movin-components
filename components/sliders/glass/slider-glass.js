function initSliderGlass(root) {
  var W = 240, TW = 40;
  var input = root.querySelector('.slider-glass__input');
  // The thumb, the fill and the copy inside the lens all read one position, so the lens always magnifies what is under it.
  function update() {
    root.style.setProperty('--slider-glass-x', TW / 2 + (input.value / 100) * (W - TW) + 'px');
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-glass').forEach(initSliderGlass);
