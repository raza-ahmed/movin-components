function initSliderOvercast(root) {
  var input = root.querySelector('.slider-overcast__input');
  var read = root.querySelector('.slider-overcast__read');
  function update() {
    var v = +input.value;
    var t = (v - 0) / (100 - 0);
    root.style.setProperty('--slider-overcast-v', t);
    var word = v < 10 ? 'Clear' : v < 35 ? 'Mostly sunny' : v < 65 ? 'Partly cloudy' : v < 90 ? 'Mostly cloudy' : 'Overcast';
    read.innerHTML = '<b>' + v + '%</b> · ' + word;
    input.setAttribute('aria-valuetext', v + ' percent, ' + word.toLowerCase());
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-overcast').forEach(initSliderOvercast);
