function initSliderWindsock(root) {
  var input = root.querySelector('.slider-windsock__input');
  var read = root.querySelector('.slider-windsock__read');
  var BEAUFORT = ['Calm', 'Light air', 'Light breeze', 'Gentle breeze', 'Moderate breeze', 'Fresh breeze', 'Strong breeze', 'Near gale'];
  function update() {
    var v = +input.value;
    var t = (v - 0) / (30 - 0);
    root.style.setProperty('--slider-windsock-v', t);
    var word = BEAUFORT[Math.min(BEAUFORT.length - 1, Math.floor(v / 4))];
    read.innerHTML = '<b>' + v + ' knots</b> · ' + word;
    input.setAttribute('aria-valuetext', v + ' knots, ' + word.toLowerCase());
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-windsock').forEach(initSliderWindsock);
