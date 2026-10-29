function initSliderTide(root) {
  var input = root.querySelector('.slider-tide__input');
  var read = root.querySelector('.slider-tide__read');
  var rope = root.querySelector('.slider-tide__rope path');
  function update() {
    var v = +input.value;
    var t = (v - 0) / (60 - 0);
    root.style.setProperty('--slider-tide-v', t);
    var m = (v / 10).toFixed(1);
    // The mooring line: from the ring on the wall to the bow; slack at low water, nearly straight at high.
    var by = 96 - t * 62;
    var sag = (1 - t) * 18 + 2;
    rope.setAttribute('d', 'M40 30Q70 ' + ((30 + by - 8) / 2 + sag) + ' 100 ' + (by - 8).toFixed(1));
    read.innerHTML = '<b>' + m + ' m</b> · ' + (v < 15 ? 'Low water' : v < 45 ? 'Rising' : 'High water');
    input.setAttribute('aria-valuetext', m + ' metres');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-tide').forEach(initSliderTide);
