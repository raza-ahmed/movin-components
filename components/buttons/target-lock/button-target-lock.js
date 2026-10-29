function initBtnTargetLock(root) {
  var btn = root.querySelector('.btn-target-lock__btn');
  var readout = root.querySelector('.btn-target-lock__readout');
  if (!btn || !readout) return;
  var PREFIX = 'TGT 07 · ';
  var text = readout.firstChild;
  var timer = 0;

  // Retype the readout whenever the lock state flips.
  function set(locked) {
    root.toggleAttribute('data-locked', locked);
    var target = PREFIX + (locked ? 'LOCKED' : 'ACQUIRING');
    var n = PREFIX.length;
    clearInterval(timer);
    text.textContent = target.slice(0, n);
    timer = setInterval(function () {
      n += 1;
      text.textContent = target.slice(0, n);
      if (n >= target.length) clearInterval(timer);
    }, 38);
  }
  function lock() { set(true); }
  function release() { set(false); }
  root.addEventListener('pointerenter', lock);
  root.addEventListener('pointerleave', release);
  btn.addEventListener('focus', lock);
  btn.addEventListener('blur', release);

  return function () {
    clearInterval(timer);
    root.removeEventListener('pointerenter', lock);
    root.removeEventListener('pointerleave', release);
    btn.removeEventListener('focus', lock);
    btn.removeEventListener('blur', release);
  };
}

document.querySelectorAll('.btn-target-lock').forEach(initBtnTargetLock);
