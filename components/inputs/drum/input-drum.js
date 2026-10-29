function initFieldDrum(root) {
  var wheels = root.querySelectorAll('.field-drum__wheel');
  var label = root.querySelector('.field-drum__label');
  if (wheels.length !== 3 || !label) return;
  var ITEM = 30;
  var values = [];
  var texts = [];

  function updateLabel() {
    label.textContent = 'Alarm · ' + texts[0][values[0]] + ':' + texts[1][values[1]] + ' ' + texts[2][values[2]];
  }

  // A 3D drum: items sit round a cylinder that turns under drag, wheel or arrow keys, then snaps to a row.
  function drum(wheel, w) {
    var cyl = wheel.querySelector('.field-drum__cyl');
    var items = wheel.querySelectorAll('.field-drum__item');
    var n = items.length;
    var loop = !wheel.classList.contains('field-drum__wheel--ampm');
    var step = loop ? 360 / n : 24;
    var radius = Math.round((ITEM / 2 / Math.tan(((step / 2) * Math.PI) / 180)) * 100) / 100;
    texts[w] = Array.prototype.map.call(items, function (it) { return it.textContent; });
    values[w] = Math.max(0, texts[w].indexOf(wheel.getAttribute('aria-valuetext')));
    var pos = values[w];
    var drag = null;
    var wheelEnd = 0;

    function clamp(p) { return loop ? p : Math.max(0, Math.min(n - 1, p)); }
    function paint(snap) {
      cyl.toggleAttribute('data-snap', snap);
      cyl.style.transform = 'translateZ(' + -radius + 'px) rotateX(' + pos * step + 'deg)';
      items.forEach(function (it, i) {
        // Nearest copy of this item to the current position, so a looping drum never shows a seam.
        var k = loop ? i + Math.round((pos - i) / n) * n : i;
        var off = Math.abs(k - pos) * step;
        it.style.transform = 'rotateX(' + -k * step + 'deg) translateZ(' + radius + 'px)';
        it.style.opacity = off > 80 ? '0' : (1 - off / 110).toFixed(3);
      });
    }
    function settle(p) {
      pos = clamp(Math.round(p));
      values[w] = ((pos % n) + n) % n;
      wheel.setAttribute('aria-valuetext', texts[w][values[w]]);
      updateLabel();
      paint(true);
    }
    function down(e) {
      wheel.setPointerCapture(e.pointerId);
      drag = { y: e.clientY, p: pos };
    }
    function move(e) {
      if (!drag) return;
      var p = drag.p - (e.clientY - drag.y) / ITEM;
      // Past the ends of a finite drum it drags with resistance.
      pos = loop ? p : p < 0 ? p * 0.3 : p > n - 1 ? n - 1 + (p - n + 1) * 0.3 : p;
      paint(false);
    }
    function up() {
      if (!drag) return;
      drag = null;
      settle(pos);
    }
    function onWheel(e) {
      e.preventDefault();
      pos = clamp(pos + e.deltaY / 60);
      paint(false);
      clearTimeout(wheelEnd);
      wheelEnd = setTimeout(function () { settle(pos); }, 120);
    }
    function key(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        settle(Math.round(pos) + (e.key === 'ArrowDown' ? 1 : -1));
      }
    }
    wheel.addEventListener('pointerdown', down);
    wheel.addEventListener('pointermove', move);
    wheel.addEventListener('pointerup', up);
    wheel.addEventListener('wheel', onWheel, { passive: false });
    wheel.addEventListener('keydown', key);
    paint(true);
    return function () {
      clearTimeout(wheelEnd);
      wheel.removeEventListener('pointerdown', down);
      wheel.removeEventListener('pointermove', move);
      wheel.removeEventListener('pointerup', up);
      wheel.removeEventListener('wheel', onWheel);
      wheel.removeEventListener('keydown', key);
    };
  }

  var cleanups = Array.prototype.map.call(wheels, drum);
  return function () { cleanups.forEach(function (c) { c(); }); };
}

document.querySelectorAll('.field-drum').forEach(initFieldDrum);
