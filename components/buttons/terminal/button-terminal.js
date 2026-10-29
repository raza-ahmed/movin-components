function initBtnTerminal(root) {
  var body = root.querySelector('.btn-terminal__body');
  var cmd = root.querySelector('.btn-terminal__cmd');
  var live = root.querySelector('.btn-terminal__sr');
  if (!body || !cmd || !live) return;
  var CMD = 'deploy --prod';
  var BAR = 12;
  var caret = root.querySelector('.btn-terminal__caret');
  var busy = false;
  var timers = [];
  var out = null;

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function line(cls, s) {
    var el = document.createElement('span');
    el.className = cls;
    el.textContent = s;
    body.appendChild(el);
    return el;
  }

  function run() {
    if (busy) return;
    busy = true;
    live.textContent = '';
    cmd.textContent = '';
    var t = 0;
    for (var i = 1; i <= CMD.length; i++) {
      (function (n) { at((t += 45), function () { cmd.textContent = CMD.slice(0, n); }); })(i);
    }
    t += 200;
    for (var j = 0; j <= BAR; j++) {
      (function (n) {
        at((t += 90 + (n % 4 === 0 ? 120 : 0)), function () {
          if (caret) caret.remove();
          out = out || line('btn-terminal__out', '');
          out.textContent = '[' + '#'.repeat(n) + '.'.repeat(BAR - n) + '] ' + String(Math.round((n / BAR) * 100)).padStart(3) + '%';
        });
      })(j);
    }
    at((t += 250), function () {
      line('btn-terminal__out btn-terminal__out--ok', '✓ live in 1.2s');
      live.textContent = 'Deployed';
    });
    at((t += 2200), function () {
      body.querySelectorAll('.btn-terminal__out').forEach(function (el) { el.remove(); });
      out = null;
      cmd.textContent = 'deploy';
      if (caret) cmd.parentNode.appendChild(caret);
      live.textContent = '';
      busy = false;
    });
  }
  root.addEventListener('click', run);

  return function () {
    timers.forEach(clearTimeout);
    root.removeEventListener('click', run);
  };
}

document.querySelectorAll('.btn-terminal').forEach(initBtnTerminal);
