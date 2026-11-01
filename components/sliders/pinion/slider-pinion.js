function initSliderPinion(root) {
  var R = 12;
  var C = 22;
  var X0 = 16;
  var X1 = 224;
  var input = root.querySelector('.slider-pinion__input');
  var wheel = root.querySelector('.slider-pinion__wheel');
  var ring = root.querySelector('.slider-pinion__ring');
  var done = root.querySelector('#slider-pinion-done rect');
  var left = root.querySelector('#slider-pinion-left rect');
  var label = root.querySelector('.slider-pinion__value b');
  var x = at(+input.value);
  var v = 0;
  var raf = 0;
  function at(n) { return X0 + (n / 100) * (X1 - X0); }
  // Rolling without slip: the gear turns by the distance travelled over its pitch radius.
  function draw() {
    wheel.setAttribute('transform', 'translate(' + x + ' ' + C + ') rotate(' + (((x - X0) / R) * 180) / Math.PI + ')');
    ring.setAttribute('cx', x);
    done.setAttribute('width', x);
    left.setAttribute('x', x);
  }
  function run() {
    cancelAnimationFrame(raf);
    var goal = at(+input.value);
    label.textContent = input.value + ' mm';
    input.setAttribute('aria-valuetext', input.value + ' millimetres');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = goal;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-220 * (x - goal) - 26 * v) * dt;
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

document.querySelectorAll('.slider-pinion').forEach(initSliderPinion);
