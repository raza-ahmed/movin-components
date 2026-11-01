function initSliderAbacus(root) {
  var W = 240;
  var BW = 20;
  var input = root.querySelector('.slider-abacus__input');
  var beads = root.querySelectorAll('.slider-abacus__bead');
  var count = root.querySelector('.slider-abacus__count b');
  var N = beads.length;
  var from = +input.value;
  function render() {
    var v = +input.value;
    root.style.setProperty('--slider-abacus-v', v);
    beads.forEach(function (bead, i) {
      // The beads that cross set off one after another, the nearest first.
      var delay = v > from && i >= from && i < v ? (i - from) * 32 : v < from && i >= v && i < from ? (from - 1 - i) * 32 : 0;
      bead.style.transitionDelay = delay + 'ms';
      bead.style.transform = 'translateX(' + (i < v ? i * BW : W - (N - i) * BW) + 'px)';
      bead.classList.toggle('slider-abacus__bead--on', i < v);
    });
    count.textContent = v;
    input.setAttribute('aria-valuetext', v + ' of ' + N);
    from = v;
  }
  input.addEventListener('input', render);
  return function () {
    input.removeEventListener('input', render);
  };
}

document.querySelectorAll('.slider-abacus').forEach(initSliderAbacus);
