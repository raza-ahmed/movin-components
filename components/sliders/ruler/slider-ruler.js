function initSliderRuler(root) {
  var MIN = 40;
  var MAX = 120;
  var input = root.querySelector('.slider-ruler__input');
  var read = root.querySelector('.slider-ruler__num');
  function update() {
    var kg = +input.value;
    root.style.setProperty('--slider-ruler-v', (kg - MIN) / (MAX - MIN));
    read.textContent = kg;
    input.setAttribute('aria-valuetext', kg + ' kilograms');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-ruler').forEach(initSliderRuler);
