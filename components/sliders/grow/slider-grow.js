function initSliderGrow(root) {
  var input = root.querySelector('.slider-grow__input');
  function update() {
    root.style.setProperty('--slider-grow-v', input.value / 100);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-grow').forEach(initSliderGrow);
