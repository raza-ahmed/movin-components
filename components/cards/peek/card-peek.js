function initCardPeek(root) {
  var HOLD = 450;
  var body = root.querySelector('.card-peek__body');
  var tiles = root.querySelectorAll('.card-peek__tile');
  var preview = null;
  var timer = 0;

  function name(i) {
    return tiles[i].getAttribute('aria-label').replace('Peek at ', '');
  }
  // The preview grows out of the tile it belongs to.
  function open(i) {
    close();
    var img = !!tiles[i].querySelector('.card-peek__icon--img');
    preview = document.createElement('div');
    preview.className = 'card-peek__preview';
    preview.setAttribute('role', 'dialog');
    preview.setAttribute('aria-label', 'Preview of ' + name(i));
    preview.style.transformOrigin = 14 + i * 74 + 32 - 25 + 'px ' + (72 + 36 - 30) + 'px';
    var b = document.createElement('b');
    b.textContent = name(i);
    preview.appendChild(b);
    (img ? [null] : [92, 100, 78, 96, 64, 88]).forEach(function (w) {
      var line = document.createElement('div');
      line.className = img ? 'card-peek__pic' : 'card-peek__line';
      if (w) line.style.width = w + '%';
      preview.appendChild(line);
    });
    root.appendChild(preview);
    root.classList.add('card-peek--open');
    body.setAttribute('aria-hidden', 'true');
  }
  function close() {
    if (preview) preview.remove();
    preview = null;
    root.classList.remove('card-peek--open');
    body.setAttribute('aria-hidden', 'false');
  }
  // While held, a ring fills round the tile (CSS); the peek opens when it closes.
  function onDown(e) {
    var i = Array.prototype.indexOf.call(tiles, e.currentTarget);
    e.currentTarget.classList.add('card-peek__tile--hold');
    clearTimeout(timer);
    timer = setTimeout(open, HOLD, i);
  }
  function release() {
    clearTimeout(timer);
    tiles.forEach(function (t) {
      t.classList.remove('card-peek__tile--hold');
    });
    close();
  }
  function onKeyDown(e) {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      open(Array.prototype.indexOf.call(tiles, e.currentTarget));
    }
    if (e.key === 'Escape') release();
  }
  function onKeyUp(e) {
    if (e.key === ' ' || e.key === 'Enter') release();
  }
  function onMenu(e) {
    e.preventDefault();
  }
  tiles.forEach(function (t) {
    t.addEventListener('pointerdown', onDown);
    t.addEventListener('pointerup', release);
    t.addEventListener('pointerleave', release);
    t.addEventListener('pointercancel', release);
    t.addEventListener('contextmenu', onMenu);
    t.addEventListener('keydown', onKeyDown);
    t.addEventListener('keyup', onKeyUp);
  });
  return function () {
    clearTimeout(timer);
    tiles.forEach(function (t) {
      t.removeEventListener('pointerdown', onDown);
      t.removeEventListener('pointerup', release);
      t.removeEventListener('pointerleave', release);
      t.removeEventListener('pointercancel', release);
      t.removeEventListener('contextmenu', onMenu);
      t.removeEventListener('keydown', onKeyDown);
      t.removeEventListener('keyup', onKeyUp);
    });
  };
}

document.querySelectorAll('.card-peek').forEach(initCardPeek);
