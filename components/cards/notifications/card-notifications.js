function initCardNotifications(root) {
  var H = 52;
  var GAP = 8;
  var btns = root.querySelectorAll('.card-notifications__btn');
  var stack = root.querySelector('.card-notifications__stack');
  var items = root.querySelectorAll('.card-notifications__item');
  var empty = root.querySelector('.card-notifications__empty');
  var open = false;
  var clear = false;
  var timer = 0;

  // Stacked, each one behind sits lower, smaller and fainter; open, they lay out as a list, a beat apart.
  function render() {
    root.classList.toggle('card-notifications--clear', clear);
    btns[0].setAttribute('aria-expanded', String(open));
    btns[0].textContent = open ? 'Show less' : 'Show all';
    btns[0].disabled = clear;
    btns[1].disabled = clear;
    stack.style.height = (open && !clear ? items.length * (H + GAP) - GAP : H + 18) + 'px';
    items.forEach(function (item, i) {
      var s = item.style;
      s.zIndex = 3 - i;
      if (clear) {
        s.transform = 'translateX(110%)';
        s.opacity = 0;
        s.transitionDelay = i * 70 + 'ms';
      } else if (open) {
        s.transform = 'translateY(' + i * (H + GAP) + 'px)';
        s.opacity = '';
        s.transitionDelay = i * 50 + 'ms';
      } else {
        s.transform = 'translateY(' + i * 9 + 'px) scale(' + (1 - i * 0.06) + ')';
        s.opacity = 1 - i * 0.3;
        s.transitionDelay = (2 - i) * 40 + 'ms';
      }
      item.setAttribute('aria-hidden', String(clear || (!open && i > 0)));
    });
    empty.textContent = clear ? 'No new notifications' : '';
  }
  function onToggle() {
    open = !open;
    render();
  }
  function onClear() {
    clear = true;
    render();
    // The demo deals them back after a moment.
    timer = setTimeout(function () {
      clear = false;
      open = false;
      render();
    }, 1800);
  }
  btns[0].addEventListener('click', onToggle);
  btns[1].addEventListener('click', onClear);
  return function () {
    clearTimeout(timer);
    btns[0].removeEventListener('click', onToggle);
    btns[1].removeEventListener('click', onClear);
  };
}

document.querySelectorAll('.card-notifications').forEach(initCardNotifications);
