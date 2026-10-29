function initCardWeather(root) {
  var temp = root.querySelector('.card-weather__temp');
  var cond = root.querySelector('.card-weather__cond');
  if (!temp || !cond) return;
  function set(storm) {
    root.toggleAttribute('data-storm', storm);
    temp.textContent = storm ? '14°' : '17°';
    cond.textContent = storm ? 'Thunderstorm' : 'Light rain';
    root.setAttribute('aria-label', 'Lisbon, ' + (storm ? '14 degrees, thunderstorm' : '17 degrees, light rain'));
  }
  function on() { set(true); }
  function off() { set(false); }
  root.addEventListener('pointerenter', on);
  root.addEventListener('pointerleave', off);
  root.addEventListener('focus', on);
  root.addEventListener('blur', off);
  return function () {
    root.removeEventListener('pointerenter', on);
    root.removeEventListener('pointerleave', off);
    root.removeEventListener('focus', on);
    root.removeEventListener('blur', off);
  };
}

document.querySelectorAll('.card-weather').forEach(initCardWeather);
