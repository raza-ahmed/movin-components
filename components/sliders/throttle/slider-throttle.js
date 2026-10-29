function initSliderThrottle(root) {
  var input = root.querySelector('.slider-throttle__input');
  var read = root.querySelector('.slider-throttle__read b');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-throttle-v', v / 100);
    read.textContent = v + '%';
    input.setAttribute('aria-valuetext', v + ' percent');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-throttle').forEach(initSliderThrottle);
