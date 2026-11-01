function initSliderFoil(root) {
  var W = 240;
  var T = 22;
  var input = root.querySelector('.slider-foil__input');
  var label = root.querySelector('.slider-foil__value b');
  var x = target();
  // The sheen lags the thumb on a loose spring, and the lag is how far the foil has "tilted".
  var s = x;
  var v = 0;
  var raf = 0;
  function target() { return T / 2 + (+input.value / 100) * (W - T); }
  function draw() {
    // At rest the light sits two thirds of the way along the fill.
    root.style.setProperty('--slider-foil-x', x + 'px');
    root.style.setProperty('--slider-foil-sheen', s * 0.66 + 6 - v * 0.05 + 'px');
    root.style.setProperty('--slider-foil-tilt', Math.max(-18, Math.min(18, -v * 0.06)).toFixed(2));
  }
  function run() {
    cancelAnimationFrame(raf);
    x = target();
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s = x;
      v = 0;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-70 * (s - x) - 13 * v) * dt;
      s += v * dt;
      if (Math.abs(s - x) < 0.05 && Math.abs(v) < 0.5) {
        s = x;
        v = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', run);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.slider-foil').forEach(initSliderFoil);
