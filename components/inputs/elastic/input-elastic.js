function initFieldElastic(root) {
  var rail = root.querySelector('.field-elastic__rail');
  var track = root.querySelector('.field-elastic__track');
  var fill = root.querySelector('.field-elastic__fill');
  var thumb = root.querySelector('.field-elastic__thumb');
  var bubble = root.querySelector('.field-elastic__bubble');
  if (!rail || !track || !fill || !thumb || !bubble) return;
  var W = 216;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = { value: (Number(rail.getAttribute('aria-valuenow')) || 0) / 100, rubber: 0, rubberV: 0, vx: 0, drag: false, lastX: 0, lastT: 0 };
  var last = performance.now();
  var raf = 0;

  function show() {
    var pct = Math.round(s.value * 100);
    bubble.textContent = pct + '%';
    rail.setAttribute('aria-valuenow', String(pct));
    rail.setAttribute('aria-valuetext', pct + '%');
  }
  function tick(now) {
    var dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!s.drag) {
      // Let go past an end: the band snaps back with a wobble.
      if (still) s.rubber = 0;
      else {
        s.rubberV += (-s.rubber * 420 - s.rubberV * 14) * dt;
        s.rubber += s.rubberV * dt;
      }
      s.vx *= 0.85;
    }
    var r = s.rubber;
    var x = s.value * W + r;
    // The track stretches at whichever end is pulled, and thins as it does.
    track.style.left = Math.min(0, r) + 'px';
    track.style.width = W + Math.abs(r) + 'px';
    track.style.transform = 'scaleY(' + Math.max(0.4, 1 - Math.abs(r) / 50) + ')';
    fill.style.left = (r < 0 ? r : 0) + 'px';
    fill.style.width = Math.max(0, x - (r < 0 ? r : 0)) + 'px';
    var squash = Math.min(0.45, Math.abs(s.vx) / 2400);
    thumb.style.left = x + 'px';
    thumb.style.transform = still ? '' : 'scale(' + (1 + squash) + ', ' + (1 - squash * 0.7) + ')';
    bubble.style.left = x + 'px';
    bubble.style.transform = still ? '' : 'rotate(' + Math.max(-24, Math.min(24, -s.vx / 60)) + 'deg)';
    raf = requestAnimationFrame(tick);
  }
  function move(clientX) {
    var r = rail.getBoundingClientRect();
    var px = clientX - r.left;
    var now = performance.now();
    if (s.lastT) s.vx = ((clientX - s.lastX) / Math.max(1, now - s.lastT)) * 1000;
    s.lastX = clientX;
    s.lastT = now;
    var over = px < 0 ? px : px > W ? px - W : 0;
    // Rubber-band resistance: the further you pull, the less it gives.
    s.rubber = Math.sign(over) * 34 * (1 - Math.exp(-Math.abs(over) / 40));
    s.value = Math.max(0, Math.min(1, px / W));
    show();
  }
  function down(e) {
    rail.setPointerCapture(e.pointerId);
    s.drag = true;
    s.lastT = 0;
    move(e.clientX);
  }
  function pmove(e) { if (s.drag) move(e.clientX); }
  function up() {
    s.drag = false;
    s.rubberV = 0;
  }
  function key(e) {
    var step = { ArrowRight: 0.05, ArrowUp: 0.05, ArrowLeft: -0.05, ArrowDown: -0.05 }[e.key];
    if (!step) return;
    e.preventDefault();
    var next = s.value + step;
    // Pressing past an end gives the band a little kick instead.
    if (next < 0 || next > 1) s.rubberV += Math.sign(step) * 260;
    s.value = Math.max(0, Math.min(1, next));
    show();
  }
  rail.addEventListener('pointerdown', down);
  rail.addEventListener('pointermove', pmove);
  rail.addEventListener('pointerup', up);
  rail.addEventListener('keydown', key);
  raf = requestAnimationFrame(tick);
  return function () {
    cancelAnimationFrame(raf);
    rail.removeEventListener('pointerdown', down);
    rail.removeEventListener('pointermove', pmove);
    rail.removeEventListener('pointerup', up);
    rail.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.field-elastic').forEach(initFieldElastic);
