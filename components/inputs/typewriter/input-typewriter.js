function initFieldTypewriter(root) {
  var input = root.querySelector('.field-typewriter__input');
  var line = root.querySelector('.field-typewriter__line');
  var paper = root.querySelector('.field-typewriter__paper');
  var count = root.querySelector('.field-typewriter__count');
  if (!input || !line || !paper || !count) return;
  // Each strike lands with its own slight tilt and ink density, like real type.
  function tilt(i) { return (Math.sin(i * 12.9898) * 43758.5453) % 1; }
  function ch(c, i) {
    var s = document.createElement('span');
    s.className = 'field-typewriter__ch';
    s.style.setProperty('--r', (tilt(i) * 3).toFixed(1) + 'deg');
    s.style.setProperty('--ink', (0.78 + Math.abs(tilt(i + 7)) * 0.22).toFixed(2));
    s.textContent = c;
    return s;
  }
  function update() {
    var value = input.value;
    var n = value.length;
    // Keep the characters already on the paper; strike only the new ones.
    var spans = line.children;
    while (spans.length > n) line.lastChild.remove();
    for (var i = 0; i < n; i++) {
      if (spans[i] && spans[i].textContent === value[i]) continue;
      var s = ch(value[i], i);
      if (spans[i]) spans[i].replaceWith(s);
      else line.appendChild(s);
    }
    line.style.transform = 'translateX(' + -n + 'ch)';
    count.textContent = n + ' / 120';
    var guide = paper.querySelector('.field-typewriter__guide');
    var fresh = guide.cloneNode(false);
    if (n > 0) fresh.setAttribute('data-hit', '');
    guide.replaceWith(fresh);
    if (n > 0 && n % 20 === 0) {
      var ding = document.createElement('span');
      ding.className = 'field-typewriter__ding';
      ding.setAttribute('aria-hidden', 'true');
      ding.textContent = 'ding';
      ding.addEventListener('animationend', function () { ding.remove(); });
      paper.appendChild(ding);
    }
  }
  // The carriage only ever types at the end, so keep the caret there.
  function toEnd() { input.setSelectionRange(input.value.length, input.value.length); }
  input.addEventListener('input', update);
  input.addEventListener('select', toEnd);
  input.addEventListener('click', toEnd);
  return function () {
    input.removeEventListener('input', update);
    input.removeEventListener('select', toEnd);
    input.removeEventListener('click', toEnd);
  };
}

document.querySelectorAll('.field-typewriter').forEach(initFieldTypewriter);
