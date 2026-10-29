function initBtnBreathe(root) {
  // One breath: in, hold, out. Two rounds, then it rests again.
  var STEPS = [
    { word: 'Breathe in', ms: 4000, phase: 'in' },
    { word: 'Hold', ms: 2000, phase: 'hold' },
    { word: 'Breathe out', ms: 4000, phase: 'out' },
  ];
  var ROUNDS = 2;
  var btn = root.querySelector('.btn-breathe__btn');
  var word = root.querySelector('.btn-breathe__word').firstChild;
  var sub = root.querySelector('.btn-breathe__sub');
  var step = -1;
  var timer;
  function render() {
    var cur = step >= 0 ? STEPS[step % STEPS.length] : null;
    if (cur) root.setAttribute('data-phase', cur.phase);
    else root.removeAttribute('data-phase');
    root.style.setProperty('--ms', (cur ? cur.ms : 0) + 'ms');
    btn.setAttribute('aria-pressed', String(!!cur));
    word.nodeValue = cur ? cur.word : 'Begin';
    sub.textContent = cur ? 'Round ' + (Math.floor(step / STEPS.length) + 1) + ' of ' + ROUNDS : 'One minute';
  }
  function go(s) {
    clearTimeout(timer);
    step = s >= STEPS.length * ROUNDS ? -1 : s;
    render();
    if (step >= 0) timer = setTimeout(function () { go(step + 1); }, STEPS[step % STEPS.length].ms);
  }
  function onClick() { go(step < 0 ? 0 : -1); }
  btn.addEventListener('click', onClick);
  return function () {
    clearTimeout(timer);
    btn.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.btn-breathe').forEach(initBtnBreathe);
