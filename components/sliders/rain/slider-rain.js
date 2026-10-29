function initSliderRain(root) {
  var input = root.querySelector('.slider-rain__input');
  var read = root.querySelector('.slider-rain__read');
  function update() {
    var v = +input.value;
    var t = (v - 0) / (40 - 0);
    root.style.setProperty('--slider-rain-v', t);
    var word = v === 0 ? 'Dry' : v < 3 ? 'Drizzle' : v < 10 ? 'Light rain' : v < 25 ? 'Moderate rain' : 'Heavy rain';
    root.toggleAttribute('data-wet', v > 0);
    read.innerHTML = '<b>' + v + ' mm/h</b> · ' + word;
    input.setAttribute('aria-valuetext', v + ' millimetres an hour, ' + word.toLowerCase());
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-rain').forEach(initSliderRain);
