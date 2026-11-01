function initSliderExtrude(root) {
  var W = 240;
  var F = 46;
  var D = 9;
  var X0 = 6;
  var X1 = W - 6 - D;
  var input = root.querySelector('.slider-extrude__input');
  var front = root.querySelector('.slider-extrude__front');
  var top = root.querySelector('.slider-extrude__top');
  var end = root.querySelector('.slider-extrude__end');
  var ring = root.querySelector('.slider-extrude__ring');
  var label = root.querySelector('.slider-extrude__value b');
  var held = false;
  var x = at(+input.value);
  var h = 12;
  var vx = 0;
  var vh = 0;
  var raf = 0;
  function at(v) { return X0 + 6 + (v / 100) * (X1 - X0 - 6); }
  function pts() {
    return Array.prototype.map.call(arguments, function (p) { return p.join(','); }).join(' ');
  }
  // The filled length rises out of the track as a block: a front face, a top and an end.
  function draw() {
    front.setAttribute('points', pts([X0, F - h], [x, F - h], [x, F], [X0, F]));
    top.setAttribute('points', pts([X0, F - h], [x, F - h], [x + D, F - D - h], [X0 + D, F - D - h]));
    end.setAttribute('points', pts([x, F - h], [x + D, F - D - h], [x + D, F - D], [x, F]));
    ring.setAttribute('points', pts([x - 4, F - h - 4], [x + D + 4, F - D - h - 4], [x + D + 4, F - D + 4], [x - 4, F + 4]));
  }
  // Length and height each ride a spring; holding the bar pushes the block up taller.
  function run() {
    cancelAnimationFrame(raf);
    var gx = at(+input.value);
    var gh = held ? 22 : 12;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = gx;
      h = gh;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      vx += (-240 * (x - gx) - 28 * vx) * dt;
      x += vx * dt;
      vh += (-300 * (h - gh) - 14 * vh) * dt;
      h += vh * dt;
      if (Math.abs(x - gx) + Math.abs(h - gh) < 0.05 && Math.abs(vx) + Math.abs(vh) < 0.5) {
        x = gx;
        h = gh;
        vx = vh = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function update() {
    label.textContent = input.value + ' GB';
    input.setAttribute('aria-valuetext', input.value + ' gigabytes');
    run();
  }
  function down() {
    held = true;
    run();
  }
  function up() {
    held = false;
    run();
  }
  input.addEventListener('input', update);
  input.addEventListener('pointerdown', down);
  input.addEventListener('pointerup', up);
  input.addEventListener('pointercancel', up);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', update);
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('pointerup', up);
    input.removeEventListener('pointercancel', up);
  };
}

document.querySelectorAll('.slider-extrude').forEach(initSliderExtrude);
