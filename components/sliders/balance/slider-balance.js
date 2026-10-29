function initSliderBalance(root) {
  var input = root.querySelector('.slider-balance__input');
  var read = root.querySelector('.slider-balance__read');
  function update() {
    var v = +input.value;
    var t = (v - 0) / (100 - 0);
    root.style.setProperty('--slider-balance-v', t);
    read.innerHTML = 'Save <b>' + v + '%</b> · Spend <b>' + (100 - v) + '%</b>';
    input.setAttribute('aria-valuetext', 'Save ' + v + ' percent, spend ' + (100 - v) + ' percent');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-balance').forEach(initSliderBalance);
