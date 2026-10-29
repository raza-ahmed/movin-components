function initSliderRings(root) {
  var input = root.querySelector('.slider-rings__input');
  var read = root.querySelector('.slider-rings__read');
  var rings = root.querySelectorAll('.slider-rings__ring');
  function update() {
    var v = +input.value;
    var t = (v - 1) / (120 - 1);
    root.style.setProperty('--slider-rings-v', t);
    // One ring a year, up to the stump's sixteen; each sits at its share of the radius.
    var shown = Math.max(1, Math.round(t * rings.length));
    rings.forEach(function (ring, k) {
      ring.style.setProperty('--f', ((k + 1) / (shown + 0.6)).toFixed(3));
      ring.style.setProperty('--on', k < shown ? 1 : 0);
    });
    var unit = v === 1 ? 'year' : 'years';
    read.innerHTML = '<b>' + v + '</b> ' + unit + ' old';
    input.setAttribute('aria-valuetext', v + ' ' + unit);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-rings').forEach(initSliderRings);
