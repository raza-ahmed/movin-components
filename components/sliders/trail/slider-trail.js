function initSliderTrail(root) {
  var W = 230;
  var H = 90;
  var N = 46;
  var LENGTH_KM = 12;
  // The same fixed elevation profile the markup was drawn from, in metres.
  var ELEV = [];
  for (var k = 0; k < N; k++) {
    var x = k / (N - 1);
    ELEV.push(620 + 300 * Math.sin(x * 2.4 - 0.9) + 140 * Math.sin(x * 6.1 + 1.2) + 50 * Math.sin(x * 13 + 2));
  }
  function yOf(m) { return H - 8 - ((m - 120) / 1000) * (H - 20); }
  var input = root.querySelector('.slider-trail__input');
  var drop = root.querySelector('.slider-trail__drop');
  var hiker = root.querySelector('.slider-trail__hiker');
  var reads = root.querySelectorAll('.slider-trail__read b');
  function update() {
    var t = input.value / 100;
    var f = t * (N - 1);
    var i = Math.min(N - 2, Math.floor(f));
    var m = ELEV[i] + (ELEV[i + 1] - ELEV[i]) * (f - i);
    var px = (t * W).toFixed(1);
    var py = yOf(m).toFixed(1);
    var km = (t * LENGTH_KM).toFixed(1);
    var metres = Math.round(m).toLocaleString('en-US');
    root.style.setProperty('--slider-trail-v', t);
    drop.setAttribute('x1', px);
    drop.setAttribute('x2', px);
    drop.setAttribute('y1', py);
    hiker.setAttribute('cx', px);
    hiker.setAttribute('cy', py);
    reads[0].textContent = km;
    reads[1].textContent = metres;
    input.setAttribute('aria-valuetext', km + ' kilometres, ' + metres + ' metres high');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-trail').forEach(initSliderTrail);
