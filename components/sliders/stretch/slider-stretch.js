function initSliderStretch(root) {
  var input = root.querySelector('.slider-stretch__input');
  var v = +input.value;
  var settle;
  function update() {
    var next = +input.value;
    // The faster the drag, the longer the thumb; it stretches back from its leading edge.
    root.style.setProperty('--slider-stretch-s', Math.min(1.1, Math.abs(next - v) * 0.12).toFixed(2));
    root.style.setProperty('--slider-stretch-o', next > v ? '100%' : '0%');
    v = next;
    root.style.setProperty('--slider-stretch-v', v / 100);
    clearTimeout(settle);
    settle = setTimeout(function () { root.style.setProperty('--slider-stretch-s', '0.00'); }, 90);
  }
  input.addEventListener('input', update);
  return function () {
    clearTimeout(settle);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-stretch').forEach(initSliderStretch);
