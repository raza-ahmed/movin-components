function initFieldHandle(root) {
  var input = root.querySelector('.field-handle__input');
  var msg = root.querySelector('.field-handle__msg');
  var ideas = root.querySelector('.field-handle__ideas');
  if (!input || !msg || !ideas) return;
  var taken = (root.getAttribute('data-taken') || '').split(' ');
  var timer = 0;
  var ask = 0;
  var STATES = ['checking', 'ok', 'taken', 'refused'];

  // Stand-in for your API: swap the body for a fetch that resolves to true
  // when the name is taken.
  function lookup(name) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(taken.indexOf(name) !== -1);
      }, 500);
    });
  }

  function state(s, text) {
    STATES.forEach(function (k) {
      if (k !== 'refused') root.classList.toggle('field-handle--' + k, k === s);
    });
    msg.textContent = text || '';
  }

  function suggest(name) {
    ideas.textContent = '';
    if (!name) return;
    [name + '_', name + '.studio', name + 'hq']
      .filter(function (n) {
        return taken.indexOf(n) === -1 && n.length <= 20;
      })
      .forEach(function (n, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'field-handle__idea';
        b.style.setProperty('--field-handle-i', String(i));
        b.textContent = n;
        ideas.appendChild(b);
      });
  }

  function refuse() {
    root.classList.remove('field-handle--refused');
    void root.offsetWidth;
    root.classList.add('field-handle--refused');
  }

  function check() {
    var raw = input.value;
    var name = raw.toLowerCase().replace(/[^a-z0-9._]/g, '');
    if (name !== raw) {
      var at = input.selectionStart - (raw.length - name.length);
      input.value = name;
      input.setSelectionRange(at, at);
      if (name !== raw.toLowerCase()) refuse();
    }
    clearTimeout(timer);
    ask++;
    suggest('');
    if (!name) return state('', '');
    if (name.length < 3) return state('', 'At least 3 characters');
    state('checking', '');
    var mine = ask;
    timer = setTimeout(function () {
      lookup(name).then(function (isTaken) {
        if (mine !== ask) return; // they kept typing
        if (isTaken) {
          state('taken', name + ' is taken. Try one of these:');
          suggest(name);
        } else {
          state('ok', 'movin.design/' + name + ' is yours');
        }
      });
    }, 350);
  }

  function pick(e) {
    var b = e.target.closest('.field-handle__idea');
    if (!b) return;
    input.value = b.textContent;
    input.focus();
    check();
  }

  input.addEventListener('input', check);
  ideas.addEventListener('click', pick);
  return function () {
    clearTimeout(timer);
    ask++;
    input.removeEventListener('input', check);
    ideas.removeEventListener('click', pick);
  };
}

document.querySelectorAll('.field-handle').forEach(initFieldHandle);
