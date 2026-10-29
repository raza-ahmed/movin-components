function initSliderPitch(root) {
  var input = root.querySelector('.slider-pitch__input');
  var read = root.querySelector('.slider-pitch__hz');
  function update() {
    var v = +input.value;
    // Three octaves up from A2.
    var hz = Math.round(110 * Math.pow(2, (v / 100) * 3));
    root.style.setProperty('--slider-pitch-v', v / 100);
    read.textContent = hz + ' Hz';
    input.setAttribute('aria-valuetext', hz + ' hertz');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-pitch').forEach(initSliderPitch);
