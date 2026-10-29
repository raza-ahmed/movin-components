function initSliderThermometer(root) {
  var input = root.querySelector('.slider-thermometer__input');
  var read = root.querySelector('.slider-thermometer__deg');
  function update() {
    var v = +input.value;
    var deg = Math.round(-10 + (v / 100) * 50);
    root.style.setProperty('--slider-thermometer-v', v / 100);
    // The bulb bubbles near the top of the scale.
    root.toggleAttribute('data-hot', v >= 85);
    read.textContent = deg + '°';
    input.setAttribute('aria-valuetext', deg + ' degrees Celsius');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-thermometer').forEach(initSliderThermometer);
