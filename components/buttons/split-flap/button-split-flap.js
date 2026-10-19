function initBtnSplitFlap(root) {
  var source = root.querySelector('.btn-split-flap__text');
  if (!source) return;
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var words = [source.textContent.trim(), root.getAttribute('data-alt') || ''].map(function (s) {
    return s.toUpperCase();
  });
  var len = Math.max(words[0].length, words[1].length);
  // Centre both words on the same number of tiles.
  words = words.map(function (s) {
    var pad = Math.floor((len - s.length) / 2);
    return (new Array(pad + 1).join(' ') + s + new Array(len + 1).join(' ')).slice(0, len);
  });

  function part(kind, cls) {
    var el = document.createElement('span');
    el.className = 'btn-split-flap__' + kind + ' btn-split-flap__' + kind + '--' + cls;
    var g = document.createElement('span');
    g.className = 'btn-split-flap__glyph';
    el.appendChild(g);
    return el;
  }

  var cells = [];
  for (var i = 0; i < len; i++) {
    var el = document.createElement('span');
    el.className = 'btn-split-flap__cell';
    el.setAttribute('aria-hidden', 'true');
    var top = part('half', 'top'), bottom = part('half', 'bottom'), leafTop = part('leaf', 'top'), leafBottom = part('leaf', 'bottom');
    el.append(top, bottom, leafTop, leafBottom);
    root.appendChild(el);
    var cell = { el: el, top: top.firstChild, bottom: bottom.firstChild, leafTop: leafTop, leafBottom: leafBottom, ch: words[0][i], token: 0, anims: [] };
    set(cell, cell.ch);
    cells.push(cell);
  }
  source.hidden = true;

  function set(cell, ch) {
    cell.ch = ch;
    cell.top.textContent = cell.bottom.textContent = cell.leafTop.firstChild.textContent = cell.leafBottom.firstChild.textContent = ch;
  }

  function stop(cell) {
    cell.token++;
    cell.anims.forEach(function (a) {
      a.cancel();
    });
    cell.anims = [];
    set(cell, cell.ch);
  }

  // One flap: the top leaf (old letter) falls to the hinge, then the bottom
  // leaf (new letter) drops from the hinge and bounces on its stop.
  function flip(cell, next, token, then) {
    var cur = cell.ch;
    cell.top.textContent = next;
    cell.bottom.textContent = cur;
    cell.leafTop.firstChild.textContent = cur;
    cell.leafBottom.firstChild.textContent = next;
    var a = cell.leafTop.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: 60, easing: 'ease-in', fill: 'forwards' });
    cell.anims = [a];
    a.onfinish = function () {
      if (cell.token !== token) return;
      var b = cell.leafBottom.animate(
        [
          { transform: 'rotateX(90deg)', offset: 0 },
          { transform: 'rotateX(0deg)', offset: 0.7 },
          { transform: 'rotateX(14deg)', offset: 0.85 },
          { transform: 'rotateX(0deg)', offset: 1 },
        ],
        { duration: 95, easing: 'ease-out', fill: 'forwards' }
      );
      cell.anims.push(b);
      b.onfinish = function () {
        if (cell.token !== token) return;
        a.cancel();
        b.cancel();
        cell.anims = [];
        set(cell, next);
        then();
      };
    };
  }

  function show(word) {
    cells.forEach(function (cell, i) {
      stop(cell);
      var target = word[i];
      if (cell.ch === target) return;
      if (reduce.matches) return set(cell, target);
      var token = cell.token;
      var seq = [];
      for (var n = 2 + Math.floor(Math.random() * 4); n > 0; n--) seq.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
      seq.push(target);
      var timer = setTimeout(function step() {
        if (cell.token !== token || !seq.length) return;
        flip(cell, seq.shift(), token, step);
      }, i * 45);
      cell.anims.push({ cancel: function () { clearTimeout(timer); } });
    });
  }

  function on() {
    show(words[1]);
  }
  function off() {
    if (document.activeElement === root && root.matches(':focus-visible')) return;
    show(words[0]);
  }
  root.addEventListener('mouseenter', on);
  root.addEventListener('mouseleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);

  return function () {
    root.removeEventListener('mouseenter', on);
    root.removeEventListener('mouseleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
    cells.forEach(function (cell) {
      stop(cell);
      cell.el.remove();
    });
    source.hidden = false;
  };
}

document.querySelectorAll('.btn-split-flap').forEach(initBtnSplitFlap);
