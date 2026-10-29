function initSliderGoo(root) {
  var input = root.querySelector('.slider-goo__input');
  function update() {
    root.style.setProperty('--slider-goo-v', input.value / 100);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-goo').forEach(initSliderGoo);
