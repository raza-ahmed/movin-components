function initFieldAngle(root) {
  var dial = root.querySelector('.field-angle__dial');
  var hand = root.querySelector('.field-angle__hand');
  var ticks = root.querySelectorAll('.field-angle__tick');
  var num = root.querySelector('.field-angle__num input');
  var swatch = root.querySelector('.field-angle__swatch');
  if (!dial || !hand || !num || !swatch) return;
  var SNAP = 4; // degrees of pull toward every multiple of 45
  var angle = Number(dial.getAttribute('aria-valuenow')) || 0;
  // Unwrapped rotation, so the hand never spins the long way round when crossing 0.
  var turn = angle;
  var drag = false;

  function set(a) {
    var n = ((Math.round(a) % 360) + 360) % 360;
    turn += ((n - (turn % 360) + 540) % 360) - 180;
    angle = n;
    hand.style.transform = 'rotate(' + turn + 'deg)';
    ticks.forEach(function (t, i) { t.toggleAttribute('data-near', Math.abs(((i * 15 - angle + 540) % 360) - 180) < 8); });
    dial.setAttribute('aria-valuenow', String(angle));
    dial.setAttribute('aria-valuetext', angle + ' degrees');
    if (document.activeElement !== num) num.value = String(angle);
    swatch.style.background = 'linear-gradient(' + angle + 'deg, light-dark(#373a40, #f1f2f3), light-dark(#ebedf0, #232529))';
  }
  function fromPointer(e) {
    var r = dial.getBoundingClientRect();
    var deg = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    var a = (deg + 360) % 360;
    if (e.shiftKey) a = Math.round(a / 15) * 15;
    else {
      var m = Math.round(a / 45) * 45;
      if (Math.abs(a - m) < SNAP) a = m;
    }
    set(a);
  }
  function down(e) {
    dial.setPointerCapture(e.pointerId);
    drag = true;
    fromPointer(e);
  }
  function move(e) { if (drag) fromPointer(e); }
  function up() { drag = false; }
  function key(e) {
    var dir = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    set(angle + dir * (e.shiftKey ? 15 : 1));
  }
  function typed() {
    if (num.value !== '') set(Number(num.value));
  }
  dial.addEventListener('pointerdown', down);
  dial.addEventListener('pointermove', move);
  dial.addEventListener('pointerup', up);
  dial.addEventListener('keydown', key);
  num.addEventListener('input', typed);
  return function () {
    dial.removeEventListener('pointerdown', down);
    dial.removeEventListener('pointermove', move);
    dial.removeEventListener('pointerup', up);
    dial.removeEventListener('keydown', key);
    num.removeEventListener('input', typed);
  };
}

document.querySelectorAll('.field-angle').forEach(initFieldAngle);
