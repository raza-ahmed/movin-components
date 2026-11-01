function initSliderVial(root) {
  var W = 240;
  var MID = 16;
  var RX = 17;
  var RY = 8.5;
  var input = root.querySelector('.slider-vial__input');
  var bubble = root.querySelector('.slider-vial__bubble');
  var shine = root.querySelector('.slider-vial__shine');
  var ring = root.querySelector('.slider-vial__ring');
  var label = root.querySelector('.slider-vial__value');
  var dragging = false;
  // The bubble trails the value on one spring; its stretch rides a second, looser one.
  var q = { x: pos(+input.value), v: 0, s: 0, sv: 0 };
  var raf = 0;
  function pos(v) { return RX + 4 + ((v + 50) / 100) * (W - 2 * RX - 8); }

  function draw() {
    var rx = RX + q.s;
    var ry = Math.max(5.5, RY - q.s * 0.36);
    bubble.setAttribute('cx', q.x);
    bubble.setAttribute('rx', rx);
    bubble.setAttribute('ry', ry);
    shine.setAttribute('cx', q.x - rx * 0.12);
    shine.setAttribute('cy', MID - ry * 0.5);
    shine.setAttribute('rx', rx * 0.55);
    ring.setAttribute('x', q.x - rx - 5);
    ring.setAttribute('width', 2 * rx + 10);
  }
  function run() {
    cancelAnimationFrame(raf);
    var goal = pos(+input.value);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q = { x: goal, v: 0, s: 0, sv: 0 };
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-180 * (q.x - goal) - 22 * q.v) * dt;
      q.x += q.v * dt;
      // It lengthens while it travels and wobbles round and long again as it stops.
      q.sv += (-520 * (q.s - Math.min(12, Math.abs(q.v) * 0.035)) - 9 * q.sv) * dt;
      q.s += q.sv * dt;
      if (Math.abs(q.x - goal) < 0.05 && Math.abs(q.v) < 1 && Math.abs(q.s) < 0.05 && Math.abs(q.sv) < 0.5) {
        q = { x: goal, v: 0, s: 0, sv: 0 };
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function onInput() {
    // A drag settles into the centre when it comes close; arrow keys still step through it.
    if (dragging && Math.abs(+input.value) <= 2) input.value = 0;
    var v = +input.value;
    label.textContent = v === 0 ? 'Centre' : (v < 0 ? 'L ' : 'R ') + Math.abs(v);
    input.setAttribute('aria-valuetext', v === 0 ? 'Centre' : Math.abs(v) + (v < 0 ? ' left' : ' right'));
    run();
  }
  function down() { dragging = true; }
  function up() { dragging = false; }
  input.addEventListener('input', onInput);
  input.addEventListener('pointerdown', down);
  input.addEventListener('pointerup', up);
  input.addEventListener('pointercancel', up);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', onInput);
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('pointerup', up);
    input.removeEventListener('pointercancel', up);
  };
}

document.querySelectorAll('.slider-vial').forEach(initSliderVial);
