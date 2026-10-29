function initFieldQuery(root) {
  var input = root.querySelector('.field-query__input');
  var mirror = root.querySelector('.field-query__mirror');
  if (!input || !mirror) return;
  var KEYS = {
    'tag:': { hint: 'topic', values: ['motion', 'loader', 'button', '3d', 'scroll'] },
    'by:': { hint: 'creator', values: ['raza', 'studio', 'anon'] },
    'is:': { hint: 'state', values: ['saved', 'new', 'pick'] },
    'type:': { hint: 'kind', values: ['clip', 'component', 'shader'] },
  };
  var KEY_RE = /^(-?)(tag|by|is|type):(\S*)$/;
  var active = 0;
  var options = [];
  var menu = null;
  var known = {};
  // Suggestions show only while the field is focused, so the field rests minimal.
  var focused = false;

  function token(text, start) {
    var m = KEY_RE.exec(text);
    if (m) {
      var pill = document.createElement('span');
      pill.className = 'field-query__pill';
      // Only a pill that just appeared flashes.
      if (known[start + m[2]]) pill.style.animation = 'none';
      known[start + m[2]] = true;
      pill.innerHTML = '<span class="field-query__key"></span><span class="field-query__val"></span>';
      pill.firstChild.textContent = m[1] + m[2] + ':';
      pill.lastChild.textContent = m[3];
      return pill;
    }
    if (/^-\S+/.test(text) || /^"/.test(text)) {
      var s = document.createElement('span');
      s.className = /^"/.test(text) ? 'field-query__phrase' : 'field-query__not';
      s.textContent = text;
      return s;
    }
    return document.createTextNode(text);
  }
  function render() {
    var value = input.value;
    // One inline run: whitespace-only text would be dropped inside the flex mirror.
    var run = document.createElement('span');
    var at = 0;
    var seen = {};
    value.split(/(\s+)/).forEach(function (t) {
      var m = KEY_RE.exec(t);
      if (m) seen[at + m[2]] = true;
      run.appendChild(token(t, at));
      at += t.length;
    });
    Object.keys(known).forEach(function (k) { if (!seen[k]) delete known[k]; });
    mirror.textContent = '';
    mirror.appendChild(run);
    suggest();
  }
  function suggest() {
    var value = input.value;
    var last = value.split(/\s/).pop() || '';
    var km = KEY_RE.exec(last);
    options = km
      ? KEYS[km[2] + ':'].values.filter(function (v) { return v.indexOf(km[3]) === 0 && v !== km[3]; }).map(function (v) {
          return { insert: km[1] + km[2] + ':' + v + ' ', label: v, hint: km[2] };
        })
      : /^-?[a-z]+$/.test(last)
        ? Object.keys(KEYS).filter(function (k) { return k.indexOf(last.replace(/^-/, '')) === 0; }).map(function (k) {
            return { insert: (last.charAt(0) === '-' ? '-' : '') + k, label: k, hint: KEYS[k].hint };
          })
        : [];
    if (menu) menu.remove();
    menu = null;
    if (!focused) options = [];
    input.setAttribute('aria-expanded', String(options.length > 0));
    if (!options.length) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    menu = document.createElement('ul');
    menu.id = 'field-query-menu';
    menu.className = 'field-query__menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', 'Suggestions');
    options.forEach(function (o, i) {
      var li = document.createElement('li');
      li.id = 'field-query-opt-' + i;
      li.className = 'field-query__opt';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === active % options.length));
      li.textContent = o.label;
      var hint = document.createElement('span');
      hint.textContent = o.hint;
      li.appendChild(hint);
      li.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        pick(o);
      });
      menu.appendChild(li);
    });
    input.setAttribute('aria-activedescendant', 'field-query-opt-' + (active % options.length));
    root.appendChild(menu);
  }
  function pick(o) {
    var value = input.value;
    var last = value.split(/\s/).pop() || '';
    input.value = value.slice(0, value.length - last.length) + o.insert;
    active = 0;
    render();
  }
  function onInput() {
    active = 0;
    render();
  }
  function key(e) {
    if (!options.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length;
      suggest();
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      pick(options[active % options.length]);
    }
  }
  function onFocus() {
    focused = true;
    suggest();
  }
  function onBlur() {
    focused = false;
    suggest();
  }
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', key);
  input.addEventListener('focus', onFocus);
  input.addEventListener('blur', onBlur);
  render();
  return function () {
    if (menu) menu.remove();
    input.removeEventListener('input', onInput);
    input.removeEventListener('keydown', key);
    input.removeEventListener('focus', onFocus);
    input.removeEventListener('blur', onBlur);
  };
}

document.querySelectorAll('.field-query').forEach(initFieldQuery);
