function initSliderPleat(root) {
  var W = 240, MID = 28, H = 9, FOLDS = 10, FACE = 26;
  var input = root.querySelector('.slider-pleat__input');
  var flat = root.querySelector('.slider-pleat__flat');
  var faces = root.querySelectorAll('polygon');
  var tab = root.querySelector('.slider-pleat__tab');
  var ring = root.querySelector('.slider-pleat__ring');
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = { x: +input.value, v: 0, raf: 0 };
  function draw(shown) {
    var t = 8 + (shown / 100) * (W - 16);
    var w = (W - t) / FOLDS;
    // How tightly packed the folds are: 0 lies flat, 1 is a closed stack.
    var c = Math.sqrt(Math.max(0, 1 - Math.pow(w / FACE, 2)));
    // Ridges stand proud of the ribbon, valleys sink into it; both deepen as the folds pack.
    function half(k) { return k % 2 ? H + 4 * c : H - c; }
    faces.forEach(function (face, k) {
      var x0 = t + k * w, x1 = t + (k + 1) * w, h0 = half(k), h1 = half(k + 1);
      face.setAttribute('points', x0 + ',' + (MID - h0) + ' ' + x1 + ',' + (MID - h1) + ' ' + x1 + ',' + (MID + h1) + ' ' + x0 + ',' + (MID + h0));
      // Faces turned to the light and away from it, never so dark they drop into the page.
      var fill = k % 2
        ? 'color-mix(in oklab, light-dark(#ebedf0, #232529) ' + Math.round(40 + c * 60) + '%, light-dark(#dbdde1, #2e3035))'
        : 'color-mix(in oklab, light-dark(#6d7179, #7d8087) ' + Math.round(14 + c * 40) + '%, light-dark(#dbdde1, #2e3035))';
      face.style.fill = fill;
      face.style.stroke = fill;
    });
    flat.setAttribute('d', 'M5 ' + (MID - H) + 'H' + t + 'V' + (MID + H) + 'H5a5 5 0 0 1-5-5V' + (MID - H + 5) + 'a5 5 0 0 1 5-5Z');
    tab.setAttribute('x', t - 4);
    ring.setAttribute('x', t - 8);
  }
  // Follows the value on a soft spring, so a click far along the track folds the ribbon up rather than jumping.
  function update() {
    var target = +input.value;
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
      s.v += (-260 * (s.x - target) - 24 * s.v) * dt;
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
  draw(s.x);
  return function () {
    cancelAnimationFrame(s.raf);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-pleat').forEach(initSliderPleat);
