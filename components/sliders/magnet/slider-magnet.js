function initSliderMagnet(root) {
  var W = 240;
  var T = 18;
  var R = 70;
  var ZONE = 6;
  var input = root.querySelector('.slider-magnet__input');
  var fill = root.querySelector('.slider-magnet__fill');
  var pin = root.querySelector('.slider-magnet__pin');
  var thumb = root.querySelector('.slider-magnet__thumb');
  var label = root.querySelector('.slider-magnet__value b');
  var drag = false;
  var x = at(+input.value);
  var v = 0;
  var raf = 0;
  function at(n) { return T / 2 + (n / 100) * (W - T); }
  // The pin leans towards an approaching thumb, harder the closer it gets, and stands up once it holds it.
  function draw() {
    var d = x - at(R);
    var lean = +input.value === R || Math.abs(d) > 60 ? 0 : Math.sign(d) * 32 * (1 - Math.abs(d) / 60);
    fill.style.width = x + 'px';
    thumb.style.transform = 'translateX(' + (x - T / 2) + 'px)';
    pin.style.transform = 'rotate(' + lean + 'deg)';
  }
  // The thumb rides a stiff, slightly loose spring, so being pulled onto the mark reads as a snap.
  function run() {
    cancelAnimationFrame(raf);
    var goal = at(+input.value);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = goal;
      return draw();
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-420 * (x - goal) - 22 * v) * dt;
      x += v * dt;
      if (Math.abs(x - goal) < 0.05 && Math.abs(v) < 0.5) {
        x = goal;
        v = 0;
        return draw();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  // Only a drag is pulled in: the arrow keys still reach every value either side of the mark.
  function update() {
    var raw = +input.value;
    if (drag && Math.abs(raw - R) < ZONE) input.value = raw = R;
    root.classList.toggle('slider-magnet--held', raw === R);
    label.textContent = raw + '%';
    input.setAttribute('aria-valuetext', raw === R ? raw + '%, recommended' : raw + '%');
    run();
  }
  function down() { drag = true; }
  function up() { drag = false; }
  input.addEventListener('pointerdown', down);
  input.addEventListener('pointerup', up);
  input.addEventListener('pointercancel', up);
  input.addEventListener('input', update);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('pointerup', up);
    input.removeEventListener('pointercancel', up);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-magnet').forEach(initSliderMagnet);
