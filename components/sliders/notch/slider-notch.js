function initSliderNotch(root) {
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  var input = root.querySelector('.slider-notch__input');
  var labels = root.querySelectorAll('.slider-notch__label');
  var flip = 0;
  function update() {
    var i = +input.value;
    root.style.setProperty('--slider-notch-v', i / 4);
    // Each step flips data-flip between a and b, so the click-in keyframes restart every time.
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
    labels.forEach(function (label, k) { label.toggleAttribute('data-on', k === i); });
    input.setAttribute('aria-valuetext', SIZES[i]);
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-notch').forEach(initSliderNotch);
