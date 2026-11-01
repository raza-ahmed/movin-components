function initSliderCast(root) {
  var W = 240;
  var G = 42;
  var input = root.querySelector('.slider-cast__input');
  var lit = root.querySelector('.slider-cast__lit');
  var pool = root.querySelector('.slider-cast__pool');
  var aura = root.querySelector('.slider-cast__aura');
  var post = root.querySelector('.slider-cast__post');
  var bulb = root.querySelector('.slider-cast__bulb');
  var ring = root.querySelector('.slider-cast__ring');
  var shadows = root.querySelectorAll('.slider-cast__shadow');
  var ticks = root.querySelectorAll('.slider-cast__tick');
  var label = root.querySelector('.slider-cast__value b');
  var x = at(+input.value);
  var v = 0;
  var raf = 0;
  function at(n) { return 8 + (n / 100) * (W - 16); }
  // Each tick throws its shadow away from the lamp: longer the further off it stands.
  function draw() {
    lit.setAttribute('width', x);
    [pool, aura, bulb, ring].forEach(function (c) { c.setAttribute('cx', x); });
    post.setAttribute('x1', x);
    post.setAttribute('x2', x);
    ticks.forEach(function (t, i) {
      var tx = 10 + i * 11;
      var d = tx - x;
      var L = Math.min(48, Math.abs(d) * (i % 5 === 0 ? 0.42 : 0.3));
      shadows[i].setAttribute('x2', tx + Math.sign(d) * L);
      shadows[i].setAttribute('y2', G + Math.min(5, L * 0.25));
      shadows[i].setAttribute('opacity', Math.max(0.15, 1 - Math.abs(d) / 220));
      t.setAttribute('opacity', 0.45 + 0.55 * Math.max(0, 1 - Math.abs(d) / 110));
    });
  }
  // The lamp follows the value on a spring, so the shadows swing round rather than jump.
  function run() {
    cancelAnimationFrame(raf);
    var goal = at(+input.value);
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
      v += (-200 * (x - goal) - 26 * v) * dt;
      x += v * dt;
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

document.querySelectorAll('.slider-cast').forEach(initSliderCast);
