function initSliderHistogram(root) {
  var W = 240;
  var T = 18;
  var MAX = 1200;
  var GAP = 100;
  var BINS = [3, 5, 9, 14, 22, 30, 38, 41, 37, 33, 28, 24, 20, 17, 15, 12, 10, 9, 7, 6, 5, 4, 3, 2];
  var lo = root.querySelector('.slider-histogram__input--lo');
  var hi = root.querySelector('.slider-histogram__input--hi');
  var bars = root.querySelectorAll('.slider-histogram__bar');
  var band = root.querySelector('.slider-histogram__band');
  var thumbLo = root.querySelector('.slider-histogram__thumb--lo');
  var thumbHi = root.querySelector('.slider-histogram__thumb--hi');
  var range = root.querySelector('.slider-histogram__value b');
  var count = root.querySelector('.slider-histogram__value span');
  function at(n) { return T / 2 + (n / MAX) * (W - T); }
  function update(e) {
    var a = +lo.value;
    var b = +hi.value;
    if (e && e.target === lo && a > b - GAP) lo.value = a = b - GAP;
    if (e && e.target === hi && b < a + GAP) hi.value = b = a + GAP;
    // A bin counts as in range when its middle price is; in-range bars rise, the rest sink.
    var n = 0;
    bars.forEach(function (bar, i) {
      var mid = (i + 0.5) * (MAX / BINS.length);
      var inside = mid >= a && mid <= b;
      bar.classList.toggle('slider-histogram__bar--in', inside);
      if (inside) n += BINS[i];
    });
    band.style.left = at(a) + 'px';
    band.style.width = at(b) - at(a) + 'px';
    thumbLo.style.left = at(a) + 'px';
    thumbHi.style.left = at(b) + 'px';
    range.textContent = '$' + a + ' – $' + b;
    count.textContent = n + ' results';
    lo.setAttribute('aria-valuetext', '$' + a);
    hi.setAttribute('aria-valuetext', '$' + b + ', ' + n + ' results');
    // Near the top end the low thumb sits on top, so the pair can always be pulled apart.
    lo.style.zIndex = a > MAX / 2 ? 2 : 1;
    hi.style.zIndex = a > MAX / 2 ? 1 : 2;
  }
  lo.addEventListener('input', update);
  hi.addEventListener('input', update);
  return function () {
    lo.removeEventListener('input', update);
    hi.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-histogram').forEach(initSliderHistogram);
