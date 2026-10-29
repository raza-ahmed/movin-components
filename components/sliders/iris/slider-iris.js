function initSliderIris(root) {
  var input = root.querySelector('.slider-iris__input');
  var read = root.querySelector('.slider-iris__read');
  var STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
  var blades = root.querySelector('.slider-iris__blades');
  var seams = root.querySelectorAll('.slider-iris__seam');
  // The opening: a hexagon that shrinks and turns as the blades close, cut out of the lens barrel.
  function shape(t) {
    var r = 40 - t * 30;
    var turn = t * 50;
    var hex = [];
    for (var i = 0; i < 6; i++) {
      var a = ((i * 60 + turn) * Math.PI) / 180;
      hex.push([56 + Math.cos(a) * r, 56 + Math.sin(a) * r]);
    }
    blades.setAttribute('d', 'M0 0H112V112H0ZM' + hex.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z');
    // Each blade edge runs from a corner of the opening out to the rim.
    hex.forEach(function (p, i) {
      var a = ((i * 60 + turn + 70) * Math.PI) / 180;
      seams[i].setAttribute('d', 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'L' + (56 + Math.cos(a) * 52).toFixed(1) + ' ' + (56 + Math.sin(a) * 52).toFixed(1));
    });
  }
  function update() {
    var v = +input.value;
    var t = (v - 0) / (7 - 0);
    root.style.setProperty('--slider-iris-v', t);
    shape(t);
    read.innerHTML = '<b>f/' + STOPS[v] + '</b> · ' + (v < 3 ? 'soft background' : v < 6 ? 'balanced' : 'everything sharp');
    input.setAttribute('aria-valuetext', 'f ' + STOPS[v]);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-iris').forEach(initSliderIris);
