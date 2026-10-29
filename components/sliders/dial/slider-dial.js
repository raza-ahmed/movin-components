function initSliderDial(root) {
  var input = root.querySelector('.slider-dial__input');
  var read = root.querySelector('.slider-dial__value');
  function update() {
    var v = +input.value;
    var gain = (v / 10).toFixed(1);
    root.style.setProperty('--slider-dial-v', v / 100);
    read.textContent = gain;
    input.setAttribute('aria-valuetext', gain);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-dial').forEach(initSliderDial);
