function initSliderNeedles(root) {
  var W = 240;
  var NY = 16;
  var TY = 50;
  var T = 16;
  var input = root.querySelector('.slider-needles__input');
  var needles = root.querySelectorAll('.slider-needles__needle');
  var norths = root.querySelectorAll('.slider-needles__north');
  var fill = root.querySelector('.slider-needles__fill');
  var thumb = root.querySelector('.slider-needles__thumb');
  var core = root.querySelector('.slider-needles__core');
  var ring = root.querySelector('.slider-needles__ring');
  var label = root.querySelector('.slider-needles__value b');
  var xs = [];
  for (var i = 0; i < needles.length; i++) xs.push(12 + i * 18);
  var a = xs.map(function (x) { return aim(x, at(+input.value)); });
  var w = xs.map(function () { return 0; });
  var raf = 0;
  function at(v) { return T / 2 + (v / 100) * (W - T); }
  function aim(x, tx) { return (Math.atan2(TY - NY, tx - x) * 180) / Math.PI; }
  function draw() {
    needles.forEach(function (g, i) { g.setAttribute('transform', 'translate(' + xs[i] + ' ' + NY + ') rotate(' + a[i] + ')'); });
  }
  // Each needle swings round on its own loose spring, so they overshoot and wobble a little as they settle.
  function update() {
    var tx = at(+input.value);
    norths.forEach(function (n, i) { n.classList.toggle('slider-needles__north--on', xs[i] <= tx); });
    fill.setAttribute('x2', tx);
    [thumb, core, ring].forEach(function (c) { c.setAttribute('cx', tx); });
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    var goal = xs.map(function (x) { return aim(x, tx); });
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      a = goal;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      var busy = false;
      for (var i = 0; i < a.length; i++) {
        w[i] += (-(110 + (i % 3) * 18) * (a[i] - goal[i]) - 7 * w[i]) * dt;
        a[i] += w[i] * dt;
        if (Math.abs(a[i] - goal[i]) > 0.05 || Math.abs(w[i]) > 0.3) busy = true;
      }
      draw();
      if (busy) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', update);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-needles').forEach(initSliderNeedles);
