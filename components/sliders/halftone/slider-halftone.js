function initSliderHalftone(root) {
  var W = 240;
  var input = root.querySelector('.slider-halftone__input');
  var dots = root.querySelectorAll('circle');
  var thumb = root.querySelector('.slider-halftone__thumb');
  var ring = root.querySelector('.slider-halftone__ring');
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = { x: +input.value, v: 0, raf: 0 };
  var xs = Array.prototype.map.call(dots, function (d) { return +d.getAttribute('cx'); });
  function smooth(x) {
    var c = Math.min(1, Math.max(0, x));
    return c * c * (3 - 2 * c);
  }
  function draw(shown) {
    var t = 6 + (shown / 100) * (W - 12);
    dots.forEach(function (dot, i) {
      var behind = t - xs[i];
      // Far behind the thumb the dots overlap into solid ink; at the edge they are fine points.
      dot.setAttribute('r', behind > 0 ? 1.2 + 3.5 * smooth(behind / 72) : 1.1);
      dot.setAttribute('class', behind > 0 ? 'slider-halftone__ink' : 'slider-halftone__paper');
    });
    thumb.setAttribute('x', t - 3);
    ring.setAttribute('x', t - 7);
  }
  // Follows the value on a soft spring, so a click far along the track washes the ink across.
  function update() {
    var target = +input.value;
    input.setAttribute('aria-valuetext', target + '%');
    cancelAnimationFrame(s.raf);
    if (still) {
      s.x = target;
      draw(target);
      return;
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-200 * (s.x - target) - 26 * s.v) * dt;
      s.x += s.v * dt;
      if (Math.abs(s.x - target) < 0.02 && Math.abs(s.v) < 0.05) {
        s.x = target;
        s.v = 0;
        draw(target);
        return;
      }
      draw(s.x);
      s.raf = requestAnimationFrame(step);
    }
    s.raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', update);
  return function () {
    cancelAnimationFrame(s.raf);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-halftone').forEach(initSliderHalftone);
