function initFieldTelegraph(root) {
  var out = root.querySelector('.field-telegraph__out');
  var tape = root.querySelector('.field-telegraph__tape');
  var key = root.querySelector('.field-telegraph__key');
  var lamp = root.querySelector('.field-telegraph__lamp');
  if (!out || !tape || !key || !lamp) return;
  var MORSE = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
  };
  var DASH = 220; // a press longer than this is a dash
  var LETTER_GAP = 650;
  var WORD_GAP = 1500;
  var text = out.value.replace(/_$/, '');
  var code = '';
  var pressed = 0;
  var timers = [];

  function show() { out.value = text + (code ? '_' : ''); }
  function sym(k) {
    var s = document.createElement('span');
    s.className = 'field-telegraph__sym';
    s.setAttribute('data-k', k);
    tape.appendChild(s);
    while (tape.children.length > 22) tape.firstChild.remove();
  }
  function press() {
    if (pressed) return;
    timers.forEach(clearTimeout);
    pressed = performance.now();
    key.setAttribute('data-down', '');
    lamp.setAttribute('data-on', '');
  }
  function lift() {
    if (!pressed) return;
    var held = performance.now() - pressed;
    pressed = 0;
    key.removeAttribute('data-down');
    lamp.removeAttribute('data-on');
    var k = held > DASH ? '-' : '.';
    code += k;
    sym(k);
    show();
    // A pause ends the letter; a longer one ends the word.
    timers = [
      setTimeout(function () {
        text = (text + (MORSE[code] || '?')).slice(-24);
        code = '';
        sym('/');
        show();
      }, LETTER_GAP),
      setTimeout(function () {
        if (text.slice(-1) !== ' ') text += ' ';
        show();
      }, WORD_GAP),
    ];
  }
  function down(e) {
    key.setPointerCapture(e.pointerId);
    press();
  }
  function keydown(e) {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      press();
    }
  }
  function keyup(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      lift();
    }
  }
  function typed() { text = out.value.toUpperCase().replace(/_$/, ''); }
  key.addEventListener('pointerdown', down);
  key.addEventListener('pointerup', lift);
  key.addEventListener('pointercancel', lift);
  key.addEventListener('keydown', keydown);
  key.addEventListener('keyup', keyup);
  out.addEventListener('input', typed);
  return function () {
    timers.forEach(clearTimeout);
    key.removeEventListener('pointerdown', down);
    key.removeEventListener('pointerup', lift);
    key.removeEventListener('pointercancel', lift);
    key.removeEventListener('keydown', keydown);
    key.removeEventListener('keyup', keyup);
    out.removeEventListener('input', typed);
  };
}

document.querySelectorAll('.field-telegraph').forEach(initFieldTelegraph);
