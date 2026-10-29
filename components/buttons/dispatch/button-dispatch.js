function initBtnDispatch(root) {
  var send = root.querySelector('.btn-dispatch__send');
  var sent = root.querySelector('.btn-dispatch__sent');
  var state = 'idle';
  var timers = [];
  function set(s) {
    state = s;
    root.setAttribute('data-state', s);
    send.setAttribute('aria-hidden', String(s !== 'idle'));
    sent.setAttribute('aria-hidden', String(s !== 'sent'));
  }
  function onClick() {
    if (state !== 'idle') return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The plane flies off, then the button confirms, then it resets for the next message.
    set(reduce ? 'sent' : 'fly');
    timers = [
      setTimeout(function () { set('sent'); }, reduce ? 0 : 1150),
      setTimeout(function () { set('idle'); }, 3200),
    ];
  }
  root.addEventListener('click', onClick);
  return function () {
    timers.forEach(clearTimeout);
    root.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.btn-dispatch').forEach(initBtnDispatch);
