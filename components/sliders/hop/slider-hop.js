function initSliderHop(root) {
  var W = 240;
  var N = 10;
  var T = 16;
  var Y = 52;
  var NS = 'http://www.w3.org/2000/svg';
  var input = root.querySelector('.slider-hop__input');
  var svg = root.querySelector('.slider-hop__svg');
  var dots = root.querySelectorAll('.slider-hop__dot');
  var thumb = root.querySelector('.slider-hop__thumb');
  var body = root.querySelector('.slider-hop__body');
  var label = root.querySelector('.slider-hop__value b');
  var x = at(+input.value);
  var y = 0;
  var raf = 0;
  function at(k) { return T / 2 + (k / N) * (W - T); }
  function place() { thumb.style.transform = 'translate(' + (x - T / 2) + 'px, ' + (Y - T / 2 + y) + 'px)'; }
  // Each new step starts a hop from wherever the thumb is, even mid-air, so a fast drag chains hops.
  function jump() {
    var k = +input.value;
    dots.forEach(function (d, i) { d.classList.toggle('slider-hop__dot--on', i <= k); });
    label.textContent = k + ' / ' + N;
    input.setAttribute('aria-valuetext', k + ' of ' + N);
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = at(k);
      y = 0;
      return place();
    }
    var x0 = x;
    var y0 = y;
    var x1 = at(k);
    var dist = Math.abs(x1 - x0);
    var h = Math.min(30, 8 + dist * 0.3);
    var dur = 200 + Math.min(240, dist * 2);
    var t0 = performance.now();
    // The same parabola as a quadratic Bezier, left behind as a dotted trace that fades.
    var trace = document.createElementNS(NS, 'path');
    trace.setAttribute('class', 'slider-hop__trace');
    trace.setAttribute('d', 'M ' + x0 + ' ' + (Y + y0) + ' Q ' + (x0 + x1) / 2 + ' ' + (Y + (y0 - 4 * h) / 2) + ' ' + x1 + ' ' + Y);
    trace.addEventListener('animationend', function () { trace.remove(); });
    svg.appendChild(trace);
    var traces = svg.querySelectorAll('.slider-hop__trace');
    if (traces.length > 4) traces[0].remove();
    function step(now) {
      var e = Math.min(1, (now - t0) / dur);
      x = x0 + (x1 - x0) * e;
      y = y0 * (1 - e) - 4 * h * e * (1 - e);
      place();
      if (e < 1) {
        raf = requestAnimationFrame(step);
        return;
      }
      // Landing squashes the thumb; replay the keyframes.
      body.classList.remove('slider-hop__body--land');
      void body.offsetWidth;
      body.classList.add('slider-hop__body--land');
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', jump);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', jump);
  };
}

document.querySelectorAll('.slider-hop').forEach(initSliderHop);
