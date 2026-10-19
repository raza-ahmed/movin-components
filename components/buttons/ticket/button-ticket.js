function initBtnTicket(root) {
  var main = root.querySelector('.btn-ticket__main');
  var stub = root.querySelector('.btn-ticket__stub');
  if (!main || !stub) return;
  var label = main.textContent;
  var alt = root.getAttribute('data-alt') || label;
  var busy = false;
  var timer = 0;

  function tear() {
    if (busy) return;
    busy = true;
    main.textContent = alt;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stub.style.visibility = 'hidden';
      timer = setTimeout(restore, 1600);
      return;
    }
    // Tug, rip along the perforation from the bottom up, then tumble.
    var fall = stub.animate(
      [
        { transform: 'none', offset: 0 },
        { transform: 'translate(2px, 0) rotate(5deg)', offset: 0.12 },
        { transform: 'translate(8px, 4px) rotate(16deg)', offset: 0.28, easing: 'cubic-bezier(0.45, 0, 1, 1)' },
        { transform: 'translate(46px, 170px) rotate(78deg)', opacity: 0, offset: 1 },
      ],
      { duration: 950, fill: 'forwards' }
    );
    main.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 220, easing: 'ease-out' });
    fall.onfinish = function () {
      timer = setTimeout(function () {
        fall.cancel();
        restore();
      }, 700);
    };
  }

  // A fresh stub slides in from the right.
  function restore() {
    main.textContent = label;
    stub.style.visibility = '';
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stub.animate([{ transform: 'translateX(18px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.3, 1.4, 0.5, 1)' });
    }
    busy = false;
  }

  root.addEventListener('click', tear);
  return function () {
    root.removeEventListener('click', tear);
    clearTimeout(timer);
    stub.getAnimations().forEach(function (a) {
      a.cancel();
    });
    stub.style.visibility = '';
    main.textContent = label;
  };
}

document.querySelectorAll('.btn-ticket').forEach(initBtnTicket);
