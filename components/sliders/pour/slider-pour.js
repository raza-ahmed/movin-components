function initSliderPour(root) {
  var input = root.querySelector('.slider-pour__input');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-pour-v', v / 100);
    input.setAttribute('aria-valuetext', v + ' percent full');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-pour').forEach(initSliderPour);
