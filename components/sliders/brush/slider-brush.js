function initSliderBrush(root) {
  var W = 240;
  var MID = 24;
  var input = root.querySelector('.slider-brush__input');
  var paths = root.querySelectorAll('.slider-brush__svg > path');
  var load = root.querySelector('.slider-brush__svg linearGradient');
  var guide = root.querySelector('.slider-brush__guide');
  var wet = root.querySelector('.slider-brush__wet');
  var ring = root.querySelector('.slider-brush__ring');
  var label = root.querySelector('.slider-brush__value b');

  // The brush lands at half pressure and presses down to full width over the first 30px.
  function width(x) { return 9.5 * (0.5 + 0.5 * Math.min(1, x / 30)) * (1 + 0.06 * Math.sin(x / 15)); }
  function centre(x) { return MID + 0.9 * Math.sin(x / 26); }
  /** One stroke from the left edge to e: it swells in, wavers a little and ends in a round, wet tip. */
  function stroke(e) {
    var top = [];
    var bot = [];
    var w = 0;
    for (var x = 5; x <= e; x += 4) {
      w = width(x);
      top.push(x.toFixed(1) + ',' + (centre(x) - w).toFixed(2));
      bot.unshift(x.toFixed(1) + ',' + (centre(x) + w).toFixed(2));
    }
    var w0 = width(5);
    var y0 = centre(5);
    var y = centre(e);
    return {
      d: 'M' + top.join('L') + 'L' + e + ',' + (y - w).toFixed(2) + 'A' + w + ' ' + w + ' 0 0 1 ' + e + ',' + (y + w).toFixed(2) +
        'L' + bot.join('L') + 'L5,' + (y0 + w0).toFixed(2) + 'A' + w0 + ' ' + w0 + ' 0 0 1 5,' + (y0 - w0).toFixed(2) + 'Z',
      w: w,
      y: y,
    };
  }
  function render() {
    var v = +input.value;
    var e = 12 + (v / 100) * (W - 26);
    var s = stroke(e);
    paths.forEach(function (p) { p.setAttribute('d', s.d); });
    load.setAttribute('x2', e);
    guide.setAttribute('x1', e + s.w + 6);
    wet.setAttribute('cx', e + s.w * 0.25);
    wet.setAttribute('cy', s.y);
    wet.setAttribute('ry', s.w * 0.8);
    ring.setAttribute('x', e - 6);
    ring.setAttribute('width', s.w + 14);
    label.textContent = v + '%';
    input.setAttribute('aria-valuetext', v + '%');
  }
  input.addEventListener('input', render);
  return function () {
    input.removeEventListener('input', render);
  };
}

document.querySelectorAll('.slider-brush').forEach(initSliderBrush);
