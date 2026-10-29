function initSliderDaylight(root) {
  var input = root.querySelector('.slider-daylight__input');
  var read = root.querySelector('.slider-daylight__time');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function update() {
    var v = +input.value;
    // 06:00 to 18:00.
    var minutes = Math.round((6 + (v / 100) * 12) * 60);
    var time = pad(Math.floor(minutes / 60)) + ':' + pad(minutes % 60);
    root.style.setProperty('--slider-daylight-v', v / 100);
    read.textContent = time;
    input.setAttribute('aria-valuetext', time);
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-daylight').forEach(initSliderDaylight);
