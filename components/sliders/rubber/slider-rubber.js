function initSliderRubber(root) {
  var H = 156;
  var body = root.querySelector('.slider-rubber__body');
  var input = root.querySelector('.slider-rubber__input');
  var value = root.querySelector('.slider-rubber__value');
  var suns = root.querySelectorAll('.slider-rubber__icon g');
  var v = +input.value, held = false, drag = null, origin = 'bottom';
  /* Past the end the capsule follows the finger with growing resistance, up to 20px. */
  function rubber(over) { return Math.sign(over) * 20 * (1 - 1 / (Math.abs(over) / 50 + 1)); }
  function draw(pull) {
    var s = Math.abs(pull);
    body.style.transformOrigin = '50% ' + (origin === 'bottom' ? '100%' : '0%');
    body.style.transform = 'scale(' + ((held ? 1.04 : 1) * (1 - (s / H) * 0.4)).toFixed(4) + ', ' + (1 + s / H).toFixed(4) + ')';
    body.style.transition = held ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.3, 1.6, 0.5, 1)';
    root.style.setProperty('--slider-rubber-v', v / 100);
    root.classList.toggle('slider-rubber--held', held);
    // The sun turns and its rays grow with the brightness.
    suns.forEach(function (g) {
      g.setAttribute('transform', 'rotate(' + v * 0.9 + ')');
      g.querySelectorAll('line').forEach(function (ray) { ray.setAttribute('y2', -7.4 - 3 * (v / 100)); });
    });
    var r = Math.round(v);
    input.value = r;
    input.setAttribute('aria-valuetext', r + '%');
    value.textContent = r + '%';
  }
  // Drag is relative, like the control-centre sliders: grab anywhere and move from where it is.
  function down(e) {
    body.setPointerCapture(e.pointerId);
    drag = { y: e.clientY, v: v };
    held = true;
    input.focus({ preventScroll: true });
    draw(0);
  }
  function move(e) {
    if (!drag) return;
    var raw = drag.v + ((drag.y - e.clientY) / H) * 100;
    v = Math.max(0, Math.min(100, raw));
    var over = raw > 100 ? ((raw - 100) / 100) * H : raw < 0 ? (raw / 100) * H : 0;
    if (over) origin = over > 0 ? 'bottom' : 'top';
    draw(matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : rubber(over));
  }
  function end() {
    drag = null;
    held = false;
    draw(0);
  }
  function key() {
    v = +input.value;
    draw(0);
  }
  body.addEventListener('pointerdown', down);
  body.addEventListener('pointermove', move);
  body.addEventListener('pointerup', end);
  body.addEventListener('pointercancel', end);
  input.addEventListener('input', key);
  return function () {
    body.removeEventListener('pointerdown', down);
    body.removeEventListener('pointermove', move);
    body.removeEventListener('pointerup', end);
    body.removeEventListener('pointercancel', end);
    input.removeEventListener('input', key);
  };
}

document.querySelectorAll('.slider-rubber').forEach(initSliderRubber);
