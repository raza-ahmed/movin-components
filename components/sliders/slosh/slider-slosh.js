function initSliderSlosh(root) {
  var W = 240;
  var TOP = 18;
  var BOT = 40;
  var MIDY = (TOP + BOT) / 2;
  var input = root.querySelector('.slider-slosh__input');
  var liquid = root.querySelector('.slider-slosh__liquid');
  var shine = root.querySelector('.slider-slosh__shine');
  var marks = root.querySelectorAll('.slider-slosh__mark');
  var ring = root.querySelector('.slider-slosh__ring');
  var label = root.querySelector('.slider-slosh__value b');
  var x = at(+input.value);
  var vx = 0;
  var lean = 0;
  var vl = 0;
  var raf = 0;
  function at(v) { return 12 + (v / 100) * (W - 24); }
  function draw() {
    liquid.setAttribute('d', 'M 0 ' + TOP + ' L ' + (x + lean) + ' ' + TOP + ' Q ' + (x + 3 + Math.abs(lean) * 0.4) + ' ' + MIDY + ' ' + (x - lean) + ' ' + BOT + ' L 0 ' + BOT + ' Z');
    shine.setAttribute('x2', Math.max(12, x + lean - 5));
    marks[0].setAttribute('points', x - 5 + ',' + (TOP - 10) + ' ' + (x + 5) + ',' + (TOP - 10) + ' ' + x + ',' + (TOP - 4));
    marks[1].setAttribute('points', x - 5 + ',' + (BOT + 10) + ' ' + (x + 5) + ',' + (BOT + 10) + ' ' + x + ',' + (BOT + 4));
    ring.setAttribute('x', x - 10);
  }
  // The front follows on a spring. The liquid's face lags behind its speed and swings past
  // upright once it stops, on a looser spring of its own: that swing is the slosh.
  function run() {
    cancelAnimationFrame(raf);
    var goal = at(+input.value);
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = goal;
      lean = 0;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      vx += (-170 * (x - goal) - 22 * vx) * dt;
      x += vx * dt;
      var want = Math.max(-9, Math.min(9, -vx * 0.035));
      vl += (-260 * (lean - want) - 6 * vl) * dt;
      lean += vl * dt;
      if (Math.abs(x - goal) < 0.05 && Math.abs(vx) < 0.5 && Math.abs(lean) < 0.05 && Math.abs(vl) < 0.5) {
        x = goal;
        vx = lean = vl = 0;
        return draw();
      }
      draw();
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

document.querySelectorAll('.slider-slosh').forEach(initSliderSlosh);
