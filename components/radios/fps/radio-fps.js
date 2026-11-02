function initRadioFps(root) {
  var NOTES = { 12: 'Steppy, like stop motion', 24: 'Smooth enough, like film', 60: 'Fluid, like a phone screen' };
  var PERIOD = 2.4;
  var SVG = 'http://www.w3.org/2000/svg';
  var stage = root.querySelector('.radio-fps__stage');
  var ball = root.querySelector('.radio-fps__ball');
  var ghosts = root.querySelectorAll('.radio-fps__ghost');
  var read = root.querySelector('.radio-fps__read');
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fps = +root.querySelector('.radio-fps__input:checked').value;
  var raf = 0;
  var t0 = performance.now();
  var last = -1;
  // Where the ball is at time t: across and back once a period, bouncing twice each way.
  function pos(t) {
    var u = (((t % PERIOD) + PERIOD) % PERIOD) / PERIOD;
    return { x: 24 + 172 * ((1 - Math.cos(2 * Math.PI * u)) / 2), y: 76 - 50 * Math.abs(Math.sin(4 * Math.PI * u)) };
  }
  function put(el, p) {
    el.setAttribute('cx', p.x.toFixed(1));
    el.setAttribute('cy', p.y.toFixed(1));
  }
  // The ball only moves on frame boundaries: the clock runs smoothly, but its position is read at
  // 1/fps steps. The last three frames stay faintly behind it, so the spacing shows.
  function step(now) {
    var f = Math.floor(((now - t0) / 1000) * fps);
    if (f !== last) {
      last = f;
      put(ball, pos(f / fps));
      ghosts.forEach(function (g, k) { put(g, pos((f - k - 1) / fps)); });
    }
    raf = requestAnimationFrame(step);
  }
  // Without motion: every frame of one pass as a dot, so 12 fps leaves wide gaps and 60 fps a near line.
  function dots() {
    stage.querySelectorAll('.radio-fps__dot').forEach(function (d) { d.remove(); });
    for (var k = 0; k < Math.round(PERIOD * fps); k++) {
      var dot = document.createElementNS(SVG, 'circle');
      dot.setAttribute('class', 'radio-fps__dot');
      dot.setAttribute('r', '1.6');
      put(dot, pos(k / fps));
      stage.insertBefore(dot, ghosts[0] || ball);
    }
  }
  function onChange(e) {
    fps = +e.target.value;
    read.textContent = fps + ' frames a second. ' + NOTES[fps] + '.';
    if (still) return dots();
    t0 = performance.now();
    last = -1;
  }
  // Only run while the stage is on screen.
  var io = new IntersectionObserver(function (entries) {
    cancelAnimationFrame(raf);
    if (entries[0].isIntersecting) raf = requestAnimationFrame(step);
  });
  if (still) {
    ghosts.forEach(function (g) { g.remove(); });
    dots();
  } else io.observe(stage);
  root.addEventListener('change', onChange);
  return function () {
    io.disconnect();
    cancelAnimationFrame(raf);
    root.removeEventListener('change', onChange);
  };
}

document.querySelectorAll('.radio-fps').forEach(initRadioFps);
