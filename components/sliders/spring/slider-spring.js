function initSliderSpring(root) {
  var COILS = 9;
  var input = root.querySelector('.slider-spring__input');
  var coil = root.querySelector('.slider-spring__coil');
  var weight = root.querySelector('svg g');
  var read = root.querySelector('.slider-spring__read b');
  function update() {
    var t = input.value / 100;
    var end = 66 + t * 128; // where the spring meets the weight
    var amp = 15 - t * 6;
    var pts = ['20 38'];
    for (var i = 1; i < COILS * 2; i++) pts.push((20 + 6 + ((end - 32) * i) / (COILS * 2)).toFixed(1) + ' ' + (i % 2 ? 38 - amp : 38 + amp));
    pts.push((end - 6).toFixed(1) + ' 38', end.toFixed(1) + ' 38');
    coil.setAttribute('points', pts.join(' '));
    weight.setAttribute('transform', 'translate(' + end.toFixed(1) + ' 20)');
    var newtons = Math.round(t * 120);
    read.textContent = newtons + ' N';
    input.setAttribute('aria-valuetext', newtons + ' newtons');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-spring').forEach(initSliderSpring);
