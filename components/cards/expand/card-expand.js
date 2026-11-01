function initCardExpand(root) {
  var toggle = root.querySelector('.card-expand__toggle');
  var body = root.querySelector('.card-expand__body');
  var title = root.querySelector('.card-expand__title').textContent;
  // One class opens it; the CSS moves the art, title and body between their two layouts.
  function onClick() {
    var open = root.classList.toggle('card-expand--open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', (open ? 'Close ' : 'Open ') + title);
    body.setAttribute('aria-hidden', String(!open));
  }
  toggle.addEventListener('click', onClick);
  return function () {
    toggle.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.card-expand').forEach(initCardExpand);
