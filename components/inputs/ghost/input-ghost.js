function initFieldGhost(root) {
  var input = root.querySelector('.field-ghost__input');
  var typed = root.querySelector('.field-ghost__typed');
  var rest = root.querySelector('.field-ghost__rest');
  var key = root.querySelector('.field-ghost__key');
  var status = root.querySelector('.field-ghost__status');
  if (!input || !typed || !rest) return;
  var domains = (root.getAttribute('data-domains') || 'gmail.com outlook.com icloud.com yahoo.com hotmail.com proton.me').split(' ');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ghost = '';
  var said = '';
  var timer = 0;

  // The ghost is the rest of the first domain that starts with what follows the @.
  function suggest() {
    var v = input.value;
    var at = v.indexOf('@');
    var atEnd = input.selectionStart === v.length && input.selectionEnd === v.length;
    ghost = '';
    if (at > 0 && at === v.lastIndexOf('@') && atEnd && document.activeElement === input) {
      var part = v.slice(at + 1).toLowerCase();
      var hit = domains.filter(function (d) {
        return d.indexOf(part) === 0 && d !== part;
      })[0];
      if (hit) ghost = hit.slice(part.length);
    }
    // Hide it rather than misplace it once the text scrolls.
    if (input.scrollLeft > 0) ghost = '';
    typed.textContent = v;
    rest.textContent = ghost;
    root.classList.toggle('field-ghost--hint', !!ghost);
    // Announce a suggestion once, not on every keystroke that keeps it.
    var domain = ghost ? v.slice(at + 1) + ghost : '';
    if (domain !== said) {
      said = domain;
      if (status) status.textContent = domain ? 'Suggestion: ' + domain + '. Press Tab to accept.' : '';
    }
  }

  function accept() {
    if (!ghost) return false;
    var full = input.value + ghost;
    root.classList.add('field-ghost--accept');
    clearTimeout(timer);
    timer = setTimeout(
      function () {
        root.classList.remove('field-ghost--accept');
        input.value = full;
        input.setSelectionRange(full.length, full.length);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        if (status) status.textContent = 'Completed ' + full;
      },
      reduce ? 0 : 140
    );
    return true;
  }

  function keydown(e) {
    if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight') {
      if (accept()) e.preventDefault();
    }
  }

  // The key hint is for pointers and touch; keep focus in the field.
  function down(e) {
    e.preventDefault();
  }
  function tap(e) {
    e.preventDefault();
    accept();
  }

  function selection() {
    if (document.activeElement === input) suggest();
  }

  input.addEventListener('input', suggest);
  input.addEventListener('focus', suggest);
  input.addEventListener('blur', suggest);
  input.addEventListener('keydown', keydown);
  document.addEventListener('selectionchange', selection);
  if (key) {
    key.addEventListener('pointerdown', down);
    key.addEventListener('click', tap);
  }
  suggest();
  return function () {
    clearTimeout(timer);
    input.removeEventListener('input', suggest);
    input.removeEventListener('focus', suggest);
    input.removeEventListener('blur', suggest);
    input.removeEventListener('keydown', keydown);
    document.removeEventListener('selectionchange', selection);
    if (key) {
      key.removeEventListener('pointerdown', down);
      key.removeEventListener('click', tap);
    }
  };
}

document.querySelectorAll('.field-ghost').forEach(initFieldGhost);
