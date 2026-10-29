function initSliderTracking(root) {
  var input = root.querySelector('.slider-tracking__input');
  var read = root.querySelector('.slider-tracking__val');
  function update() {
    var v = +input.value;
    var em = ((v / 100) * 0.55 - 0.05).toFixed(2);
    root.style.setProperty('--slider-tracking-v', v / 100);
    read.textContent = em + ' em';
    input.setAttribute('aria-valuetext', em + ' em');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-tracking').forEach(initSliderTracking);
