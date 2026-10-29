function initSliderShade(root) {
  var input = root.querySelector('.slider-shade__input');
  var read = root.querySelector('.slider-shade__val');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-shade-v', v / 100);
    read.textContent = v + '%';
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-shade').forEach(initSliderShade);
