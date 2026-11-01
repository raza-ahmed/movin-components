function initSliderGap(root) {
  var input = root.querySelector('.slider-gap__input');
  var stop = root.querySelector('.slider-gap__stop');
  var pill = root.querySelector('.slider-gap__pill');
  function update() {
    var v = +input.value;
    root.style.setProperty('--slider-gap-v', v / 100);
    // The stop dot steps aside before the handle reaches it.
    stop.style.opacity = v > 92 ? 0 : 1;
    pill.textContent = v;
    input.setAttribute('aria-valuetext', v + '%');
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-gap').forEach(initSliderGap);
