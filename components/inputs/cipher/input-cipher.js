function initFieldCipher(root) {
  var input = root.querySelector('.field-cipher__input');
  var mirror = root.querySelector('.field-cipher__mirror');
  var toggle = root.querySelector('.field-cipher__toggle');
  if (!input || !mirror || !toggle) return;
  var GLYPHS = '#%&@$*+=?/<>{}[]';
  var DUR = 360;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var value = input.value;
  var reveal = false;
  // When each character last started decoding; it scrambles for DUR ms from then.
  var born = value.split('').map(function () { return -Infinity; });

  function render() {
    var now = performance.now();
    var busyAny = false;
    mirror.textContent = '';
    value.split('').forEach(function (c, i) {
      var age = now - born[i];
      var busy = !still && age >= 0 && age < DUR;
      if (busy) busyAny = true;
      var s = document.createElement('span');
      s.className = 'field-cipher__ch';
      if (busy) s.setAttribute('data-busy', '');
      s.textContent = busy ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : reveal && age >= DUR ? c : '•';
      mirror.appendChild(s);
    });
    return busyAny;
  }
  function change() {
    var next = input.value;
    // Keep the timings of the characters that survived the edit; new ones start scrambling now.
    var p = 0;
    while (p < value.length && p < next.length && value[p] === next[p]) p++;
    var s = 0;
    while (s < value.length - p && s < next.length - p && value[value.length - 1 - s] === next[next.length - 1 - s]) s++;
    var now = performance.now();
    var fresh = [];
    for (var i = 0; i < next.length - p - s; i++) fresh.push(now);
    born = born.slice(0, p).concat(fresh, born.slice(born.length - s));
    value = next;
    render();
  }
  function flip() {
    var now = performance.now();
    born = born.map(function (_, i) { return now + i * 30; });
    reveal = !reveal;
    input.type = reveal ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(reveal));
    toggle.textContent = reveal ? 'Hide' : 'Show';
    render();
  }
  var timer = setInterval(render, 45);
  input.addEventListener('input', change);
  toggle.addEventListener('click', flip);
  render();
  return function () {
    clearInterval(timer);
    input.removeEventListener('input', change);
    toggle.removeEventListener('click', flip);
  };
}

document.querySelectorAll('.field-cipher').forEach(initFieldCipher);
