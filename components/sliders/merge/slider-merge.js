function initSliderMerge(root) {
  var W = 240, THUMB = 22, MIN_GAP = 30;
  var lo = root.querySelector('.slider-merge__input--lo');
  var hi = root.querySelector('.slider-merge__input--hi');
  var band = root.querySelector('.slider-merge__band');
  var pillLo = root.querySelector('.slider-merge__pill--lo');
  var pillHi = root.querySelector('.slider-merge__pill--hi');
  var pillBoth = root.querySelector('.slider-merge__pill--both');
  var thumbLo = root.querySelector('.slider-merge__thumb--lo');
  var thumbHi = root.querySelector('.slider-merge__thumb--hi');
  var max = +lo.max;
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  // Close enough to the pill's rendered width to decide when two would touch.
  function pillWidth(text) { return text.length * 7 + 18; }
  function at(n) { return THUMB / 2 + (n / max) * (W - THUMB); }
  function update(e) {
    // Each thumb stops short of the other.
    if (e && e.target === lo) lo.value = Math.min(+lo.value, +hi.value - MIN_GAP);
    if (e && e.target === hi) hi.value = Math.max(+hi.value, +lo.value + MIN_GAP);
    var a = +lo.value, b = +hi.value;
    var xl = at(a), xh = at(b), mid = (xl + xh) / 2;
    var merged = xh - xl < (pillWidth(money(a)) + pillWidth(money(b))) / 2 + 6;
    band.style.left = xl + 'px';
    band.style.width = xh - xl + 'px';
    thumbLo.style.left = xl - THUMB / 2 + 'px';
    thumbHi.style.left = xh - THUMB / 2 + 'px';
    // Merging, each pill slides to the midpoint and fades as the joint one grows there.
    [[pillLo, xl, a], [pillHi, xh, b]].forEach(function (p) {
      p[0].textContent = money(p[2]);
      p[0].style.left = p[1] + 'px';
      p[0].style.opacity = merged ? 0 : 1;
      p[0].style.transform = 'translateX(-50%) translateX(' + (merged ? mid - p[1] : 0) + 'px) scale(' + (merged ? 0.7 : 1) + ')';
    });
    pillBoth.textContent = money(a) + ' – ' + money(b);
    pillBoth.style.left = mid + 'px';
    pillBoth.style.opacity = merged ? 1 : 0;
    pillBoth.style.transform = 'translateX(-50%) scale(' + (merged ? '1, 1' : '0.7, 0.9') + ')';
    lo.setAttribute('aria-valuetext', money(a));
    hi.setAttribute('aria-valuetext', money(b));
    // Near the top end the low thumb sits on top, so the pair can always be pulled apart.
    lo.style.zIndex = a > max / 2 ? 2 : 1;
    hi.style.zIndex = a > max / 2 ? 1 : 2;
  }
  lo.addEventListener('input', update);
  hi.addEventListener('input', update);
  return function () {
    lo.removeEventListener('input', update);
    hi.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-merge').forEach(initSliderMerge);
