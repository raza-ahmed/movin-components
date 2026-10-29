function initToggleTerminal(root) {
  var input = root.querySelector('input');
  var cmd = root.querySelector('.toggle-terminal__cmd');
  var out = root.querySelector('.toggle-terminal__out');
  if (!input || !cmd || !out) return;
  var CMD = { on: 'wifi --on', off: 'wifi --off' };
  var OUT = { on: '● connected', off: '○ disconnected' };
  var timer = 0;
  function caret() {
    var c = document.createElement('span');
    c.className = 'toggle-terminal__caret';
    return c;
  }
  function render(text, typed, on) {
    cmd.textContent = '';
    var prompt = document.createElement('b');
    prompt.textContent = '$ ';
    cmd.appendChild(prompt);
    cmd.appendChild(document.createTextNode(text.slice(0, typed)));
    var done = typed >= text.length;
    if (!done) cmd.appendChild(caret());
    out.textContent = done ? (on ? OUT.on : OUT.off) : '';
    if (done) out.appendChild(caret());
    out.classList.toggle('toggle-terminal__out--on', on);
  }
  // Each change retypes the command, then prints its result.
  function change() {
    var on = input.checked;
    var text = on ? CMD.on : CMD.off;
    clearInterval(timer);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return render(text, text.length, on);
    var n = 0;
    render(text, 0, on);
    timer = setInterval(function () {
      n += 1;
      render(text, n, on);
      if (n >= text.length) clearInterval(timer);
    }, 45);
  }
  input.addEventListener('change', change);
  return function () {
    clearInterval(timer);
    input.removeEventListener('change', change);
  };
}

document.querySelectorAll('.toggle-terminal').forEach(initToggleTerminal);
