function initSliderInvert(root) {
  var input = root.querySelector('.slider-invert__input');
  // The label row exists twice: once on the track, once on the fill in the inverse colour.
  var values = root.querySelectorAll('.slider-invert__row b');
  var icons = root.querySelectorAll('.slider-invert__icon');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-invert-w', 'calc(1px + ' + v / 100 + ' * (100% - 2px))');
    values.forEach(function (b) { b.textContent = v + '%'; });
    // Waves come in as the level rises; at zero they give way to a cross.
    icons.forEach(function (icon) {
      var parts = icon.querySelectorAll('path');
      parts[1].classList.toggle('slider-invert__off', v === 0);
      parts[2].classList.toggle('slider-invert__off', v < 50);
      parts[3].classList.toggle('slider-invert__off', v > 0);
    });
    input.setAttribute('aria-valuetext', v + '%');
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-invert').forEach(initSliderInvert);
