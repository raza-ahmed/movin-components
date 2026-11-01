function initSliderBand(root) {
  var W = 240;
  var Y = 26;
  var R = 10;
  var HOURS = 24;
  var lo = root.querySelector('.slider-band__input--lo');
  var hi = root.querySelector('.slider-band__input--hi');
  var rubber = root.querySelector('.slider-band__rubber');
  var pegs = root.querySelectorAll('.slider-band__peg');
  var heads = root.querySelectorAll('.slider-band__head');
  var rings = root.querySelectorAll('.slider-band__ring');
  var range = root.querySelector('.slider-band__value b');
  var hours = root.querySelector('.slider-band__value span');
  var d = 0;
  var amp = 0;
  var t = 0;
  var on = false;
  var raf = 0;
  function at(h) { return 14 + (h / HOURS) * (W - 28); }
  function clock(h) { return Math.floor(h) + ':' + (h % 1 ? '30' : '00'); }
  // The band loops round both pegs; stretched rubber thins out, and a pluck bows the two strands apart.
  function draw() {
    var xl = at(+lo.value);
    var xh = at(+hi.value);
    var mid = (xl + xh) / 2;
    rubber.setAttribute('d',
      'M ' + xl + ' ' + (Y - R) + ' Q ' + mid + ' ' + (Y - R - 2 * d) + ' ' + xh + ' ' + (Y - R) + ' A ' + R + ' ' + R + ' 0 0 1 ' + xh + ' ' + (Y + R) +
      ' Q ' + mid + ' ' + (Y + R + 2 * d) + ' ' + xl + ' ' + (Y + R) + ' A ' + R + ' ' + R + ' 0 0 1 ' + xl + ' ' + (Y - R) + ' Z');
    rubber.setAttribute('stroke-width', Math.max(1.4, Math.min(6, 300 / (xh - xl))));
    [pegs[0], heads[0], rings[0]].forEach(function (c) { c.setAttribute('cx', xl); });
    [pegs[1], heads[1], rings[1]].forEach(function (c) { c.setAttribute('cx', xh); });
  }
  // The strands vibrate, higher pitched the tighter the band, and die away.
  function pluck(a) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    amp = Math.min(4.5, Math.max(amp, a));
    if (on) return;
    on = true;
    var last = performance.now();
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      t += dt;
      amp *= Math.exp(-4.5 * dt);
      if (amp < 0.05) {
        on = false;
        amp = 0;
        d = 0;
        return draw();
      }
      d = amp * Math.sin(t * Math.PI * 2 * (5 + (at(+hi.value) - at(+lo.value)) / 18));
      draw();
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function update(e) {
    if (e.target === lo && +lo.value > +hi.value - 1) lo.value = +hi.value - 1;
    if (e.target === hi && +hi.value < +lo.value + 1) hi.value = +lo.value + 1;
    range.textContent = clock(+lo.value) + ' – ' + clock(+hi.value);
    hours.textContent = +hi.value - +lo.value + ' h';
    lo.setAttribute('aria-valuetext', clock(+lo.value));
    hi.setAttribute('aria-valuetext', clock(+hi.value));
    lo.style.zIndex = +lo.value > HOURS / 2 ? 2 : 1;
    hi.style.zIndex = +lo.value > HOURS / 2 ? 1 : 2;
    draw();
    pluck(0.8);
  }
  function release() { pluck(4); }
  function keyup() { pluck(2.5); }
  lo.addEventListener('input', update);
  hi.addEventListener('input', update);
  root.addEventListener('pointerup', release);
  root.addEventListener('keyup', keyup);
  return function () {
    cancelAnimationFrame(raf);
    lo.removeEventListener('input', update);
    hi.removeEventListener('input', update);
    root.removeEventListener('pointerup', release);
    root.removeEventListener('keyup', keyup);
  };
}

document.querySelectorAll('.slider-band').forEach(initSliderBand);
