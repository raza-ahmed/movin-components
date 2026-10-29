function initSliderCompare(root) {
  var input = root.querySelector('.slider-compare__input');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-compare-v', v / 100);
    input.setAttribute('aria-valuetext', 100 - v + ' percent after');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-compare').forEach(initSliderCompare);
