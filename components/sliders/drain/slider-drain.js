function initSliderDrain(root) {
  var input = root.querySelector('.slider-drain__input');
  var bar = root.querySelector('.slider-drain__bar');
  var main = root.querySelector('.slider-drain__main');
  var ghost = root.querySelector('.slider-drain__ghost');
  var reading = root.querySelector('.slider-drain__head b');
  var v = +input.value, flash;
  function update() {
    var next = +input.value;
    if (next === v) return;
    var losing = next < v;
    if (losing) {
      // The lost chunk flashes before it drains.
      if (flash) flash.remove();
      flash = document.createElement('span');
      flash.className = 'slider-drain__flash';
      flash.style.left = next + '%';
      flash.style.width = v - next + '%';
      bar.appendChild(flash);
      // A big hit jolts the bar.
      if (v - next >= 15 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        bar.animate(
          [{ transform: 'none' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(-1px)' }, { transform: 'none' }],
          { duration: 260, easing: 'ease-out' }
        );
      }
    }
    // Losing: the bar drops at once and the lost chunk drains after a beat. Gaining: the ghost leads and the bar fills up to it.
    main.style.transition = losing ? 'width 0.06s linear' : 'width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s';
    ghost.style.transition = losing ? 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1) 0.45s' : 'width 0.06s linear';
    v = next;
    main.style.width = v + '%';
    ghost.style.width = v + '%';
    root.style.setProperty('--slider-drain-v', v);
    reading.textContent = v;
    input.setAttribute('aria-valuetext', v + ' of 100');
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-drain').forEach(initSliderDrain);
