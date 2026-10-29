function initFieldFlapboard(root) {
  var input = root.querySelector('.field-flapboard__input');
  var cells = root.querySelectorAll('.field-flapboard__cell');
  var status = root.querySelector('.field-flapboard__meta span:last-child');
  if (!input || !cells.length || !status) return;
  var ALPHA = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.';
  var N = cells.length;
  function pad(s) { return s.toUpperCase().replace(/[^A-Z0-9 .-]/g, ' ').padEnd(N, ' ').slice(0, N); }
  var shown = Array.prototype.map.call(cells, function (c) { return c.textContent === ' ' ? ' ' : c.textContent || ' '; }).join('');
  var timer = 0;
  function paint(cur, prev) {
    for (var i = 0; i < N; i++) {
      if (cur[i] === prev[i]) continue;
      // A new element per change, so the flap replays.
      var ch = document.createElement('span');
      ch.className = 'field-flapboard__ch';
      ch.textContent = cur[i] === ' ' ? ' ' : cur[i];
      cells[i].textContent = '';
      cells[i].appendChild(ch);
    }
  }
  // Every tick, each cell that isn't there yet flips one letter further round the drum.
  function run() {
    var target = pad(input.value);
    clearInterval(timer);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(target, shown);
      shown = target;
      status.textContent = 'On time';
      return;
    }
    status.textContent = shown === target ? 'On time' : 'Updating';
    timer = setInterval(function () {
      if (shown === target) {
        clearInterval(timer);
        status.textContent = 'On time';
        return;
      }
      var next = shown.split('').map(function (c, i) { return c === target[i] ? c : ALPHA[(ALPHA.indexOf(c) + 1) % ALPHA.length]; }).join('');
      paint(next, shown);
      shown = next;
    }, 45);
  }
  input.addEventListener('input', run);
  run();
  return function () {
    clearInterval(timer);
    input.removeEventListener('input', run);
  };
}

document.querySelectorAll('.field-flapboard').forEach(initFieldFlapboard);
