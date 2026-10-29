function initFieldRedact(root) {
  var area = root.querySelector('.field-redact__area');
  var mirror = root.querySelector('.field-redact__mirror');
  var toggle = root.querySelector('.field-redact__toggle');
  if (!area || !mirror || !toggle) return;
  // Email addresses, then anything that looks like a phone or card number.
  var SECRET = /[\w.+-]+@[\w-]+\.[\w.]+|\+?\d[\d ().-]{6,}\d/g;
  var reveal = false;
  var seen = {};
  function render() {
    var value = area.value;
    var now = {};
    mirror.textContent = '';
    var last = 0;
    var m;
    SECRET.lastIndex = 0;
    while ((m = SECRET.exec(value))) {
      if (m.index > last) mirror.appendChild(document.createTextNode(value.slice(last, m.index)));
      var bar = document.createElement('span');
      bar.className = 'field-redact__bar';
      // A bar wipes in only when its match first appears.
      var key = m.index + m[0];
      if (seen[key]) bar.style.animation = 'none';
      now[key] = true;
      bar.textContent = m[0];
      mirror.appendChild(bar);
      last = m.index + m[0].length;
    }
    if (last < value.length) mirror.appendChild(document.createTextNode(value.slice(last)));
    seen = now;
  }
  function flip() {
    reveal = !reveal;
    root.toggleAttribute('data-reveal', reveal);
    toggle.setAttribute('aria-pressed', String(reveal));
    toggle.textContent = reveal ? 'Hide' : 'Reveal';
  }
  area.addEventListener('input', render);
  toggle.addEventListener('click', flip);
  render();
  return function () {
    area.removeEventListener('input', render);
    toggle.removeEventListener('click', flip);
  };
}

document.querySelectorAll('.field-redact').forEach(initFieldRedact);
