function initFieldScrub(root) {
  var MIN = 0;
  var MAX = 480;
  var box = root.querySelector('.field-scrub__box');
  var handle = root.querySelector('.field-scrub__handle');
  var input = root.querySelector('.field-scrub__input');
  var value = +input.value;
  var start = { x: 0, v: 0 };
  var drag = false;
  function clamp(n) { return Math.max(MIN, Math.min(MAX, Math.round(n))); }
  function show(n) {
    value = n;
    box.style.setProperty('--v', n);
  }
  function set(n) {
    show(clamp(n));
    input.value = String(value);
  }
  function setDrag(on) {
    drag = on;
    root.toggleAttribute('data-drag', on);
  }
  // Drag the label to scrub: one pixel is one unit, Shift for ten.
  function onDown(e) {
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    start = { x: e.clientX, v: value };
    setDrag(true);
  }
  function onMove(e) {
    if (drag) set(start.v + (e.clientX - start.x) * (e.shiftKey ? 10 : 1));
  }
  function onUp() { setDrag(false); }
  function onInput() {
    input.value = input.value.replace(/[^\d]/g, '');
    if (input.value !== '') show(clamp(+input.value));
  }
  function onBlur() { set(value); }
  function onKeyDown(e) {
    var step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowUp') { e.preventDefault(); set(value + step); }
    if (e.key === 'ArrowDown') { e.preventDefault(); set(value - step); }
  }
  handle.addEventListener('pointerdown', onDown);
  handle.addEventListener('pointermove', onMove);
  handle.addEventListener('pointerup', onUp);
  handle.addEventListener('pointercancel', onUp);
  input.addEventListener('input', onInput);
  input.addEventListener('blur', onBlur);
  input.addEventListener('keydown', onKeyDown);
  return function () {
    handle.removeEventListener('pointerdown', onDown);
    handle.removeEventListener('pointermove', onMove);
    handle.removeEventListener('pointerup', onUp);
    handle.removeEventListener('pointercancel', onUp);
    input.removeEventListener('input', onInput);
    input.removeEventListener('blur', onBlur);
    input.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.field-scrub').forEach(initFieldScrub);
