function initSliderDepth(root) {
  var W = 240;
  var T = 18;
  var input = root.querySelector('.slider-depth__input');
  var fill = root.querySelector('.slider-depth__fill');
  var af = root.querySelector('.slider-depth__af');
  var nums = root.querySelectorAll('.slider-depth__num');
  var label = root.querySelector('.slider-depth__value b');
  var fx = at(+input.value);
  var v = 0;
  var raf = 0;
  function at(n) { return T / 2 + (n / 100) * (W - T); }
  // Numbers near the plane of focus are sharp and large; further off they shrink, fade and blur.
  function draw() {
    nums.forEach(function (el, i) {
      var dist = Math.abs(at(i * 10) - fx);
      el.style.transform = 'translateX(-50%) scale(' + (1.25 - Math.min(0.4, dist / 110)) + ')';
      el.style.filter = 'blur(' + Math.min(3.2, Math.pow(dist / 22, 1.3) * 0.9).toFixed(2) + 'px)';
      el.style.opacity = 1 - Math.min(0.55, dist / 140);
    });
  }
  // The plane of focus trails the thumb on a soft spring and hunts past it a little, like a lens.
  function run() {
    cancelAnimationFrame(raf);
    var goal = at(+input.value);
    fill.style.width = goal + 'px';
    af.style.left = goal + 'px';
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fx = goal;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-90 * (fx - goal) - 12 * v) * dt;
      fx += v * dt;
      if (Math.abs(fx - goal) < 0.05 && Math.abs(v) < 0.5) {
        fx = goal;
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

document.querySelectorAll('.slider-depth').forEach(initSliderDepth);
