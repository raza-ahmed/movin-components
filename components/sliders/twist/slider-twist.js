function initSliderTwist(root) {
  var W = 240;
  var MID = 28;
  var H = 16;
  var SEGS = 22;
  var INK = 'light-dark(#42454c, #e5e6e9)';
  var PAPER = 'light-dark(#dbdde1, #2e3035)';
  var SHADE = 'light-dark(#6d7179, #7d8087)';
  var input = root.querySelector('.slider-twist__input');
  var ink = root.querySelector('.slider-twist__ink');
  var paper = root.querySelector('.slider-twist__paper');
  var faces = root.querySelectorAll('polygon');
  var collar = root.querySelector('.slider-twist__collar');
  var ring = root.querySelector('.slider-twist__ring');
  var p = target();
  var speed = 0;
  var raf = 0;
  function target() { return 8 + (+input.value / 100) * (W - 16); }
  function clip(x) { return Math.min(W, Math.max(0, x)); }

  function draw() {
    // The twist stretches out behind the direction of travel.
    var stretch = Math.min(46, Math.abs(speed) * 0.09);
    var a = p - 14 - (speed > 0 ? stretch : 0);
    var b = p + 14 + (speed < 0 ? stretch : 0);
    var pinch = (a + b) / 2;
    ink.setAttribute('width', Math.max(0, a + 0.5));
    paper.setAttribute('x', b - 0.5);
    paper.setAttribute('width', Math.max(0, W - b + 0.5));
    faces.forEach(function (face, k) {
      var x0 = clip(a + ((b - a) * k) / SEGS);
      var x1 = clip(a + ((b - a) * (k + 1)) / SEGS);
      var t0 = (Math.PI * k) / SEGS;
      var t1 = (Math.PI * (k + 1)) / SEGS;
      var h0 = (H / 2) * Math.abs(Math.cos(t0));
      var h1 = (H / 2) * Math.abs(Math.cos(t1));
      // A face turned away from you catches the light differently, so shade by how far it has turned.
      var turn = Math.round(Math.sin((t0 + t1) / 2) * 55);
      var fill = k < SEGS / 2
        ? 'color-mix(in oklab, ' + SHADE + ' ' + turn + '%, ' + INK + ')'
        : 'color-mix(in oklab, ' + SHADE + ' ' + Math.round(turn * 0.6) + '%, ' + PAPER + ')';
      face.setAttribute('points', x0 + ',' + (MID - h0) + ' ' + x1 + ',' + (MID - h1) + ' ' + x1 + ',' + (MID + h1) + ' ' + x0 + ',' + (MID + h0));
      face.style.fill = fill;
      face.style.stroke = fill;
    });
    collar.setAttribute('x', pinch - 3);
    ring.setAttribute('x', pinch - 7);
  }
  // Follows the value on a spring, whose speed stretches the twist.
  function run() {
    cancelAnimationFrame(raf);
    var goal = target();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      p = goal;
      speed = 0;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      speed += (-300 * (p - goal) - 30 * speed) * dt;
      p += speed * dt;
      if (Math.abs(p - goal) < 0.05 && Math.abs(speed) < 1) {
        p = goal;
        speed = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', run);
  draw();
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.slider-twist').forEach(initSliderTwist);
