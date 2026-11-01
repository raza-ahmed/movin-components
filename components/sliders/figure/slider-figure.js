function initSliderFigure(root) {
  var input = root.querySelector('.slider-figure__input');
  var done = root.querySelector('.slider-figure__done');
  var left = root.querySelector('.slider-figure__left');
  var num = root.querySelector('.slider-figure__num');
  // An underdamped spring chases the value; its speed is the lean, which builds while you drag
  // and swings past upright once before settling.
  var x = +input.value;
  var v = 0;
  var raf = 0;
  function lean(deg) { num.style.transform = 'skewX(' + -deg + 'deg)'; }
  function render() {
    var goal = +input.value;
    done.style.flexGrow = goal;
    left.style.flexGrow = 100 - goal;
    num.firstChild.nodeValue = goal;
    input.setAttribute('aria-valuetext', goal + '%');
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      x = goal;
      return;
    }
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-260 * (x - goal) - 14 * v) * dt;
      x += v * dt;
      if (Math.abs(x - goal) < 0.01 && Math.abs(v) < 0.5) {
        x = goal;
        v = 0;
        return lean(0);
      }
      lean(Math.max(-16, Math.min(16, v * 0.09)));
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  input.addEventListener('input', render);
  return function () {
    cancelAnimationFrame(raf);
    input.removeEventListener('input', render);
  };
}

document.querySelectorAll('.slider-figure').forEach(initSliderFigure);
