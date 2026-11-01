function initSliderWedge(root) {
  var W = 240, BASE = 46, LOW = 3, HIGH = 26;
  var input = root.querySelector('.slider-wedge__input');
  var clip = root.querySelector('clipPath rect');
  var grad = root.querySelector('linearGradient');
  var bar = root.querySelector('.slider-wedge__bar');
  var ring = root.querySelector('.slider-wedge__ring');
  // Height of the ramp's top edge at any x.
  function top(x) { return BASE - LOW - ((HIGH - LOW) * (x - 2)) / (W - 4); }
  function update() {
    var t = 6 + (input.value / 100) * (W - 12);
    var yt = top(t) - 7;
    clip.setAttribute('width', t + 4);
    grad.setAttribute('x2', t);
    bar.setAttribute('x', t - 2);
    bar.setAttribute('y', yt);
    bar.setAttribute('height', BASE + 4 - yt);
    ring.setAttribute('x', t - 6);
    ring.setAttribute('y', yt - 4);
    ring.setAttribute('height', BASE + 12 - yt);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-wedge').forEach(initSliderWedge);
