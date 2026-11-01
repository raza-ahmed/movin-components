function initCardStreak(root) {
  var BEFORE = 4;
  var btn = root.querySelector('.card-streak__dot--today');
  var num = root.querySelector('.card-streak__num');
  var done = false;

  // One class checks in: the CSS fills today from the centre, draws the tick and flares the flame.
  function onClick() {
    done = !done;
    root.classList.toggle('card-streak--done', done);
    btn.setAttribute('aria-pressed', String(done));
    // A fresh number rolls in, up when the streak grows and down when it shrinks.
    var fresh = document.createElement('span');
    fresh.className = 'card-streak__num' + (done ? '' : ' card-streak__num--down');
    fresh.textContent = BEFORE + (done ? 1 : 0);
    num.replaceWith(fresh);
    num = fresh;
  }
  btn.addEventListener('click', onClick);
  return function () {
    btn.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.card-streak').forEach(initCardStreak);
