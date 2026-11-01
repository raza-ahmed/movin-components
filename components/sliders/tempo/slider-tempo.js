function initSliderTempo(root) {
  var W = 240;
  var T = 18;
  var Y = 26;
  var MIN = 40;
  var MAX = 200;
  var NS = 'http://www.w3.org/2000/svg';
  var input = root.querySelector('.slider-tempo__input');
  var svg = root.querySelector('.slider-tempo__svg');
  var fill = root.querySelector('.slider-tempo__fill');
  var thumb = root.querySelector('.slider-tempo__thumb');
  var ring = root.querySelector('.slider-tempo__ring');
  var beats = root.querySelectorAll('.slider-tempo__beat');
  var label = root.querySelector('.slider-tempo__value b');
  var pulses = [];
  var last = 0;
  var n = -1;
  var raf = 0;
  function at(b) { return T / 2 + ((b - MIN) / (MAX - MIN)) * (W - T); }
  function circle(cls) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', cls);
    c.setAttribute('cy', Y);
    return c;
  }
  // Every beat sends a ring out from the thumb and a pulse running both ways down the track.
  function beat(now) {
    var g = document.createElementNS(NS, 'g');
    var p = { t0: now, x: at(+input.value), strong: n % 4 === 0, g: g, wave: circle('slider-tempo__wave'), runs: [circle('slider-tempo__run'), circle('slider-tempo__run')] };
    p.wave.setAttribute('cx', p.x);
    g.appendChild(p.wave);
    p.runs.forEach(function (r) {
      r.setAttribute('r', p.strong ? 2.6 : 1.9);
      g.appendChild(r);
    });
    svg.insertBefore(g, thumb);
    pulses.push(p);
    beats.forEach(function (b, i) { b.classList.toggle('slider-tempo__beat--on', i === n % 4); });
  }
  // The thumb keeps time, with every fourth beat accented.
  function step(now) {
    var gap = 60000 / +input.value;
    if (now - last >= gap) {
      last = now - last < gap * 2 ? last + gap : now;
      n += 1;
      beat(now);
    }
    pulses = pulses.filter(function (p) {
      var a = (now - p.t0) / 1000;
      if (a > 0.7) {
        p.g.remove();
        return false;
      }
      var run = a * 260;
      p.wave.setAttribute('r', T / 2 + a * 40);
      p.wave.setAttribute('opacity', Math.max(0, 0.7 - a * 1.4));
      [p.x - run, p.x + run].forEach(function (rx, i) {
        p.runs[i].setAttribute('cx', rx);
        p.runs[i].setAttribute('opacity', rx > 2 && rx < W - 2 ? 1 - a / 0.7 : 0);
      });
      return true;
    });
    var latest = pulses[pulses.length - 1];
    var age = latest ? (now - latest.t0) / 1000 : 9;
    thumb.setAttribute('r', (T / 2) * (1 + (latest && latest.strong ? 0.38 : 0.22) * Math.exp(-age / 0.09)));
    raf = requestAnimationFrame(step);
  }
  function update() {
    var x = at(+input.value);
    fill.setAttribute('x2', x);
    thumb.setAttribute('cx', x);
    ring.setAttribute('cx', x);
    label.textContent = input.value + ' BPM';
    input.setAttribute('aria-valuetext', input.value + ' beats per minute');
  }
  // Only keeps time while on screen, and not at all under reduced motion.
  var io = new IntersectionObserver(function (entries) {
    cancelAnimationFrame(raf);
    if (entries[0].isIntersecting && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  });
  io.observe(root);
  input.addEventListener('input', update);
  return function () {
    io.disconnect();
    cancelAnimationFrame(raf);
    input.removeEventListener('input', update);
  };
}

document.querySelectorAll('.slider-tempo').forEach(initSliderTempo);
