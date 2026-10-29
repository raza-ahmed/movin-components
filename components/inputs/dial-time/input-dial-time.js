function initFieldDialTime(root) {
  var input = root.querySelector('.field-dial-time__input');
  var clock = root.querySelector('.field-dial-time__clock');
  var part = root.querySelector('.field-dial-time__part');
  // "930" → "09:30", "1745" → "17:45": digits only, the colon goes in by itself.
  function mask(raw) {
    var d = raw.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + ':' + d.slice(2) : d;
  }
  function update() {
    input.value = mask(input.value);
    var m = input.value.match(/^(\d{2}):(\d{2})$/);
    var h = m ? +m[1] : 10;
    var min = m ? +m[2] : 10;
    var valid = !m || (h < 24 && min < 60);
    var ok = m && valid;
    var name = !ok ? 'Type a 24-hour time' : h < 5 ? 'Small hours' : h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : h < 21 ? 'Evening' : 'Night';
    clock.style.setProperty('--h', ((h % 12) + min / 60) * 30 + 'deg');
    clock.style.setProperty('--m', min * 6 + 'deg');
    input.setAttribute('aria-invalid', String(!valid));
    part.textContent = valid ? name : 'That time does not exist';
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.field-dial-time').forEach(initFieldDialTime);
