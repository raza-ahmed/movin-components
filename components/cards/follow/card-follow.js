function initCardFollow(root) {
  var BASE = 1284;
  var btn = root.querySelector('.card-follow__btn');
  var reels = root.querySelectorAll('.card-follow__reel');
  var sr = root.querySelector('.card-follow__sr');
  var on = false;

  function onClick() {
    on = !on;
    root.classList.toggle('card-follow--on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.lastChild.textContent = on ? 'Following' : 'Follow';
    // Each digit is a reel of 0 to 9 rolled to its digit; the comma stays put.
    var n = (BASE + (on ? 1 : 0)).toLocaleString('en-US');
    var digits = n.replace(/,/g, '');
    reels.forEach(function (reel, i) {
      reel.style.transform = 'translateY(' + -digits[i] * 18 + 'px)';
    });
    sr.textContent = n + ' ';
  }
  btn.addEventListener('click', onClick);
  return function () {
    btn.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.card-follow').forEach(initCardFollow);
