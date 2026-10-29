function initSliderFader(root) {
  var input = root.querySelector('.slider-fader__input');
  var read = root.querySelector('.slider-fader__read');
  function update() {
    var v = +input.value;
    // 0 is silence; the rest maps onto -60 … +6 dB.
    var db = v === 0 ? '-∞' : (-60 + (v / 100) * 66).toFixed(1);
    root.style.setProperty('--slider-fader-v', v / 100);
    read.textContent = db + ' dB';
    input.setAttribute('aria-valuetext', db + ' dB');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-fader').forEach(initSliderFader);
