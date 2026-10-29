function initSliderBass(root) {
  var input = root.querySelector('.slider-bass__input');
  function update() {
    root.style.setProperty('--slider-bass-v', input.value / 100);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-bass').forEach(initSliderBass);
