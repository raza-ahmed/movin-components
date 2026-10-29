function initSliderSteep(root) {
  var WORDS = ['Weak', 'Light', 'Medium', 'Strong', 'Bold'];
  var input = root.querySelector('.slider-steep__input');
  var read = root.querySelector('.slider-steep__read');
  var word = read.querySelector('b');
  function update() {
    var v = +input.value;
    var w = WORDS[Math.min(4, Math.floor(v / 20))];
    var mins = 1 + Math.round((v / 100) * 5);
    root.style.setProperty('--slider-steep-v', v / 100);
    word.textContent = w;
    read.replaceChildren(word, ' · ' + mins + ' min');
    input.setAttribute('aria-valuetext', w + ', ' + mins + ' minutes');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-steep').forEach(initSliderSteep);
