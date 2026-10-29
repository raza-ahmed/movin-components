function initSliderCrowd(root) {
  var input = root.querySelector('.slider-crowd__input');
  var read = root.querySelector('.slider-crowd__read');
  function update() {
    var v = +input.value;
    var t = (v - 0) / (120 - 0);
    root.style.setProperty('--slider-crowd-v', t);
    var word = v === 0 ? 'Empty' : v < 30 ? 'Quiet' : v < 70 ? 'Comfortable' : v < 100 ? 'Busy' : 'Packed';
    read.innerHTML = '<b>' + v + '</b> of 120 · ' + word;
    input.setAttribute('aria-valuetext', v + ' of 120 guests, ' + word.toLowerCase());
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-crowd').forEach(initSliderCrowd);
