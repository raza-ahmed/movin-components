function initSliderShuttle(root) {
  var REACH = 56;
  var LENGTH = 120;
  var FASTEST = 16;
  var handle = root.querySelector('.slider-shuttle__handle');
  var head = root.querySelector('.slider-shuttle__head span');
  var label = root.querySelector('.slider-shuttle__value');
  var chevs = root.querySelectorAll('.slider-shuttle__chev');
  var t = +root.getAttribute('aria-valuenow');
  var push = 0;
  var drag = null;
  var raf = 0;
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function time(s) {
    var sec = (s % 60).toFixed(1);
    return Math.floor(s / 60) + ':' + (sec.length < 4 ? '0' : '') + sec;
  }
  function render() {
    var f = push / REACH;
    var shown = Math.round(t * 10) / 10;
    head.textContent = drag && push !== 0 ? (push < 0 ? 'Rewind ' : 'Forward ') + Math.max(1, Math.round(f * f * FASTEST)) + '×' : 'Push to shuttle';
    label.textContent = time(shown);
    root.setAttribute('aria-valuenow', shown);
    root.setAttribute('aria-valuetext', time(shown));
    root.style.setProperty('--slider-shuttle-at', (t / LENGTH) * 100 + '%');
    handle.style.transform = 'translateX(' + push + 'px)';
    // Three chevrons each way light up in turn as the handle is pushed further.
    chevs.forEach(function (c, i) {
      var side = i < 3 ? -1 : 1;
      c.classList.toggle('slider-shuttle__chev--lit', Math.sign(push) === side && Math.abs(f) > ((i % 3) + 1) / 4);
    });
  }
  // While held, time runs at a speed that climbs steeply with how far the handle is pushed.
  function run(now) {
    var dt = (now - run.last) / 1000;
    run.last = now;
    var f = push / REACH;
    t = clamp(t + Math.sign(f) * f * f * FASTEST * dt, 0, LENGTH);
    render();
    raf = requestAnimationFrame(run);
  }
  function down(e) {
    if (e.button !== 0) return;
    root.setPointerCapture(e.pointerId);
    drag = e.clientX;
    root.classList.add('slider-shuttle--held');
    run.last = performance.now();
    raf = requestAnimationFrame(run);
  }
  function move(e) {
    if (drag === null) return;
    push = clamp(e.clientX - drag, -REACH, REACH);
    render();
  }
  function up() {
    if (drag === null) return;
    drag = null;
    push = 0;
    cancelAnimationFrame(raf);
    // Let go and the handle springs back past centre and settles (the CSS transition).
    root.classList.remove('slider-shuttle--held');
    render();
  }
  function onKeyDown(e) {
    var step = e.shiftKey ? 10 : 1;
    var next = { ArrowRight: t + step, ArrowUp: t + step, ArrowLeft: t - step, ArrowDown: t - step, Home: 0, End: LENGTH }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    t = clamp(Math.round(next * 10) / 10, 0, LENGTH);
    render();
  }
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', onKeyDown);
  return function () {
    cancelAnimationFrame(raf);
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('pointercancel', up);
    root.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.slider-shuttle').forEach(initSliderShuttle);
