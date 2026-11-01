function initSliderNib(root) {
  var W = 240;
  var Y = 30;
  var N = 115;
  var input = root.querySelector('.slider-nib__input');
  var ink = root.querySelector('.slider-nib__ink');
  var head = root.querySelector('.slider-nib__head');
  var guide = root.querySelector('.slider-nib__guide');
  var ring = root.querySelector('.slider-nib__ring');
  var label = root.querySelector('.slider-nib__value b');
  // The width of the line at every 2px, written as the nib passes over it.
  var w = [];
  for (var i = 0; i < N; i++) w.push(2.6 + 2.4 * Math.abs(Math.sin(i / 13)));
  var x = at(+input.value);
  var t = 0;
  function at(v) { return 6 + (v / 100) * (W - 12); }
  function sx(i) { return 6 + i * 2; }
  function draw() {
    var tip = at(+input.value);
    var k = Math.min(N - 1, Math.floor((tip - 6) / 2));
    var d = '';
    for (var i = 0; i <= k; i++) d += (i ? 'L ' : 'M ') + sx(i) + ' ' + (Y - w[i] / 2).toFixed(2) + ' ';
    d += 'L ' + tip + ' ' + Y + ' ';
    for (var j = k; j >= 0; j--) d += 'L ' + sx(j) + ' ' + (Y + w[j] / 2).toFixed(2) + ' ';
    ink.setAttribute('d', d + 'Z');
    head.setAttribute('transform', 'translate(' + tip + ' ' + Y + ') rotate(38)');
    guide.setAttribute('x1', tip + 6);
    ring.setAttribute('cx', tip + 5);
  }
  // Only forward strokes lay ink: slow is heavy, fast is a hairline. Going back leaves the line as drawn.
  function write() {
    var now = performance.now();
    var x1 = at(+input.value);
    var speed = (Math.abs(x1 - x) / Math.max(8, now - t)) * 1000;
    if (x1 > x) {
      var target = Math.max(1.4, Math.min(7, 7.4 - speed / 60));
      var i0 = Math.max(0, Math.ceil((x - 6) / 2));
      var i1 = Math.min(N - 1, Math.floor((x1 - 6) / 2));
      for (var i = i0; i <= i1; i++) {
        var prev = i > 0 ? w[i - 1] : target;
        w[i] = prev + (target - prev) * 0.35;
      }
    }
    x = x1;
    t = now;
    label.textContent = input.value + '%';
    input.setAttribute('aria-valuetext', input.value + '%');
    draw();
  }
  input.addEventListener('input', write);
  return function () {
    input.removeEventListener('input', write);
  };
}

document.querySelectorAll('.slider-nib').forEach(initSliderNib);
