function initSliderBubble(root) {
  var input = root.querySelector('.slider-bubble__input');
  var read = root.querySelector('.slider-bubble__lean');
  var v = +input.value;
  var settle;
  function lean(tilt) {
    root.style.setProperty('--slider-bubble-tilt', tilt + 'deg');
    root.style.setProperty('--slider-bubble-s', tilt ? 1.08 : 1);
  }
  function update() {
    var next = +input.value;
    // Lean against the drag, harder the faster it moves, then right itself once the thumb rests.
    lean(Math.max(-24, Math.min(24, (v - next) * 4)));
    v = next;
    root.style.setProperty('--slider-bubble-v', v / 100);
    read.textContent = v;
    clearTimeout(settle);
    settle = setTimeout(function () { lean(0); }, 120);
  }
  input.addEventListener('input', update);
  return function () {
    clearTimeout(settle);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-bubble').forEach(initSliderBubble);
