function initSliderAscii(root) {
  var CELLS = 20;
  var SPIN = ['|', '/', '-', '\\'];
  var input = root.querySelector('.slider-ascii__input');
  var on = root.querySelector('.slider-ascii__on');
  var tip = root.querySelector('.slider-ascii__tip');
  var off = root.querySelector('.slider-ascii__off');
  var label = root.querySelector('.slider-ascii__top b');
  var drawn = cellOf(+input.value);
  var moving = false;
  var spin = 0;
  var stepTimer = 0;
  var idleTimer = 0;
  var spinTimer = 0;
  function cellOf(v) { return Math.round((v / 100) * (CELLS - 1)); }
  function paint() {
    on.textContent = new Array(drawn + 1).join('=');
    off.textContent = new Array(CELLS - drawn).join('·');
    tip.textContent = moving ? SPIN[spin % SPIN.length] : '>';
  }
  function update() {
    var v = +input.value;
    var target = cellOf(v);
    label.textContent = ('  ' + v).slice(-3) + '%';
    input.setAttribute('aria-valuetext', v + '%');
    clearTimeout(stepTimer);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawn = target;
      return paint();
    }
    // The bar redraws towards the value one character at a time, like a terminal repainting,
    // and the head spins while the value is changing.
    (function tick() {
      if (drawn === target) return;
      drawn += Math.sign(target - drawn);
      paint();
      stepTimer = setTimeout(tick, 22);
    })();
    moving = true;
    if (!spinTimer) spinTimer = setInterval(function () {
      spin += 1;
      paint();
    }, 70);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      moving = false;
      clearInterval(spinTimer);
      spinTimer = 0;
      paint();
    }, 260);
  }
  input.addEventListener('input', update);
  return function () {
    clearTimeout(stepTimer);
    clearTimeout(idleTimer);
    clearInterval(spinTimer);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-ascii').forEach(initSliderAscii);
