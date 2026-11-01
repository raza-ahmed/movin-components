function initCardLike(root) {
  var BASE = 1204;
  var HEART = 'M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.6 0 5.7 3.5 4.5 6.8-1.8 4.6-9.3 9.2-9.3 9.2z';
  var photo = root.querySelector('.card-like__photo');
  var btn = root.querySelector('.card-like__btn');
  var num = root.querySelector('.card-like__num');
  var liked = false;

  function set(next) {
    if (next === liked) return;
    liked = next;
    btn.setAttribute('aria-pressed', String(liked));
    // Fresh copies replay the heart's beat and the count's roll; the sparks run off aria-pressed in the CSS.
    var heart = btn.querySelector('svg');
    heart.replaceWith(heart.cloneNode(true));
    var fresh = document.createElement('span');
    fresh.className = 'card-like__num' + (liked ? '' : ' card-like__num--down');
    fresh.textContent = (BASE + (liked ? 1 : 0)).toLocaleString('en-US') + ' likes';
    num.replaceWith(fresh);
    num = fresh;
  }
  // Double-click likes (never unlikes) and pops the big heart every time.
  function onDouble() {
    set(true);
    var old = photo.querySelector('.card-like__big');
    if (old) old.remove();
    photo.insertAdjacentHTML('beforeend', '<svg class="card-like__big" viewBox="0 0 24 24"><path d="' + HEART + '" fill="currentColor"></path></svg>');
  }
  function onClick() {
    set(!liked);
  }
  photo.addEventListener('dblclick', onDouble);
  btn.addEventListener('click', onClick);
  return function () {
    photo.removeEventListener('dblclick', onDouble);
    btn.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.card-like').forEach(initCardLike);
