function initBtnRewind(root) {
  var HISTORY = ['Moved logo', 'Renamed frame', 'Deleted layer'];
  var now = root.querySelector('.btn-rewind__now').firstChild;
  var last = root.querySelector('.btn-rewind__left');
  var gone = root.querySelector('.btn-rewind__gone');
  var sr = root.querySelector('.btn-rewind__sr');
  var left = HISTORY.length;
  var flip = 0;
  var timer;
  function render() {
    root.disabled = left === 0;
    now.nodeValue = (left ? 'Undo' : 'All undone') + ' ';
    last.textContent = left ? '· ' + HISTORY[left - 1] : '';
    gone.textContent = left < HISTORY.length ? HISTORY[left] : '';
  }
  function onClick() {
    if (left === 0) return;
    sr.textContent = 'Undid ' + HISTORY[left - 1].toLowerCase();
    left -= 1;
    // Each undo flips data-flip between a and b, so the spin and the strike-out restart.
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
    clearTimeout(timer);
    // Everything undone: after a pause the history comes back, so the demo can run again.
    if (left === 0) timer = setTimeout(function () { left = HISTORY.length; render(); }, 2400);
    render();
  }
  root.addEventListener('click', onClick);
  return function () {
    clearTimeout(timer);
    root.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.btn-rewind').forEach(initBtnRewind);
