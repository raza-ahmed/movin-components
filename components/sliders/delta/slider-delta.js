function initSliderDelta(root) {
  var W = 240;
  var T = 18;
  var MAX = 1000;
  var input = root.querySelector('.slider-delta__input');
  var fill = root.querySelector('.slider-delta__fill');
  var thumb = root.querySelector('.slider-delta__thumb');
  var label = root.querySelector('.slider-delta__value b');
  // The change, the ghost, the bracket and the signed label only exist while a change is in progress.
  function part(name) {
    var el = document.createElement('span');
    el.className = 'slider-delta__' + name;
    el.setAttribute('aria-hidden', 'true');
    el.hidden = true;
    root.insertBefore(el, thumb);
    return el;
  }
  var change = part('change');
  var ghost = part('ghost');
  var bracket = part('bracket');
  var tag = part('label');
  var start = null;
  var settling = false;
  var keyTimer = 0;
  var doneTimer = 0;
  function at(n) { return T / 2 + (n / MAX) * (W - T); }
  function draw() {
    var v = +input.value;
    var x = at(v);
    var s = start === null ? v : start;
    // Settling, the ghost and the bracket collapse onto the thumb.
    var gx = settling ? x : at(s);
    var lo = Math.min(gx, x);
    var diff = v - s;
    var shown = start !== null;
    root.classList.toggle('slider-delta--settle', settling);
    fill.style.width = (settling || !shown ? x : Math.min(x, at(s))) + 'px';
    change.hidden = ghost.hidden = bracket.hidden = !shown;
    tag.hidden = !shown || diff === 0;
    change.className = 'slider-delta__change slider-delta__change--' + (diff >= 0 ? 'up' : 'down');
    change.style.left = bracket.style.left = lo + 'px';
    change.style.width = bracket.style.width = Math.abs(x - gx) + 'px';
    ghost.style.left = gx + 'px';
    tag.style.left = (gx + x) / 2 + 'px';
    tag.textContent = (diff > 0 ? '+' : diff < 0 ? '−' : '') + '$' + Math.abs(diff);
    thumb.style.left = x + 'px';
    label.textContent = '$' + v;
    input.setAttribute('aria-valuetext', '$' + v);
  }
  // A change starts when you grab the thumb (or press a key) and ends when you let go (or stop pressing).
  function begin() {
    clearTimeout(doneTimer);
    if (start === null || settling) start = +input.value;
    settling = false;
    draw();
  }
  function commit() {
    if (start === null) return;
    settling = true;
    draw();
    doneTimer = setTimeout(function () {
      start = null;
      settling = false;
      draw();
    }, 460);
  }
  function keydown(e) {
    if (!/^(Arrow|Page|Home|End)/.test(e.key)) return;
    clearTimeout(keyTimer);
    begin();
  }
  function keyup() {
    clearTimeout(keyTimer);
    keyTimer = setTimeout(commit, 900);
  }
  input.addEventListener('pointerdown', begin);
  input.addEventListener('pointerup', commit);
  input.addEventListener('pointercancel', commit);
  input.addEventListener('keydown', keydown);
  input.addEventListener('keyup', keyup);
  input.addEventListener('input', draw);
  return function () {
    clearTimeout(keyTimer);
    clearTimeout(doneTimer);
    input.removeEventListener('pointerdown', begin);
    input.removeEventListener('pointerup', commit);
    input.removeEventListener('pointercancel', commit);
    input.removeEventListener('keydown', keydown);
    input.removeEventListener('keyup', keyup);
    input.removeEventListener('input', draw);
  };
}

document.querySelectorAll('.slider-delta').forEach(initSliderDelta);
