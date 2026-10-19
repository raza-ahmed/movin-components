function initBtnFold(root) {
  var top = root.querySelector('.btn-fold__half--top');
  var shade = root.querySelector('.btn-fold__shade');
  var texts = root.querySelectorAll('.btn-fold__text');
  if (!top || !shade || !texts.length) return;
  var labels = [texts[0].textContent, root.getAttribute('data-alt') || texts[0].textContent];
  var current = 0;
  var busy = false;

  function swap() {
    current = 1 - current;
    texts.forEach(function (t) {
      t.textContent = labels[current];
    });
    root.setAttribute('aria-label', labels[current]);
  }

  function fold() {
    if (busy) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return swap();
    busy = true;
    var from = getComputedStyle(top).transform; // starts from the hover lift, no jump
    // Fold down, hold it folded for a beat (the label changes under the flap),
    // then unfold. Both second-stage animations fill backwards so the flap and
    // its shadow stay put through the pause instead of snapping up.
    var down = top.animate([{ transform: from === 'none' ? 'rotateX(0deg)' : from }, { transform: 'rotateX(-180deg)' }], {
      duration: 640,
      easing: 'cubic-bezier(0.45, 0, 0.2, 1)',
      fill: 'forwards',
    });
    var dim = shade.animate([{ opacity: 0 }, { opacity: 0.45 }], { duration: 640, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' });
    down.onfinish = function () {
      swap();
      // Land where CSS will hold it: on the hover lift if the cursor is still over it.
      var end = root.matches(':hover') ? 'rotateX(-14deg)' : 'rotateX(0deg)';
      var up = top.animate([{ transform: 'rotateX(-180deg)' }, { transform: end }], {
        duration: 820,
        delay: 380,
        easing: 'cubic-bezier(0.35, 0, 0.15, 1)',
        fill: 'backwards',
      });
      shade.animate([{ opacity: 0.45 }, { opacity: 0 }], { duration: 820, delay: 380, easing: 'cubic-bezier(0.35, 0, 0.15, 1)', fill: 'backwards' });
      down.cancel();
      dim.cancel();
      up.onfinish = function () {
        busy = false;
      };
    };
  }

  root.addEventListener('click', fold);
  return function () {
    root.removeEventListener('click', fold);
    top.getAnimations().forEach(function (a) {
      a.cancel();
    });
  };
}

document.querySelectorAll('.btn-fold').forEach(initBtnFold);
