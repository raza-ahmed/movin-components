function initSliderFocus(root) {
  var input = root.querySelector('.slider-focus__input');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-focus-v', v / 100);
    // Sharp enough: the focus box locks on.
    root.toggleAttribute('data-locked', v >= 96);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-focus').forEach(initSliderFocus);
