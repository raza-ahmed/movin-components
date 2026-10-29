function initBtnSpool(root) {
  var MS = 2200;
  var idle = root.querySelector('.btn-spool__idle');
  var word = idle.firstChild;
  var done = root.querySelector('.btn-spool__done');
  var state = 'idle';
  var timer;
  function set(s) {
    state = s;
    root.setAttribute('data-state', s);
    root.setAttribute('aria-busy', String(s === 'run'));
    word.nodeValue = (s === 'run' ? 'Downloading' : 'Download') + ' ';
    idle.setAttribute('aria-hidden', String(s === 'done'));
    done.setAttribute('aria-hidden', String(s !== 'done'));
  }
  function onClick() {
    if (state === 'run') return;
    if (state === 'done') return set('idle');
    // The tape winds onto the reel for the length of the download, then the reel caps with a tick.
    set('run');
    timer = setTimeout(function () { set('done'); }, MS);
  }
  root.addEventListener('click', onClick);
  return function () {
    clearTimeout(timer);
    root.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.btn-spool').forEach(initBtnSpool);
