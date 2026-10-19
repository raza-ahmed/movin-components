function initCardSwipeDeck(root) {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THROW = 70; // px past which a release throws the card
  var start = null;
  var dx = 0;
  var dy = 0;
  var busy = false;

  function cards() {
    return Array.prototype.slice.call(root.querySelectorAll('.card-swipe-deck__card'));
  }

  // DOM order is deck order; first child is on top (painted last via z-index).
  function layout() {
    var list = cards();
    list.forEach(function (c, i) {
      c.style.setProperty('--card-swipe-deck-i', String(i));
      c.style.zIndex = String(list.length - i);
      c.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });
  }

  function pose(card, x, y) {
    card.style.setProperty('--card-swipe-deck-dx', x.toFixed(1) + 'px');
    card.style.setProperty('--card-swipe-deck-dy', y.toFixed(1) + 'px');
    card.style.setProperty('--card-swipe-deck-rot', (x * 0.09).toFixed(2) + 'deg');
    card.style.setProperty('--card-swipe-deck-keep', Math.max(0, Math.min(1, x / THROW)).toFixed(2));
    card.style.setProperty('--card-swipe-deck-skip', Math.max(0, Math.min(1, -x / THROW)).toFixed(2));
  }

  function clear(card) {
    ['--card-swipe-deck-dx', '--card-swipe-deck-dy', '--card-swipe-deck-rot', '--card-swipe-deck-keep', '--card-swipe-deck-skip'].forEach(function (p) {
      card.style.removeProperty(p);
    });
  }

  // Fly off, then slip in at the back of the deck while the rest move up.
  function fling(dir) {
    var top = cards()[0];
    if (!top || busy) return;
    busy = true;
    var from = [dx, dy];
    var to = [dir * 260, dy + 40];
    var done = function () {
      clear(top);
      top.style.transition = 'none';
      root.appendChild(top);
      layout();
      void top.offsetWidth;
      top.style.transition = '';
      dx = dy = 0;
      busy = false;
    };
    if (reduce) return done();
    top.style.transition = 'none';
    var anim = top.animate(
      [
        { translate: '0 0', rotate: '0deg', opacity: 1 },
        { translate: to[0] - from[0] + 'px ' + (to[1] - from[1]) + 'px', rotate: dir * 18 + 'deg', opacity: 0 },
      ],
      { duration: 380, easing: 'cubic-bezier(0.3, 0.5, 0.4, 1)' }
    );
    anim.onfinish = done;
  }

  function down(e) {
    var top = cards()[0];
    if (busy || !top || !top.contains(e.target)) return;
    start = { x: e.clientX, y: e.clientY };
    root.setPointerCapture(e.pointerId);
    root.classList.add('card-swipe-deck--drag');
  }

  function move(e) {
    if (!start) return;
    dx = e.clientX - start.x;
    dy = (e.clientY - start.y) * 0.4;
    pose(cards()[0], dx, dy);
  }

  function up() {
    if (!start) return;
    start = null;
    root.classList.remove('card-swipe-deck--drag');
    if (Math.abs(dx) > THROW) fling(dx > 0 ? 1 : -1);
    else {
      clear(cards()[0]); // springs home on the transition
      dx = dy = 0;
    }
  }

  function key(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      var dir = e.key === 'ArrowRight' ? 1 : -1;
      dx = 0;
      dy = 0;
      pose(cards()[0], dir * 30, 0); // a nudge to show the stamp before it goes
      setTimeout(function () {
        dx = dir * 30;
        fling(dir);
      }, reduce ? 0 : 120);
    }
  }

  layout();
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up);
  root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', key);

  return function () {
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerup', up);
    root.removeEventListener('pointercancel', up);
    root.removeEventListener('keydown', key);
    cards().forEach(function (c) {
      clear(c);
      c.style.removeProperty('--card-swipe-deck-i');
      c.style.zIndex = '';
      c.removeAttribute('aria-hidden');
    });
  };
}

document.querySelectorAll('.card-swipe-deck').forEach(initCardSwipeDeck);
