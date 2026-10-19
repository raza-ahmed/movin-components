function initToggleFlap(root) {
  var input = root.querySelector('.toggle-flap__input');
  if (!input) return;
  var cells = Array.prototype.slice.call(root.querySelectorAll('.toggle-flap__cell'));
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var STEP = 90;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var run = 0;
  var running = [];

  function parts(cell) {
    return {
      top: cell.querySelector('.toggle-flap__half--top > span'),
      bottom: cell.querySelector('.toggle-flap__half--bottom > span'),
      leafTop: cell.querySelector('.toggle-flap__leaf--top'),
      leafBottom: cell.querySelector('.toggle-flap__leaf--bottom'),
    };
  }

  function show(cell, ch) {
    var p = parts(cell);
    p.top.textContent = p.bottom.textContent = ch;
    p.leafTop.firstElementChild.textContent = p.leafBottom.firstElementChild.textContent = ch;
  }

  // One flap: the old top half falls away, then the new bottom half drops in.
  function flap(cell, from, to) {
    var p = parts(cell);
    p.top.textContent = to;
    p.bottom.textContent = from;
    p.leafTop.firstElementChild.textContent = from;
    p.leafBottom.firstElementChild.textContent = to;
    var a = p.leafTop.animate(
      [{ transform: 'rotateX(0deg)', filter: 'brightness(1)' }, { transform: 'rotateX(-90deg)', filter: 'brightness(0.6)' }],
      { duration: STEP / 2, easing: 'ease-in', fill: 'forwards' }
    );
    var b = p.leafBottom.animate(
      [{ transform: 'rotateX(90deg)', filter: 'brightness(1.4)' }, { transform: 'rotateX(0deg)', filter: 'brightness(1)' }],
      { duration: STEP / 2, delay: STEP / 2, easing: 'ease-out', fill: 'forwards' }
    );
    running.push(a, b);
    return b.finished.then(function () {
      p.bottom.textContent = to;
      p.leafTop.firstElementChild.textContent = to;
      a.cancel();
      b.cancel();
    });
  }

  // A few random letters, then the one it lands on, each cell a beat behind.
  function spin(cell, to, index, id) {
    var from = cell.querySelector('.toggle-flap__half--top > span').textContent;
    if (from === to) return;
    var seq = [];
    for (var i = 0; i < 3 + index; i++) seq.push(LETTERS.charAt(Math.floor(Math.random() * LETTERS.length)));
    seq.push(to);
    var chain = new Promise(function (resolve) {
      setTimeout(resolve, index * 70);
    });
    seq.forEach(function (ch) {
      chain = chain.then(function () {
        if (id !== run) return;
        var current = cell.querySelector('.toggle-flap__half--top > span').textContent;
        return flap(cell, current, ch);
      });
    });
    chain.catch(function () {});
  }

  function change() {
    var word = input.checked ? 'ON ' : 'OFF';
    run++;
    running.forEach(function (a) {
      a.cancel();
    });
    running = [];
    cells.forEach(function (cell, i) {
      if (reduced.matches) show(cell, word.charAt(i));
      else {
        show(cell, cell.querySelector('.toggle-flap__half--top > span').textContent);
        spin(cell, word.charAt(i), i, run);
      }
    });
  }

  input.addEventListener('change', change);
  return function () {
    run++;
    running.forEach(function (a) {
      a.cancel();
    });
    input.removeEventListener('change', change);
  };
}

document.querySelectorAll('.toggle-flap').forEach(initToggleFlap);
