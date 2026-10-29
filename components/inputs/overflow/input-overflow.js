function initFieldOverflow(root) {
  var LIMIT = 24;
  var input = root.querySelector('.field-overflow__input');
  var count = root.querySelector('.field-overflow__count');
  var mirror = root.querySelector('.field-overflow__mirror');
  function update() {
    var v = input.value;
    var left = LIMIT - v.length;
    var over = left < 0;
    root.toggleAttribute('data-over', over);
    input.setAttribute('aria-invalid', String(over));
    count.textContent = over ? -left + ' too many' : left;
    // Past the limit each letter is its own span, and sags a little more than the last.
    mirror.textContent = v.slice(0, LIMIT);
    Array.prototype.forEach.call(v.slice(LIMIT), function (c, k) {
      var el = document.createElement('span');
      el.className = 'field-overflow__spill';
      el.style.setProperty('--k', k + 1);
      el.textContent = c;
      mirror.appendChild(el);
    });
  }
  input.addEventListener('input', update);
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.field-overflow').forEach(initFieldOverflow);
