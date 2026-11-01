function initSliderLift(root) {
  var W = 240;
  var input = root.querySelector('.slider-lift__input');
  var body = root.querySelector('.slider-lift__body');
  var value = root.querySelector('.slider-lift__value');
  var shadow = root.querySelector('.slider-lift__shadow');
  var v = +input.value, held = false, settle, ripple;
  function still() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function tilt(deg) { root.style.setProperty('--slider-lift-tilt', deg + 'deg'); }
  function update() {
    var next = +input.value;
    // Held up, the thumb swings back against the drag, then hangs straight once you pause.
    if (held && !still()) tilt(Math.max(-18, Math.min(18, (next - v) * 2.4)));
    v = next;
    root.style.setProperty('--slider-lift-x', 10 + (v / 100) * (W - 20) + 'px');
    value.textContent = v;
    input.setAttribute('aria-valuetext', v + '%');
    clearTimeout(settle);
    settle = setTimeout(function () { tilt(0); }, 100);
  }
  function drop() {
    held = false;
    root.classList.remove('slider-lift--held');
    tilt(0);
    removeEventListener('pointerup', drop);
    removeEventListener('pointercancel', drop);
    if (still()) return;
    // A ripple on the track where it lands, and a squash timed to meet it as the lift springs back.
    if (ripple) ripple.remove();
    ripple = document.createElement('span');
    ripple.className = 'slider-lift__ripple';
    ripple.setAttribute('aria-hidden', 'true');
    root.insertBefore(ripple, shadow);
    body.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.16, 0.82)', offset: 0.35 },
        { transform: 'scale(0.96, 1.05)', offset: 0.7 },
        { transform: 'scale(1)' },
      ],
      { duration: 420, delay: 110, easing: 'ease-out' }
    );
  }
  function pickUp() {
    held = true;
    root.classList.add('slider-lift--held');
    addEventListener('pointerup', drop);
    addEventListener('pointercancel', drop);
  }
  input.addEventListener('input', update);
  input.addEventListener('pointerdown', pickUp);
  return function () {
    clearTimeout(settle);
    removeEventListener('pointerup', drop);
    removeEventListener('pointercancel', drop);
    input.removeEventListener('input', update);
    input.removeEventListener('pointerdown', pickUp);
  };
}

document.querySelectorAll('.slider-lift').forEach(initSliderLift);
