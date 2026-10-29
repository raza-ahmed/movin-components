function initSliderSpeedo(root) {
  var input = root.querySelector('.slider-speedo__input');
  var arc = root.querySelector('.slider-speedo__arc');
  var read = root.querySelector('.slider-speedo__speed');
  function update() {
    var v = +input.value;
    var kmh = Math.round((v / 100) * 240);
    root.style.setProperty('--slider-speedo-v', v / 100);
    arc.style.strokeDashoffset = 100 - v;
    read.textContent = kmh;
    input.setAttribute('aria-valuetext', kmh + ' kilometres per hour');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-speedo').forEach(initSliderSpeedo);
