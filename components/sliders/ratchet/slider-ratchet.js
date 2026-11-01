function initSliderRatchet(root) {
  var N = 20;
  var P = 10.8;
  var X0 = 12;
  var BASE = 46;
  var H = 6;
  var NS = 'http://www.w3.org/2000/svg';
  var input = root.querySelector('.slider-ratchet__input');
  var svg = root.querySelector('.slider-ratchet__svg');
  var done = root.querySelector('#slider-ratchet-done rect');
  var left = root.querySelector('#slider-ratchet-left rect');
  var block = root.querySelector('.slider-ratchet__block');
  var pawl = root.querySelector('.slider-ratchet__pawl');
  var pin = root.querySelector('.slider-ratchet__pin');
  var ring = root.querySelector('.slider-ratchet__ring');
  var label = root.querySelector('.slider-ratchet__value b');
  var x = at(+input.value);
  var v = 0;
  var tip = surf(x);
  var vy = 0;
  var raf = 0;
  function at(k) { return X0 + k * P + 1.5; }
  // The tooth profile: a ramp rising to the right, then a sheer drop.
  function surf(px) { return px < X0 || px >= X0 + N * P ? BASE : BASE - (H * ((px - X0) % P)) / P; }
  function draw() {
    done.setAttribute('width', x);
    left.setAttribute('x', x);
    block.setAttribute('x', x - 16);
    pawl.setAttribute('x1', x - 9);
    pawl.setAttribute('x2', x);
    pawl.setAttribute('y2', tip - 1.3);
    pin.setAttribute('cx', x - 9);
    ring.setAttribute('x', x - 20);
  }
  // A click: a short tick flashes up from the tooth the pawl just dropped onto.
  function click() {
    var c = document.createElementNS(NS, 'line');
    c.setAttribute('class', 'slider-ratchet__click');
    c.setAttribute('x1', x);
    c.setAttribute('x2', x);
    c.setAttribute('y1', BASE - 9);
    c.setAttribute('y2', BASE - 14);
    c.style.transformOrigin = x + 'px ' + BASE + 'px';
    c.addEventListener('animationend', function () { c.remove(); });
    svg.insertBefore(c, block);
  }
  // The block slides on a spring; the pawl tip falls under gravity but can never sink into a tooth,
  // so it rides up each ramp and drops off the far edge with a bounce.
  function run() {
    cancelAnimationFrame(raf);
    var goal = at(+input.value);
    label.textContent = input.value + ' / ' + N;
    input.setAttribute('aria-valuetext', input.value + ' of ' + N);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = goal;
      tip = surf(goal);
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.02, (now - last) / 1000);
      last = now;
      v += (-260 * (x - goal) - 30 * v) * dt;
      x += v * dt;
      var floor = surf(x);
      vy += 2600 * dt;
      tip += vy * dt;
      if (tip >= floor) {
        if (vy > 140) click();
        tip = floor;
        vy = vy > 140 ? -vy * 0.22 : 0;
      }
      draw();
      if (Math.abs(x - goal) < 0.05 && Math.abs(v) < 0.5 && tip === floor && vy === 0) return;
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', run);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.slider-ratchet').forEach(initSliderRatchet);
