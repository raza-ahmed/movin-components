function initSliderZero(root) {
  var W = 240;
  var T = 18;
  var R = 30;
  var input = root.querySelector('.slider-zero__input');
  var fill = root.querySelector('.slider-zero__fill');
  var thumb = root.querySelector('.slider-zero__thumb');
  var sign = root.querySelector('.slider-zero__sign');
  var reading = root.querySelector('.slider-zero__value b');
  var drag = false;
  var mid = at(0);
  function at(v) { return T / 2 + ((v + R) / (2 * R)) * (W - T); }
  // A drag sticks at zero for a moment as it crosses; the keys still step straight through.
  function update() {
    var raw = +input.value;
    if (drag && Math.abs(raw) < 3) input.value = raw = 0;
    var x = at(raw);
    var s = raw > 0 ? '+' : raw < 0 ? '−' : '';
    root.classList.toggle('slider-zero--at', raw === 0);
    // The fill grows from the centre towards the thumb, either way.
    fill.style.left = Math.min(x, mid) + 'px';
    fill.style.width = Math.abs(x - mid) + 'px';
    thumb.style.left = x + 'px';
    if (sign.textContent !== s) {
      // The sign flips over when it changes: replay its keyframes.
      sign.textContent = s;
      sign.style.animation = 'none';
      void sign.offsetWidth;
      sign.style.animation = '';
    }
    reading.lastChild.nodeValue = (Math.abs(raw) / 10).toFixed(1) + ' EV';
    input.setAttribute('aria-valuetext', (s === '+' ? 'plus ' : s ? 'minus ' : '') + (Math.abs(raw) / 10).toFixed(1) + ' EV');
  }
  function down() { drag = true; }
  function up() { drag = false; }
  input.addEventListener('pointerdown', down);
  input.addEventListener('pointerup', up);
  input.addEventListener('pointercancel', up);
  input.addEventListener('input', update);
  return function () {
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('pointerup', up);
    input.removeEventListener('pointercancel', up);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-zero').forEach(initSliderZero);
