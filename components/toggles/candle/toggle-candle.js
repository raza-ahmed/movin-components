function initToggleCandle(root) {
  var input = root.querySelector('.toggle-candle__input');
  if (!input) return;
  var timer = 0;

  // Smoke only follows a snuff, never a page load, so it is started here.
  function change() {
    clearTimeout(timer);
    root.classList.remove('toggle-candle--snuffed');
    if (input.checked) return;
    void root.offsetWidth;
    root.classList.add('toggle-candle--snuffed');
    timer = setTimeout(function () {
      root.classList.remove('toggle-candle--snuffed');
    }, 1400);
  }

  input.addEventListener('change', change);
  return function () {
    clearTimeout(timer);
    input.removeEventListener('change', change);
  };
}

document.querySelectorAll('.toggle-candle').forEach(initToggleCandle);
