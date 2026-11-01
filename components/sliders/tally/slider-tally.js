function initSliderTally(root) {
  var W = 240;
  var MAX = 20;
  var STEP = (W - 12) / MAX;
  var input = root.querySelector('.slider-tally__input');
  var marks = root.querySelectorAll('.slider-tally__mark');
  var slots = root.querySelectorAll('.slider-tally__slot');
  var count = root.querySelector('.slider-tally__count');
  var from = +input.value;
  function render() {
    var v = +input.value;
    var days = v === 1 ? 'day' : 'days';
    root.style.setProperty('--slider-tally-x', 6 + v * STEP + 'px');
    // New marks draw in order from the last one; removed ones rub out from the end back.
    marks.forEach(function (m, i) {
      var k = i + 1;
      var delay = k > from ? (k - from - 1) * 55 : (from - k) * 35;
      m.style.transitionDelay = Math.max(0, delay) + 'ms';
      m.classList.toggle('slider-tally__mark--on', k <= v);
    });
    // Empty places are marked with a dot; every fifth place is the strike, which has none.
    var i = 0;
    for (var k = 1; k <= MAX; k++) {
      if (k % 5 === 0) continue;
      slots[i++].style.opacity = k <= v ? 0 : 1;
    }
    count.innerHTML = '<b>' + v + '</b> ' + days + ' in a row';
    input.setAttribute('aria-valuetext', v + ' ' + days);
    from = v;
  }
  input.addEventListener('input', render);
  return function () {
    input.removeEventListener('input', render);
  };
}

document.querySelectorAll('.slider-tally').forEach(initSliderTally);
