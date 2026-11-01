function initSliderPlough(root) {
  var W = 240;
  var BED = 40;
  var CUT = 45;
  var BOT = 51;
  var NS = 'http://www.w3.org/2000/svg';
  var input = root.querySelector('.slider-plough__input');
  var svg = root.querySelector('.slider-plough__svg');
  var floor = root.querySelector('.slider-plough__floor');
  var bed = root.querySelector('.slider-plough__bed');
  var handle = root.querySelector('.slider-plough__handle');
  var grip = root.querySelector('.slider-plough__grip');
  var blade = root.querySelector('.slider-plough__blade');
  var ring = root.querySelector('.slider-plough__ring');
  var label = root.querySelector('.slider-plough__value b');
  var x = at(+input.value);
  var vx = 0;
  var heap = 0;
  var acc = 0;
  var grains = [];
  var raf = 0;
  function at(v) { return 10 + (v / 100) * (W - 20); }
  function draw() {
    // The heap leans against the blade and falls away at roughly the angle sand rests at.
    var len = 6 + heap * 2.4;
    var d = 'M ' + (x + 2) + ' ' + BED;
    for (var s = 0; s <= 8; s++) d += ' L ' + (x + 2 + (len * s) / 8).toFixed(2) + ' ' + (BED - heap * Math.pow(1 - s / 8, 1.6)).toFixed(2);
    bed.setAttribute('d', d + ' L ' + (W - 2) + ' ' + BED + ' L ' + (W - 2) + ' ' + BOT + ' L ' + (x + 2) + ' ' + BOT + ' Z');
    floor.setAttribute('width', Math.max(0, x - 2));
    handle.setAttribute('x1', x);
    handle.setAttribute('x2', x - 13);
    grip.setAttribute('cx', x - 13);
    blade.setAttribute('x', x - 2);
    ring.setAttribute('x', x - 18);
  }
  // Pushing forward piles sand against the blade, more the faster you push; stop and the heap slumps.
  function run() {
    cancelAnimationFrame(raf);
    var goal = at(+input.value);
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = goal;
      heap = 0;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      vx += (-300 * (x - goal) - 30 * vx) * dt;
      x += vx * dt;
      var push = Math.max(0, vx);
      heap = Math.min(14, heap + push * 0.14 * dt) * Math.exp(-dt * (push > 20 ? 0.3 : vx < -20 ? 6 : 2.2));
      // Grains spill over the crest and run down the face of the heap.
      acc += push * 0.08 * dt;
      while (acc >= 1) {
        acc -= 1;
        if (grains.length >= 14) continue;
        var el = document.createElementNS(NS, 'circle');
        el.setAttribute('class', 'slider-plough__grain');
        el.setAttribute('r', '1');
        svg.insertBefore(el, handle);
        grains.push({ el: el, x: x + 3, y: BED - heap, vx: push + 25 + Math.random() * 45, vy: -10 - Math.random() * 25 });
      }
      grains = grains.filter(function (g) {
        g.vy += 300 * dt;
        g.x += g.vx * dt;
        g.y += g.vy * dt;
        if (g.y >= BED) {
          g.el.remove();
          return false;
        }
        g.el.setAttribute('cx', g.x);
        g.el.setAttribute('cy', g.y);
        return true;
      });
      draw();
      if (Math.abs(x - goal) < 0.05 && Math.abs(vx) < 0.5 && heap < 0.05 && !grains.length) {
        x = goal;
        vx = heap = 0;
        return draw();
      }
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

document.querySelectorAll('.slider-plough').forEach(initSliderPlough);
