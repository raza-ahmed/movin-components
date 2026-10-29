function initSliderMood(root) {
  var WORDS = ['Awful', 'Bad', 'Okay', 'Good', 'Great'];
  var input = root.querySelector('.slider-mood__input');
  var eyes = root.querySelectorAll('.slider-mood__eye');
  var brows = root.querySelectorAll('.slider-mood__brow');
  var mouth = root.querySelector('.slider-mood__mouth');
  var word = root.querySelector('.slider-mood__word');
  function f(n) { return n.toFixed(1); }
  function update() {
    var t = input.value / 100;
    var curve = -14 + t * 32; // mouth: frown below zero, grin above
    // Brows: the inner ends lift when it is bad (worried), and both sit level and raised when it is good.
    var outer = 28 - t * 3;
    var inner = 28 - (1 - t) * 7 - t * 3;
    var peak = f((outer + inner) / 2 - t * 4);
    var w = WORDS[Math.min(4, Math.floor(t * 5))];
    root.style.setProperty('--slider-mood-v', t);
    eyes.forEach(function (eye) { eye.setAttribute('ry', f(5.5 - t * 2.5)); });
    brows[0].setAttribute('d', 'M26 ' + f(outer) + 'Q33 ' + peak + ' 40 ' + f(inner));
    brows[1].setAttribute('d', 'M70 ' + f(outer) + 'Q63 ' + peak + ' 56 ' + f(inner));
    mouth.setAttribute('d', 'M32 ' + f(64 - curve * 0.25) + 'Q48 ' + f(64 + curve) + ' 64 ' + f(64 - curve * 0.25));
    word.textContent = w;
    input.setAttribute('aria-valuetext', w);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-mood').forEach(initSliderMood);
