function initSliderKeys(root) {
  var KW = 16;
  var NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  var input = root.querySelector('.slider-keys__input');
  var pill = root.querySelector('.slider-keys__pill');
  var whites = root.querySelectorAll('.slider-keys__white');
  var held = false;
  function note(i) { return NOTES[i % 7] + (4 + Math.floor(i / 7)); }
  // The chosen key goes down; its neighbours dip with it, and further while the pointer is held.
  function draw() {
    var k = +input.value;
    pill.style.left = (k + 0.5) * KW + 'px';
    pill.textContent = note(k);
    input.setAttribute('aria-valuetext', note(k));
    whites.forEach(function (w, i) {
      var dip = Math.max(0, 1 - Math.abs(i - k) / 2);
      w.className = 'slider-keys__white' + (i === k ? ' slider-keys__white--on' : dip ? ' slider-keys__white--near' : '');
      w.style.transform = 'translateY(' + dip * (held && i === k ? 4.5 : 3) + 'px)';
    });
  }
  function down() {
    held = true;
    draw();
  }
  function up() {
    held = false;
    draw();
  }
  input.addEventListener('input', draw);
  input.addEventListener('pointerdown', down);
  input.addEventListener('pointerup', up);
  input.addEventListener('pointercancel', up);
  return function () {
    input.removeEventListener('input', draw);
    input.removeEventListener('pointerdown', down);
    input.removeEventListener('pointerup', up);
    input.removeEventListener('pointercancel', up);
  };
}

document.querySelectorAll('.slider-keys').forEach(initSliderKeys);
