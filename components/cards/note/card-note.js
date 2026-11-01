function initCardNote(root) {
  var shadow = root.querySelector('.card-note__shadow');
  var bottom = root.querySelector('.card-note__half--bottom');
  var shade = root.querySelector('.card-note__shade');
  var q = { a: 0, v: 0, gust: 0, raf: 0, on: false, x: 0, y: 0, t: 0 };

  function paint() {
    var a = Math.max(-12, q.a);
    var fold = 'perspective(420px) rotateX(' + a + 'deg)';
    shadow.style.transform = 'scale(' + (1 + a / 120) + ')';
    shadow.style.opacity = 1 - a / 90;
    bottom.style.transform = fold;
    shade.style.transform = fold;
    shade.style.opacity = a / 70;
  }
  // A gust from the pointer's speed pushes the flap up; it falls back on a loose spring, so it flutters.
  function kick() {
    if (q.on) return;
    q.on = true;
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-110 * (q.a - q.gust) - 6 * q.v) * dt;
      q.a += q.v * dt;
      q.gust *= Math.exp(-dt * 2.5);
      if (Math.abs(q.a) < 0.05 && Math.abs(q.v) < 0.1 && q.gust < 0.05) {
        q.on = false;
        q.a = 0;
        paint();
        return;
      }
      paint();
      q.raf = requestAnimationFrame(step);
    }
    q.raf = requestAnimationFrame(step);
  }
  function onMove(e) {
    var now = performance.now();
    var dt = Math.max(8, now - q.t);
    var speed = (Math.hypot(e.clientX - q.x, e.clientY - q.y) / dt) * 1000;
    q.x = e.clientX;
    q.y = e.clientY;
    q.t = now;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || dt > 100) return;
    q.gust = Math.min(58, Math.max(q.gust, speed * 0.08));
    kick();
  }
  root.addEventListener('pointermove', onMove);
  return function () {
    cancelAnimationFrame(q.raf);
    root.removeEventListener('pointermove', onMove);
  };
}

document.querySelectorAll('.card-note').forEach(initCardNote);
