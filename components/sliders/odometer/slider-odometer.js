function initSliderOdometer(root) {
  var input = root.querySelector('.slider-odometer__input');
  var drums = root.querySelectorAll('.slider-odometer__drum');
  var reels = root.querySelectorAll('.slider-odometer__reel');
  var comma = root.querySelector('.slider-odometer__comma');
  function update() {
    var amount = +input.value;
    var text = String(amount);
    var digits = ('0000' + text).slice(-4);
    // Leading zeros fold away, so $450 never reads $0,450; the ones digit always stays.
    var lead = 4 - text.length;
    root.style.setProperty('--slider-odometer-v', amount / 5000);
    for (var i = 0; i < 4; i++) {
      reels[i].style.setProperty('--d', digits[i]);
      drums[i].toggleAttribute('data-lead', i < lead);
    }
    comma.toggleAttribute('data-lead', lead >= 1);
    input.setAttribute('aria-valuetext', amount + ' dollars');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-odometer').forEach(initSliderOdometer);
