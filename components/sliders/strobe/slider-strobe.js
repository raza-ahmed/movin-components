function initSliderStrobe(root) {
  var W = 240;
  var T = 18;
  var FLASH = 38;
  var input = root.querySelector('.slider-strobe__input');
  var thumb = root.querySelector('.slider-strobe__thumb');
  var label = root.querySelector('.slider-strobe__value b');
  var x = target();
  var v = 0;
  var flash = 0;
  var at = x;
  var raf = 0;
  function target() { return T / 2 + (+input.value / 100) * (W - T); }
  function draw() { root.style.setProperty('--slider-strobe-x', x + 'px'); }
  // Like a strobe firing every few frames, the moving thumb leaves a copy where it was, which fades.
  function ghost() {
    var g = document.createElement('span');
    g.className = 'slider-strobe__ghost';
    g.setAttribute('aria-hidden', 'true');
    g.style.left = x + 'px';
    g.addEventListener('animationend', function () { g.remove(); });
    root.insertBefore(g, thumb);
  }
  function run() {
    cancelAnimationFrame(raf);
    var goal = target();
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = goal;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-170 * (x - goal) - 24 * v) * dt;
      x += v * dt;
      if (now - flash > FLASH && Math.abs(x - at) > 3) {
        flash = now;
        at = x;
        ghost();
      }
      if (Math.abs(x - goal) < 0.05 && Math.abs(v) < 0.5) {
        x = goal;
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

document.querySelectorAll('.slider-strobe').forEach(initSliderStrobe);
