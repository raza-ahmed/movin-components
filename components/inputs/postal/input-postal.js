function initFieldPostal(root) {
  var N = 6;
  var input = root.querySelector('.field-postal__input');
  var row = root.querySelector('.field-postal__row');
  var stamps = root.querySelectorAll('.field-postal__stamp');
  var FRANK = '<path d="M0 12C20 6 40 18 60 12S100 6 120 12S160 18 180 12S220 6 260 12" pathLength="1"></path><path d="M0 22C20 16 40 28 60 22S100 16 120 22S160 28 180 22S220 16 260 22" pathLength="1"></path>';
  function update() {
    var v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, N);
    input.value = v;
    stamps.forEach(function (stamp, i) {
      stamp.toggleAttribute('data-next', i === v.length);
      var ch = stamp.querySelector('.field-postal__ch');
      if ((ch ? ch.textContent : '') === (v[i] || '')) return;
      // A new character is a new element, so it is stamped down from the start.
      if (ch) ch.remove();
      if (!v[i]) return;
      ch = document.createElement('span');
      ch.className = 'field-postal__ch';
      ch.style.setProperty('--r', ((i * 7) % 5) - 2 + 'deg');
      ch.textContent = v[i];
      stamp.appendChild(ch);
    });
    // All six in: the wavy franking lines are drawn across the row.
    var frank = row.querySelector('.field-postal__frank');
    if (v.length === N && !frank) {
      frank = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      frank.setAttribute('class', 'field-postal__frank');
      frank.setAttribute('viewBox', '0 0 260 34');
      frank.setAttribute('preserveAspectRatio', 'none');
      frank.setAttribute('aria-hidden', 'true');
      frank.innerHTML = FRANK;
      row.insertBefore(frank, input);
    } else if (v.length < N && frank) frank.remove();
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.field-postal').forEach(initFieldPostal);
