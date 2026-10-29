function initSliderCurl(root) {
  var input = root.querySelector('.slider-curl__input');
  var read = root.querySelector('.slider-curl__read');
  function update() {
    var v = +input.value;
    var t = (v - 0) / (100 - 0);
    root.style.setProperty('--slider-curl-v', t);
    read.innerHTML = (v < 85 ? 'Chapter one' : 'Chapter two') + ' · <b>' + v + '%</b> turned';
    input.setAttribute('aria-valuetext', 'Page ' + v + ' percent turned');
  }
  input.addEventListener('input', update);
  update();
  return function () { input.removeEventListener('input', update); };
}

document.querySelectorAll('.slider-curl').forEach(initSliderCurl);
