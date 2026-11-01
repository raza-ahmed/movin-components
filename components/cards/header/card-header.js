function initCardHeader(root) {
  var scroll = root.querySelector('.card-header__scroll');
  var cover = root.querySelector('.card-header__cover');
  var avatar = root.querySelector('.card-header__avatar');
  var bar = root.querySelector('.card-header__bar');

  // Collapse over the first 70px of scroll: the cover shortens, the avatar shrinks up into the bar and the name fades in beside it.
  function onScroll() {
    var p = Math.min(1, scroll.scrollTop / 70);
    var name = Math.max(0, (p - 0.6) / 0.4);
    cover.style.height = 84 - 44 * p + 'px';
    avatar.style.transform = 'translate(' + (14 - 4 * p) + 'px, ' + (58 - 51 * p) + 'px) scale(' + (1 - 0.5 * p) + ')';
    bar.style.opacity = name;
    bar.style.transform = 'translateY(' + (1 - name) * 6 + 'px)';
  }
  scroll.addEventListener('scroll', onScroll, { passive: true });
  return function () {
    scroll.removeEventListener('scroll', onScroll);
  };
}

document.querySelectorAll('.card-header').forEach(initCardHeader);
