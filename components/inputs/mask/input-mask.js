function initFieldMask(root) {
  var input = root.querySelector('.field-mask__input');
  var mirror = root.querySelector('.field-mask__mirror');
  var box = root.querySelector('.field-mask__box');
  if (!input || !mirror || !box) return;
  var TEMPLATE = '+1 (___) ___-____';
  var SLOTS = [];
  TEMPLATE.split('').forEach(function (c, i) { if (c === '_') SLOTS.push(i); });
  // The template filled with the digits, cut after the last digit placed.
  function format(digits) {
    if (!digits) return '';
    var out = TEMPLATE.split('');
    digits.split('').forEach(function (d, i) { out[SLOTS[i]] = d; });
    return out.slice(0, SLOTS[digits.length - 1] + 1).join('');
  }
  var digits = input.value.replace(/^\+1/, '').replace(/\D/g, '');
  var shown = format(digits);

  function render(prev) {
    mirror.textContent = '';
    TEMPLATE.split('').forEach(function (c, i) {
      var s = document.createElement('span');
      if (i < shown.length) {
        s.className = 'field-mask__fill';
        // Only a digit that was just placed drops in.
        if (SLOTS.indexOf(i) >= 0 && prev[i] !== shown[i]) s.setAttribute('data-digit', '');
        s.textContent = shown[i];
      } else {
        s.className = 'field-mask__slot';
        s.textContent = c;
      }
      mirror.appendChild(s);
    });
    var ok = box.querySelector('.field-mask__ok');
    var done = digits.length === SLOTS.length;
    if (done && !ok) {
      box.insertAdjacentHTML('beforeend', '<svg class="field-mask__ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"></path></svg>');
    } else if (!done && ok) ok.remove();
  }
  function change() {
    var raw = input.value.indexOf('+1') === 0 ? input.value.slice(2) : input.value;
    var next = raw.replace(/\D/g, '').slice(0, SLOTS.length);
    // Backspace over a bracket or dash removes the digit before it.
    if (next === digits && input.value.length < shown.length) next = next.slice(0, -1);
    var prev = shown;
    digits = next;
    shown = format(digits);
    input.value = shown;
    render(prev);
  }
  input.addEventListener('input', change);
  return function () { input.removeEventListener('input', change); };
}

document.querySelectorAll('.field-mask').forEach(initFieldMask);
