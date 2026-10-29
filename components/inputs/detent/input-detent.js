function initFieldDetent(root) {
  var rail = root.querySelector('.field-detent__rail');
  var nameEl = root.querySelector('.field-detent__name');
  var thumb = root.querySelector('.field-detent__thumb');
  var fill = root.querySelector('.field-detent__fill');
  var stops = root.querySelectorAll('.field-detent__stop');
  var ticks = root.querySelectorAll('.field-detent__ticks span');
  if (!rail || !nameEl || !thumb || !fill || !stops.length) return;
  var NAMES = ['Extra small', 'Small', 'Medium', 'Large', 'Extra large'];
  var LAST = stops.length - 1;
  var index = Number(rail.getAttribute('aria-valuenow')) || 0;
  var drag = null;
  var clicks = 0;

  // Sticky near each stop, quick between them: the thumb drags against a detent.
  function magnet(raw) {
    var s = raw * LAST;
    var n = Math.round(s);
    var d = s - n;
    return (n + (Math.sign(d) * Math.pow(Math.abs(d) * 2, 2.4)) / 2) / LAST;
  }
  function paint() {
    var pos = drag === null ? index / LAST : magnet(drag);
    thumb.style.left = pos * 100 + '%';
    fill.style.width = pos * 100 + '%';
    rail.toggleAttribute('data-drag', drag !== null);
  }
  function set(i) {
    var n = Math.max(0, Math.min(LAST, i));
    if (n !== index) {
      index = n;
      clicks += 1;
      // The name flips in and the new stop rings.
      var name = nameEl.cloneNode(false);
      name.textContent = NAMES[index];
      nameEl.replaceWith(name);
      nameEl = name;
      root.querySelectorAll('.field-detent__ring').forEach(function (r) { r.remove(); });
      var ring = document.createElement('span');
      ring.className = 'field-detent__ring';
      stops[index].appendChild(ring);
    }
    stops.forEach(function (s, k) { s.toggleAttribute('data-on', k <= index); });
    ticks.forEach(function (t, k) { t.toggleAttribute('data-on', k === index); });
    rail.setAttribute('aria-valuenow', String(index));
    rail.setAttribute('aria-valuetext', NAMES[index]);
    paint();
  }
  function at(clientX) {
    var r = rail.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  }
  function down(e) {
    rail.setPointerCapture(e.pointerId);
    drag = at(e.clientX);
    set(Math.round(drag * LAST));
  }
  function move(e) {
    if (drag === null) return;
    drag = at(e.clientX);
    set(Math.round(drag * LAST));
  }
  function up() {
    drag = null;
    paint();
  }
  function key(e) {
    var step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (step) {
      e.preventDefault();
      set(index + step);
    }
    if (e.key === 'Home') set(0);
    if (e.key === 'End') set(LAST);
  }
  rail.addEventListener('pointerdown', down);
  rail.addEventListener('pointermove', move);
  rail.addEventListener('pointerup', up);
  rail.addEventListener('keydown', key);
  return function () {
    rail.removeEventListener('pointerdown', down);
    rail.removeEventListener('pointermove', move);
    rail.removeEventListener('pointerup', up);
    rail.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.field-detent').forEach(initFieldDetent);
