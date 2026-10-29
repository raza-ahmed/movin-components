function initSliderCandle(root) {
  var input = root.querySelector('.slider-candle__input');
  var read = root.querySelector('.slider-candle__read');
  function update() {
    var v = +input.value;
    var t = (v - 0) / (8 - 0);
    root.style.setProperty('--slider-candle-v', t);
    read.innerHTML = '<b>' + (8 - v) + ' h</b> of light left';
    input.setAttribute('aria-valuetext', (8 - v) + ' hours left');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-candle').forEach(initSliderCandle);
