function initSliderFuse(root) {
  var W = 240;
  var Y = 22;
  var NS = 'http://www.w3.org/2000/svg';
  var input = root.querySelector('.slider-fuse__input');
  var svg = root.querySelector('.slider-fuse__svg');
  var ash = root.querySelector('.slider-fuse__ash');
  var grad = root.querySelector('#slider-fuse-ash');
  var rope = root.querySelector('.slider-fuse__rope');
  var glow = root.querySelector('.slider-fuse__glow');
  var core = root.querySelector('.slider-fuse__core');
  var ring = root.querySelector('.slider-fuse__ring');
  var label = root.querySelector('.slider-fuse__value b');
  var embers = [];
  var x = at(+input.value);
  var prev = x;
  var acc = 0;
  var last = 0;
  var raf = 0;
  function at(v) { return 6 + (v / 100) * (W - 12); }
  function onInput() {
    var s = (+input.value / 10).toFixed(1);
    x = at(+input.value);
    label.textContent = s + ' s';
    input.setAttribute('aria-valuetext', s + ' seconds');
    ash.setAttribute('x1', x);
    grad.setAttribute('x1', x);
    grad.setAttribute('x2', x + 26);
    rope.setAttribute('width', Math.max(0, x - 3));
    [glow, core, ring].forEach(function (c) { c.setAttribute('cx', x); });
  }
  // The spark fizzes on its own and sprays harder the faster it is dragged.
  function step(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    var moved = x - prev;
    prev = x;
    var speed = Math.min(500, Math.abs(moved) / dt);
    acc += dt * (8 + speed * 0.18);
    while (acc >= 1) {
      acc -= 1;
      if (embers.length > 70) continue;
      var a = -Math.PI * (0.1 + Math.random() * 0.8);
      var s = 35 + Math.random() * 75;
      var max = 0.3 + Math.random() * 0.45;
      var el = document.createElementNS(NS, 'circle');
      el.setAttribute('class', 'slider-fuse__ember');
      el.setAttribute('r', '1.2');
      svg.insertBefore(el, core);
      embers.push({ el: el, x: x, y: Y, vx: Math.cos(a) * s - Math.sign(moved) * speed * 0.15, vy: Math.sin(a) * s, life: max, max: max });
    }
    embers = embers.filter(function (e) {
      e.life -= dt;
      if (e.life <= 0) {
        e.el.remove();
        return false;
      }
      e.vy += 240 * dt;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      e.el.setAttribute('cx', e.x);
      e.el.setAttribute('cy', e.y);
      e.el.setAttribute('opacity', e.life / e.max);
      return true;
    });
    glow.setAttribute('r', 11 * (0.8 + Math.random() * 0.4));
    raf = requestAnimationFrame(step);
  }
  // Only runs while on screen, and not at all under reduced motion.
  var io = new IntersectionObserver(function (entries) {
    cancelAnimationFrame(raf);
    last = 0;
    if (entries[0].isIntersecting && !matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(step);
  });
  io.observe(root);
  input.addEventListener('input', onInput);
  return function () {
    io.disconnect();
    cancelAnimationFrame(raf);
    input.removeEventListener('input', onInput);
  };
}

document.querySelectorAll('.slider-fuse').forEach(initSliderFuse);
