function initFieldShell(root) {
  var log = root.querySelector('.field-shell__log');
  var input = root.querySelector('.field-shell__input');
  var prompt = root.querySelector('.field-shell__prompt');
  if (!log || !input || !prompt) return;
  var COMMANDS = ['help', 'ls', 'date', 'whoami', 'echo', 'theme', 'clear'];
  var history = [];
  var at = 0;
  var ghost = null;

  function run(cmd) {
    var parts = cmd.trim().split(/\s+/);
    switch (parts[0]) {
      case 'help': return ['commands: ' + COMMANDS.join(' ')];
      case 'ls': return ['buttons/  cards/  inputs/  loaders/  toggles/'];
      case 'date': return [new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })];
      case 'whoami': return ['guest@movin.design'];
      case 'echo': return [parts.slice(1).join(' ')];
      case 'theme': return [(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') + ' (follows your system)'];
      case 'clear': return 'clear';
      default: return ['command not found: ' + parts[0]];
    }
  }
  function line(text, kind) {
    var li = document.createElement('li');
    if (kind) li.setAttribute('data-' + kind, '');
    li.textContent = text;
    log.appendChild(li);
    while (log.children.length > 7) log.firstChild.remove();
  }
  function completion() {
    var v = input.value;
    if (!v || v.indexOf(' ') >= 0) return null;
    for (var i = 0; i < COMMANDS.length; i++) if (COMMANDS[i].indexOf(v) === 0 && COMMANDS[i] !== v) return COMMANDS[i];
    return null;
  }
  function paintGhost() {
    var c = completion();
    if (ghost) ghost.remove();
    ghost = null;
    input.style.width = c ? input.value.length + 0.5 + 'ch' : '';
    input.style.flex = c ? 'none' : '';
    if (!c) return;
    ghost = document.createElement('span');
    ghost.className = 'field-shell__ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.textContent = c.slice(input.value.length);
    prompt.appendChild(ghost);
  }
  function submit() {
    var cmd = input.value.trim();
    input.value = '';
    paintGhost();
    if (!cmd) return;
    history.push(cmd);
    at = history.length;
    var out = run(cmd);
    if (out === 'clear') {
      log.textContent = '';
      return;
    }
    var err = out[0].indexOf('command not found') === 0;
    line(cmd, 'cmd');
    out.forEach(function (t) { line(t, err ? 'err' : null); });
  }
  function key(e) {
    if (e.key === 'Enter') submit();
    var c = completion();
    if (e.key === 'Tab' && c) {
      e.preventDefault();
      input.value = c + ' ';
      paintGhost();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      at = Math.max(0, Math.min(history.length, at + (e.key === 'ArrowUp' ? -1 : 1)));
      input.value = history[at] || '';
      paintGhost();
    }
  }
  function focus() { input.focus(); }
  input.addEventListener('keydown', key);
  input.addEventListener('input', paintGhost);
  root.addEventListener('click', focus);
  return function () {
    input.removeEventListener('keydown', key);
    input.removeEventListener('input', paintGhost);
    root.removeEventListener('click', focus);
  };
}

document.querySelectorAll('.field-shell').forEach(initFieldShell);
