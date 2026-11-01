function initCardOnboarding(root) {
  var STEPS = [
    { title: 'Collect', text: 'Save anything you like into a collection as you browse.' },
    { title: 'Arrange', text: 'Drag things into order and group them by project.' },
    { title: 'Share', text: 'Send one link and everyone sees the same set.' },
  ];
  var GAP = 14;
  var LEAD = '0.25s cubic-bezier(0.3, 1.2, 0.5, 1)';
  var TRAIL = '0.3s cubic-bezier(0.3, 1.2, 0.5, 1) 0.12s';
  var steps = root.querySelectorAll('.card-onboarding__step');
  var shape = root.querySelector('.card-onboarding__shape');
  var title = root.querySelector('.card-onboarding__title');
  var text = root.querySelector('.card-onboarding__text');
  var pill = root.querySelector('.card-onboarding__pill');
  var btns = root.querySelector('.card-onboarding__btns');
  var next = root.querySelector('.card-onboarding__btn');
  var back = document.createElement('button');
  back.type = 'button';
  back.className = 'card-onboarding__btn card-onboarding__btn--ghost';
  back.textContent = 'Back';
  var at = 0;

  function go(i) {
    var backwards = i < at;
    at = i;
    shape.className = 'card-onboarding__shape card-onboarding__shape--' + at;
    title.textContent = at + 1 + '. ' + STEPS[at].title;
    text.textContent = STEPS[at].text;
    // The art and the words slide in from the side you are heading to; restarting the animation replays it.
    steps.forEach(function (step) {
      step.classList.toggle('card-onboarding__step--back', backwards);
      step.style.animation = 'none';
      void step.offsetWidth;
      step.style.animation = '';
    });
    // One pill stretches to the new dot with its leading edge, then pulls its trailing edge after it.
    pill.style.transition = backwards ? 'left ' + LEAD + ', right ' + TRAIL : 'right ' + LEAD + ', left ' + TRAIL;
    pill.style.left = at * GAP + 'px';
    pill.style.right = (STEPS.length - 1 - at) * GAP + 'px';
    if (at > 0 && !back.parentNode) btns.insertBefore(back, next);
    if (at === 0 && back.parentNode) back.remove();
    next.textContent = at === STEPS.length - 1 ? 'Get started' : 'Next';
  }
  function onNext() {
    go(at === STEPS.length - 1 ? 0 : at + 1);
  }
  function onBack() {
    go(at - 1);
  }
  next.addEventListener('click', onNext);
  back.addEventListener('click', onBack);
  return function () {
    next.removeEventListener('click', onNext);
    back.removeEventListener('click', onBack);
  };
}

document.querySelectorAll('.card-onboarding').forEach(initCardOnboarding);
