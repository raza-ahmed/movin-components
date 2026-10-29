function initSliderWindow(root) {
  var input = root.querySelector('.slider-window__input');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-window-v', v / 100);
    // The wind starts halfway down; the ears flap from three quarters.
    root.toggleAttribute('data-open', v >= 50);
    root.toggleAttribute('data-breeze', v >= 75);
    input.setAttribute('aria-valuetext', v + ' percent open');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-window').forEach(initSliderWindow);
