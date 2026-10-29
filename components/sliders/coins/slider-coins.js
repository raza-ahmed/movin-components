function initSliderCoins(root) {
  var input = root.querySelector('.slider-coins__input');
  var read = root.querySelector('.slider-coins__label b');
  function update() {
    var n = +input.value;
    root.style.setProperty('--slider-coins-v', n / 10);
    read.textContent = '$' + n;
    input.setAttribute('aria-valuetext', n + ' dollars');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-coins').forEach(initSliderCoins);
