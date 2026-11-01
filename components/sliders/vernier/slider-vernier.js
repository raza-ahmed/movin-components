function initSliderVernier(root) {
  var W = 240;
  var R = 7;
  var UNIT = (W - 2 * R) / 100;
  var TRACK = 52;
  // How far the pointer has to stray from the track (px) to drop to each speed.
  var SPEEDS = [
    { from: 0, k: 1 },
    { from: 30, k: 0.5 },
    { from: 54, k: 0.25 },
    { from: 78, k: 0.125 },
  ];
  var value = +root.getAttribute('aria-valuenow');
  var band = 0;
  var drag = null;
  var shown = root.querySelector('.slider-vernier__value');
  var outer = root.querySelector('.slider-vernier__scale > g');
  var zoom = root.querySelector('.slider-vernier__zoom');
  var inner = zoom.firstElementChild;
  var labels = root.querySelectorAll('.slider-vernier__label');
  function pos(v) { return R + v * UNIT; }
  function clamp(v) { return Math.min(100, Math.max(0, v)); }

  // The scale: a tick every half step in four sizes. The finer sizes fade in as it zooms.
  for (var i = 0; i <= 200; i++) {
    var t = i / 2;
    var l = t % 10 === 0 ? 0 : t % 5 === 0 ? 1 : t % 1 === 0 ? 2 : 3;
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', 'slider-vernier__tick slider-vernier__tick--l' + l);
    line.setAttribute('x1', pos(t));
    line.setAttribute('x2', pos(t));
    line.setAttribute('y1', 18 - [10, 7, 5, 3][l]);
    line.setAttribute('y2', 18);
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    inner.appendChild(line);
  }

  function render() {
    var x = pos(value);
    var z = drag ? band : 0;
    var r = Math.round(value * 10) / 10;
    root.style.setProperty('--slider-vernier-x', x + 'px');
    for (var k = 0; k < 4; k++) root.classList.toggle('slider-vernier--z' + k, k === z);
    root.classList.toggle('slider-vernier--held', !!drag);
    // Zoom about the thumb: move it to the origin, scale, move it back.
    outer.style.transform = 'translateX(' + x + 'px)';
    zoom.style.transform = 'scaleX(' + 1 / SPEEDS[z].k + ')';
    inner.style.transform = 'translateX(' + -x + 'px)';
    shown.textContent = r.toFixed(1);
    root.setAttribute('aria-valuenow', r);
    labels.forEach(function (el, k) {
      el.classList.toggle('slider-vernier__label--on', drag ? k === band + 1 : k === 0);
    });
  }
  function down(e) {
    if (e.button !== 0) return;
    var r = root.getBoundingClientRect();
    var px = e.clientX - r.left;
    root.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, track: r.top + TRACK };
    // A press on the thumb grabs it where it is; anywhere else jumps there first.
    if (Math.abs(px - pos(value)) > 12) value = clamp((px - R) / UNIT);
    band = 0;
    render();
  }
  function move(e) {
    if (!drag) return;
    var away = Math.abs(e.clientY - drag.track);
    band = SPEEDS.filter(function (s) { return away >= s.from; }).length - 1;
    value = clamp(value + ((e.clientX - drag.x) / UNIT) * SPEEDS[band].k);
    drag.x = e.clientX;
    render();
  }
  function up() {
    drag = null;
    render();
  }
  function onKeyDown(e) {
    var step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    var next = { ArrowRight: value + step, ArrowUp: value + step, ArrowLeft: value - step, ArrowDown: value - step, PageUp: value + 10, PageDown: value - 10, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    value = clamp(Math.round(next * 10) / 10);
    render();
  }
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', onKeyDown);
  render();
  return function () {
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('pointercancel', up);
    root.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.slider-vernier').forEach(initSliderVernier);
