function initBtnDissolve(root) {
  var HOLD = 1300;
  var holding = false;
  var done = false;
  var timer;
  function render() {
    root.toggleAttribute('data-holding', holding);
    root.toggleAttribute('data-done', done);
    root.setAttribute('aria-label', done ? 'Deleted. Press to undo' : 'Hold to delete');
  }
  function start() {
    if (done) return;
    holding = true;
    render();
    // Held long enough: the letters have crumbled away and the delete goes through.
    timer = setTimeout(function () {
      holding = false;
      done = true;
      render();
    }, HOLD);
  }
  function stop() {
    clearTimeout(timer);
    holding = false;
    render();
  }
  function onKeyDown(e) {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      start();
    }
  }
  function onKeyUp(e) {
    if (e.key === ' ' || e.key === 'Enter') stop();
  }
  function onClick() {
    if (!done) return;
    done = false;
    render();
  }
  root.addEventListener('pointerdown', start);
  root.addEventListener('pointerup', stop);
  root.addEventListener('pointerleave', stop);
  root.addEventListener('keydown', onKeyDown);
  root.addEventListener('keyup', onKeyUp);
  root.addEventListener('click', onClick);
  return function () {
    clearTimeout(timer);
    root.removeEventListener('pointerdown', start);
    root.removeEventListener('pointerup', stop);
    root.removeEventListener('pointerleave', stop);
    root.removeEventListener('keydown', onKeyDown);
    root.removeEventListener('keyup', onKeyUp);
    root.removeEventListener('click', onClick);
  };
}

document.querySelectorAll('.btn-dissolve').forEach(initBtnDissolve);
