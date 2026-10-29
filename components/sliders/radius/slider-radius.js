function initSliderRadius(root) {
  var input = root.querySelector('.slider-radius__input');
  var read = root.querySelector('.slider-radius__px');
  function update() {
    var r = +input.value;
    root.style.setProperty('--slider-radius-v', r / 50);
    read.textContent = r + 'px';
    input.setAttribute('aria-valuetext', r + ' pixels');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-radius').forEach(initSliderRadius);
