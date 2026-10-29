function initSliderHourglass(root) {
  var input = root.querySelector('.slider-hourglass__input');
  var sand = root.querySelectorAll('.slider-hourglass__sand');
  var stream = root.querySelector('.slider-hourglass__stream');
  var read = root.querySelector('.slider-hourglass__min');
  function update() {
    var min = +input.value;
    var t = min / 60;
    // Sand left in the top bulb sits on its narrow neck; what has run out piles up at the bottom.
    var top = 64 - t * 48;
    var pile = (1 - t) * 44;
    sand[0].setAttribute('y', top.toFixed(1));
    sand[0].setAttribute('height', (66 - top).toFixed(1));
    sand[1].setAttribute('d', 'M10 125Q50 ' + (125 - pile * 2).toFixed(1) + ' 90 125Z');
    stream.style.display = min > 0 ? '' : 'none';
    read.textContent = min;
    input.setAttribute('aria-valuetext', min + ' minutes');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-hourglass').forEach(initSliderHourglass);
