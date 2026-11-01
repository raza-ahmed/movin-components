function initCardTracking(root) {
  var WHEN = ['Mon 9:14', 'Mon 16:02', 'Tue 8:30', 'Expected Thu'];
  var btn = root.querySelector('.card-tracking__next');
  var steps = root.querySelectorAll('.card-tracking__step');
  var now = 2;

  // On load the line fills down to the latest step one segment at a time (CSS, staggered by --i); later updates fill the next one.
  function onNext() {
    now = (now + 1) % steps.length;
    steps.forEach(function (step, i) {
      step.classList.toggle('card-tracking__step--done', i <= now);
      step.classList.toggle('card-tracking__step--now', i === now);
      step.classList.toggle('card-tracking__step--filled', i < now);
      if (i === now) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
      step.querySelector('.card-tracking__when').textContent = i <= now || i === steps.length - 1 ? WHEN[i] : 'Pending';
    });
    btn.textContent = now === steps.length - 1 ? 'Start over' : 'Next update';
  }
  btn.addEventListener('click', onNext);
  return function () {
    btn.removeEventListener('click', onNext);
  };
}

document.querySelectorAll('.card-tracking').forEach(initCardTracking);
