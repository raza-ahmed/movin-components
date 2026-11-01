function initCardUpload(root) {
  var zone = root.querySelector('.card-upload__zone');
  var input = root.querySelector('.card-upload__input');
  var list = root.querySelector('.card-upload__rows');
  var TICK =
    '<svg class="card-upload__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Uploaded">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"></path></svg>';
  var frames = [];

  // There is no server here: the progress is simulated, quick at first and slowing towards the end.
  function add(file) {
    var row = document.createElement('li');
    row.className = 'card-upload__row';
    row.innerHTML =
      '<span class="card-upload__doc" aria-hidden="true"></span><span class="card-upload__name"></span>' +
      '<span class="card-upload__meta">0%</span><span class="card-upload__bar" aria-hidden="true"><span style="width:0%"></span></span>';
    row.querySelector('.card-upload__name').textContent = file.name;
    list.insertBefore(row, list.firstChild);
    while (list.children.length > 2) list.lastElementChild.remove();
    var meta = row.querySelector('.card-upload__meta');
    var bar = row.querySelector('.card-upload__bar span');
    function show(pct) {
      bar.style.width = pct + '%';
      if (pct < 100) meta.textContent = pct + '%';
      else meta.outerHTML = TICK;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return show(100);
    var t0 = performance.now();
    var slot = frames.length;
    function step(now) {
      var t = Math.min(1, (now - t0) / 1600);
      show(Math.round(100 * (1 - Math.pow(1 - t, 2.2))));
      if (t < 1) frames[slot] = requestAnimationFrame(step);
    }
    frames[slot] = requestAnimationFrame(step);
  }
  function onEnter(e) {
    e.preventDefault();
    zone.classList.add('card-upload__zone--over');
  }
  function onOver(e) {
    e.preventDefault();
  }
  function onLeave() {
    zone.classList.remove('card-upload__zone--over');
  }
  function onDrop(e) {
    e.preventDefault();
    onLeave();
    var file = e.dataTransfer.files[0];
    if (file) add(file);
  }
  function onChange() {
    var file = input.files && input.files[0];
    if (file) add(file);
    input.value = '';
  }
  zone.addEventListener('dragenter', onEnter);
  zone.addEventListener('dragover', onOver);
  zone.addEventListener('dragleave', onLeave);
  zone.addEventListener('drop', onDrop);
  input.addEventListener('change', onChange);
  return function () {
    frames.forEach(cancelAnimationFrame);
    zone.removeEventListener('dragenter', onEnter);
    zone.removeEventListener('dragover', onOver);
    zone.removeEventListener('dragleave', onLeave);
    zone.removeEventListener('drop', onDrop);
    input.removeEventListener('change', onChange);
  };
}

document.querySelectorAll('.card-upload').forEach(initCardUpload);
