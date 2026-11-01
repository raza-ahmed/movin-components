function initSliderLouvre(root) {
  var W = 240, SLAT = 13;
  var input = root.querySelector('.slider-louvre__input');
  var value = root.querySelector('.slider-louvre__head b');
  var slats = root.querySelectorAll('.slider-louvre__slat');
  var step = (W - SLAT) / (slats.length - 1);
  var prev = 6 + (input.value / 100) * (W - 12);
  function smooth(x) {
    var c = Math.min(1, Math.max(0, x));
    return c * c * (3 - 2 * c);
  }
  function update() {
    var v = +input.value;
    var t = 6 + (v / 100) * (W - 12);
    // Slats between the old and new position turn in order, so a click far along still reads as a sweep.
    var span = Math.abs(t - prev);
    var sweep = Math.min(span * 1.6, 320);
    slats.forEach(function (slat, i) {
      var x = SLAT / 2 + i * step;
      var crossed = span > 0 && (x - prev) * (x - t) <= 0;
      slat.style.setProperty('--slider-louvre-f', smooth((x - t + 16) / 32).toFixed(3));
      slat.style.setProperty('--slider-louvre-d', (crossed ? Math.round((Math.abs(x - prev) / span) * sweep) : 0) + 'ms');
    });
    prev = t;
    root.style.setProperty('--slider-louvre-t', t + 'px');
    value.textContent = v + '%';
    input.setAttribute('aria-valuetext', v + '%');
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-louvre').forEach(initSliderLouvre);
