function initSliderSquiggle(root) {
  var W = 240, MID = 22, GAP = 8, AMP = 3.5;
  var input = root.querySelector('.slider-squiggle__input');
  var wave = root.querySelector('.slider-squiggle__wave');
  var rest = root.querySelector('.slider-squiggle__rest');
  var time = root.querySelector('.slider-squiggle__times span');
  var length = +input.max;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var held = false, amp = AMP, phase = 0, last = performance.now(), raf = 0, x = 0;
  function clock(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function spoken(s) { return Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; }
  // The played part as a sine that eases to flat at both ends, so it meets the handle level.
  function path(end) {
    if (end < 4) return '';
    var d = '';
    for (var p = 2; ; p += 1.5) {
      var at = Math.min(p, end);
      var ease = Math.min(1, (at - 2) / 8, (end - at) / 12);
      var y = MID + amp * Math.sin((Math.max(0, ease) * Math.PI) / 2) * Math.sin(at / 3.6 - phase);
      d += (d ? 'L' : 'M') + at.toFixed(1) + ' ' + y.toFixed(2);
      if (at === end) return d;
    }
  }
  function paint() {
    var now = performance.now();
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var target = held ? 0 : AMP;
    // Flattens while held so you can aim, ripples back on release.
    amp = still ? target : amp + (target - amp) * (1 - Math.exp(-dt * 9));
    if (!still) phase += dt * 3.2;
    wave.setAttribute('d', path(x - GAP));
  }
  function update() {
    var s = +input.value;
    x = 4 + (s / length) * (W - 8);
    root.style.setProperty('--slider-squiggle-x', x);
    rest.setAttribute('x1', x + GAP);
    rest.style.display = x + GAP < W - 2 ? '' : 'none';
    time.textContent = clock(s);
    input.setAttribute('aria-valuetext', spoken(s) + ' of ' + spoken(length));
    paint();
  }
  function up() {
    held = false;
    paint();
    removeEventListener('pointerup', up);
    removeEventListener('pointercancel', up);
  }
  function down() {
    held = true;
    paint();
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  }
  function loop() {
    paint();
    raf = requestAnimationFrame(loop);
  }
  // Only animate while on screen.
  var io = new IntersectionObserver(function (entries) {
    cancelAnimationFrame(raf);
    if (entries[0].isIntersecting && !still) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
  input.addEventListener('input', update);
  input.addEventListener('pointerdown', down);
  io.observe(root);
  update();
  return function () {
    io.disconnect();
    cancelAnimationFrame(raf);
    up();
    input.removeEventListener('input', update);
    input.removeEventListener('pointerdown', down);
  };
}

document.querySelectorAll('.slider-squiggle').forEach(initSliderSquiggle);
