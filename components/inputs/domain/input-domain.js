function initFieldDomain(root) {
  var input = root.querySelector('.field-domain__input');
  var mirror = root.querySelector('.field-domain__mirror');
  var box = root.querySelector('.field-domain__box');
  if (!input || !mirror || !box) return;
  var DOMAINS = ['gmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'hey.com', 'yahoo.com'];
  var VALID = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var pick = 0;
  var dir = 1;
  var choice = '';
  var ghost = '';

  function suggest() {
    var value = input.value;
    var at = value.lastIndexOf('@');
    var typed = at > 0 ? value.slice(at + 1).toLowerCase() : null;
    var matches = typed === null ? [] : DOMAINS.filter(function (d) { return d.indexOf(typed) === 0 && d !== typed; });
    var next = matches.length ? matches[((pick % matches.length) + matches.length) % matches.length] : '';
    var nextGhost = next.slice(typed ? typed.length : 0);
    // The ghost sits right after the typed text, which the mirror repeats invisibly.
    mirror.textContent = '';
    var t = document.createElement('span');
    t.className = 'field-domain__typed';
    t.textContent = value;
    mirror.appendChild(t);
    if (nextGhost) {
      var g = document.createElement('span');
      g.className = 'field-domain__ghost';
      g.style.setProperty('--from', dir * 8 + 'px');
      g.textContent = nextGhost;
      mirror.appendChild(g);
    }
    choice = next;
    ghost = nextGhost;
    var ok = box.querySelector('.field-domain__ok');
    if (VALID.test(value) && !ok) {
      box.insertAdjacentHTML('beforeend', '<svg class="field-domain__ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"></path></svg>');
    } else if (!VALID.test(value) && ok) ok.remove();
  }
  function accept() {
    input.value += ghost;
    suggest();
    var old = box.querySelector('.field-domain__sweep');
    if (old) old.remove();
    var sweep = document.createElement('span');
    sweep.className = 'field-domain__sweep';
    sweep.setAttribute('aria-hidden', 'true');
    box.appendChild(sweep);
  }
  function onInput() {
    pick = 0;
    suggest();
  }
  function key(e) {
    if (!ghost) return;
    var end = input.selectionStart === input.value.length;
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && end) {
      e.preventDefault();
      accept();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      dir = e.key === 'ArrowDown' ? 1 : -1;
      pick += dir;
      suggest();
    }
  }
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', key);
  suggest();
  return function () {
    input.removeEventListener('input', onInput);
    input.removeEventListener('keydown', key);
  };
}

document.querySelectorAll('.field-domain').forEach(initFieldDomain);
