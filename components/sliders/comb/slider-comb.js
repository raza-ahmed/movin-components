function initSliderComb(root) {
  var W = 240, BASE = 60;
  var input = root.querySelector('.slider-comb__input');
  var ticks = root.querySelectorAll('.slider-comb__tick');
  var label = root.querySelector('.slider-comb__value');
  var pitch = W / (ticks.length - 1);
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var v = +input.value, held = false, lean = 0, settle;
  function draw() {
    var t = 6 + (v / 100) * (W - 12);
    var peak = held ? 30 : 22;
    var spread = held ? 18 : 13;
    ticks.forEach(function (tick, i) {
      var x = i * pitch;
      // A bell of ticks around the thumb, like a magnified dock.
      var g = Math.exp(-Math.pow((x - t) / spread, 2));
      tick.style.height = 8 + peak * g + 'px';
      tick.style.background = x <= t ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(#cbced3, #393c41)';
      tick.style.transform = 'rotate(' + (lean * g).toFixed(2) + 'deg)';
    });
    label.textContent = v;
    label.style.bottom = 68 - BASE + 8 + peak + 6 + 'px';
    label.style.transform = 'translateX(calc(' + t + 'px - 50%))';
  }
  function update() {
    var next = +input.value;
    // Ticks near the thumb lean the way you drag, harder the faster you go, then stand back up.
    if (!still) lean = Math.max(-22, Math.min(22, (next - v) * 3));
    v = next;
    draw();
    clearTimeout(settle);
    settle = setTimeout(function () {
      lean = 0;
      draw();
    }, 110);
  }
  function up() {
    held = false;
    draw();
    removeEventListener('pointerup', up);
    removeEventListener('pointercancel', up);
  }
  function down() {
    held = true;
    draw();
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  }
  input.addEventListener('input', update);
  input.addEventListener('pointerdown', down);
  return function () {
    clearTimeout(settle);
    up();
    input.removeEventListener('input', update);
    input.removeEventListener('pointerdown', down);
  };
}

document.querySelectorAll('.slider-comb').forEach(initSliderComb);
