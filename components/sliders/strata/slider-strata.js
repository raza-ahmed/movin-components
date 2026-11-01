function initSliderStrata(root) {
  var W = 240;
  // Each layer down follows on a softer spring.
  var LAYERS = [
    { k: 110, c: 15, el: root.querySelector('.slider-strata__layer--deep') },
    { k: 240, c: 22, el: root.querySelector('.slider-strata__layer--mid') },
  ];
  var input = root.querySelector('.slider-strata__input');
  var top = root.querySelector('.slider-strata__layer--top');
  var label = root.querySelector('.slider-strata__value b');
  var x = target();
  LAYERS.forEach(function (l) { l.x = x; l.v = 0; });
  var raf = 0;
  function target() { return 6 + (+input.value / 100) * (W - 12); }
  function draw() {
    root.style.setProperty('--slider-strata-x', x + 'px');
    top.style.width = Math.max(12, x + 3) + 'px';
    LAYERS.forEach(function (l) { l.el.style.width = Math.max(12, l.x + 3) + 'px'; });
  }
  // The lower layers chase the top one, so a drag fans their ends apart.
  function run() {
    cancelAnimationFrame(raf);
    x = target();
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      LAYERS.forEach(function (l) { l.x = x; l.v = 0; });
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      var settled = true;
      LAYERS.forEach(function (l) {
        l.v += (-l.k * (l.x - x) - l.c * l.v) * dt;
        l.x += l.v * dt;
        if (Math.abs(l.x - x) >= 0.05 || Math.abs(l.v) >= 0.5) settled = false;
      });
      if (settled) LAYERS.forEach(function (l) { l.x = x; l.v = 0; });
      draw();
      if (!settled) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', run);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.slider-strata').forEach(initSliderStrata);
