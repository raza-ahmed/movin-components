function initSliderFan(root) {
  var LEVELS = ['Off', '1', '2', '3', '4', '5'];
  var input = root.querySelector('.slider-fan__input');
  var blades = root.querySelector('.slider-fan__blades');
  var read = root.querySelector('.slider-fan__level b');
  function update() {
    var level = +input.value;
    root.style.setProperty('--slider-fan-v', level / 5);
    read.textContent = LEVELS[level];
    input.setAttribute('aria-valuetext', level ? 'Speed ' + level : 'Off');
  }
  input.addEventListener('input', update);
  update();

  // Spin by accumulating an angle, easing the speed towards the target, so it spools up and down instead of jumping.
  var raf = 0;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var angle = 0;
    var speed = 0;
    var last = performance.now();
    raf = requestAnimationFrame(function tick(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += (input.value * 300 - speed) * Math.min(1, dt * 1.6);
      angle = (angle + speed * dt) % 360;
      blades.style.transform = 'rotate(' + angle.toFixed(1) + 'deg)';
      raf = requestAnimationFrame(tick);
    });
  }
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-fan').forEach(initSliderFan);
