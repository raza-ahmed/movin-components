function initSliderDomino(root) {
  var W = 240;
  var N = 16;
  var T = 14;
  var input = root.querySelector('.slider-domino__input');
  var tiles = root.querySelectorAll('.slider-domino__tile');
  var fill = root.querySelector('.slider-domino__fill');
  var thumb = root.querySelector('.slider-domino__thumb');
  var ring = root.querySelector('.slider-domino__ring');
  var label = root.querySelector('.slider-domino__value b');
  var was = +input.value;
  function at(k) { return T / 2 + (k / N) * (W - T); }
  function update() {
    var k = +input.value;
    tiles.forEach(function (t, i) {
      var down = i < k;
      // The last one down leans on the first one standing; the rest lie on each other.
      var tilt = !down ? 0 : i === k - 1 && k < N ? 23 : 64;
      // A jump of several topples them one after another, and stands them up the same way back.
      var delay = down && i >= was ? (i - was) * 45 : !down && i < was ? (was - 1 - i) * 45 : 0;
      t.classList.toggle('slider-domino__tile--down', down);
      t.style.transitionDelay = delay + 'ms';
      t.style.transform = 'rotate(' + tilt + 'deg)';
    });
    was = k;
    fill.setAttribute('x2', at(k));
    thumb.setAttribute('cx', at(k));
    ring.setAttribute('cx', at(k));
    label.textContent = k + ' / ' + N;
    input.setAttribute('aria-valuetext', k + ' of ' + N);
  }
  input.addEventListener('input', update);
  return function () {
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-domino').forEach(initSliderDomino);
