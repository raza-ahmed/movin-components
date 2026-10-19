function initBtnFilings(root) {
  var field = root.querySelector('.btn-filings__field');
  if (!field) return;
  var COLS = 13;
  var ROWS = 4;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var needles = [];
  var centres = [];
  var pointer = null;
  var raf = 0;

  for (var i = 0; i < COLS * ROWS; i++) {
    var n = document.createElement('span');
    n.className = 'btn-filings__needle';
    n.style.setProperty('--btn-filings-i', String(i));
    n.style.setProperty('--btn-filings-a', (Math.random() * 40 - 20).toFixed(0) + 'deg');
    field.appendChild(n);
    needles.push(n);
  }

  function measure() {
    var box = root.getBoundingClientRect();
    centres = needles.map(function (n) {
      var b = n.getBoundingClientRect();
      return [b.left + b.width / 2 - box.left, b.top + b.height / 2 - box.top];
    });
  }

  function update() {
    raf = 0;
    if (!pointer) return;
    var box = root.getBoundingClientRect();
    for (var i = 0; i < needles.length; i++) {
      var dx = pointer[0] - box.left - centres[i][0];
      var dy = pointer[1] - box.top - centres[i][1];
      var d = Math.sqrt(dx * dx + dy * dy);
      var near = Math.max(0, 1 - d / 280);
      var s = needles[i].style;
      s.setProperty('--btn-filings-a', ((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1) + 'deg');
      s.setProperty('--btn-filings-o', (0.3 + near * 0.7).toFixed(2));
      s.setProperty('--btn-filings-s', (0.7 + near * 0.6).toFixed(2));
    }
  }

  function move(e) {
    pointer = [e.clientX, e.clientY];
    if (!raf) raf = requestAnimationFrame(update);
  }

  function spin() {
    if (reduce) return;
    root.classList.remove('btn-filings--spin');
    void root.offsetWidth; // restart the spin
    root.classList.add('btn-filings--spin');
  }

  function done(e) {
    if (e.target === needles[needles.length - 1]) root.classList.remove('btn-filings--spin');
  }

  var ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  if (!reduce) document.addEventListener('pointermove', move, { passive: true });
  root.addEventListener('click', spin);
  root.addEventListener('animationend', done);

  return function () {
    ro.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('pointermove', move);
    root.removeEventListener('click', spin);
    root.removeEventListener('animationend', done);
    needles.forEach(function (n) {
      n.remove();
    });
  };
}

document.querySelectorAll('.btn-filings').forEach(initBtnFilings);
