function initSliderTelescope(root) {
  var input = root.querySelector('.slider-telescope__input');
  var mag = root.querySelector('.slider-telescope__mag');
  function update() {
    var v = +input.value;
    var m = Math.round(10 + (v / 100) * 140);
    root.style.setProperty('--slider-telescope-v', v / 100);
    mag.textContent = m + '×';
    input.setAttribute('aria-valuetext', m + ' times');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-telescope').forEach(initSliderTelescope);
