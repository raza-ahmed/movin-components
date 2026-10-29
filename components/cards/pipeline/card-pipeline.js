function initCardPipeline(root) {
  var status = root.querySelector('.card-pipeline__status');
  var stages = root.querySelectorAll('.card-pipeline__stage');
  var links = root.querySelectorAll('.card-pipeline__link');
  var log = root.querySelector('.card-pipeline__log');
  if (!status || stages.length !== 3 || !log) return;
  // One line per step: queued, build running/done, test running/done, deploy running/done.
  var LOG = ['queued', 'compiling 214 modules', 'build ok', 'running 86 tests', '86 passed', 'uploading to edge', 'live in 41s'];
  function render(step) {
    // Step 0 = queued; 2n+1 = stage n running; 2n+2 = stage n done.
    var done = step >= 6;
    stages.forEach(function (s, n) {
      var state = step >= 2 * n + 2 ? 'ok' : step === 2 * n + 1 ? 'run' : 'idle';
      s.setAttribute('data-s', state);
      s.querySelector('.card-pipeline__node').setAttribute('data-s', state);
    });
    links.forEach(function (l, i) { l.toggleAttribute('data-on', step >= 2 * (i + 1)); });
    root.toggleAttribute('data-done', done);
    status.textContent = done ? 'Deployed' : step === 0 ? 'Queued' : 'Running';
    log.textContent = '> ' + LOG[Math.min(LOG.length - 1, step)];
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    render(6);
    return;
  }
  var step = 0;
  var timer = setInterval(function () {
    step = step >= 8 ? 0 : step + 1;
    render(step);
  }, 750);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.card-pipeline').forEach(initCardPipeline);
