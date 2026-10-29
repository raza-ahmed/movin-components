function initSliderSignal(root) {
  var WORDS = ['No signal', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  var input = root.querySelector('.slider-signal__input');
  var word = root.querySelector('.slider-signal__word');
  function update() {
    var v = +input.value;
    var w = WORDS[Math.ceil(v / 20)];
    root.style.setProperty('--slider-signal-v', v / 100);
    word.textContent = w;
    input.setAttribute('aria-valuetext', w);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-signal').forEach(initSliderSignal);
