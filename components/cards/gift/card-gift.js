function initCardGift(root) {
  var box = root.querySelector('.card-gift__open');
  var again = root.querySelector('.card-gift__again');
  var sub = root.querySelector('.card-gift__sub');

  // One class opens it; the CSS unties the bow, tips the lid off and raises the card, each a beat after the last.
  function set(open) {
    root.classList.toggle('card-gift--open', open);
    box.disabled = open;
    box.setAttribute('aria-label', open ? 'Gift opened' : 'Open the gift');
    again.tabIndex = open ? 0 : -1;
    sub.textContent = open ? 'Code MOVE-7Q2X, worth $25' : 'Tap the box to open it';
  }
  function onOpen() {
    set(true);
  }
  function onAgain() {
    set(false);
  }
  box.addEventListener('click', onOpen);
  again.addEventListener('click', onAgain);
  return function () {
    box.removeEventListener('click', onOpen);
    again.removeEventListener('click', onAgain);
  };
}

document.querySelectorAll('.card-gift').forEach(initCardGift);
