function initToggleCord(root) {
  var input = root.querySelector('.toggle-cord__input');
  if (!input) return;
  var timer = 0;

  // The tug plays on every switch, on or off, and never on page load.
  function change() {
    clearTimeout(timer);
    root.classList.remove('toggle-cord--pulled');
    void root.offsetWidth;
    root.classList.add('toggle-cord--pulled');
    timer = setTimeout(function () {
      root.classList.remove('toggle-cord--pulled');
    }, 750);
  }

  input.addEventListener('change', change);
  return function () {
    clearTimeout(timer);
    input.removeEventListener('change', change);
  };
}

document.querySelectorAll('.toggle-cord').forEach(initToggleCord);
