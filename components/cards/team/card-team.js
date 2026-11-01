function initCardTeam(root) {
  var A = 30;
  var SHOWN = 4;
  var group = root.querySelector('.card-team__group');
  var faces = root.querySelectorAll('.card-team__face:not(.card-team__more)');
  var more = root.querySelector('.card-team__more');
  var caption = root.querySelector('.card-team__caption');
  var names = group.getAttribute('aria-label').replace('Team: ', '').split(', ');
  var open = false;
  var hot = null;

  // Stacked, four faces overlap with a +3 chip; spread, all seven line up a beat apart and the chip folds away.
  function render() {
    group.setAttribute('aria-expanded', String(open));
    faces.forEach(function (face, i) {
      var s = face.style;
      var delay = (open ? i : faces.length - i) * 35 + 'ms';
      face.classList.toggle('card-team__face--hot', hot === i);
      if (open) {
        s.transform = 'translateX(' + i * (A + 2) + 'px) scale(' + (hot === i ? 1.12 : 1) + ')';
        s.opacity = '';
        s.transitionDelay = hot === null ? delay : '0ms';
      } else if (i < SHOWN) {
        s.transform = 'translateX(' + i * 20 + 'px)';
        s.opacity = '';
        s.transitionDelay = delay;
      } else {
        s.transform = 'translateX(' + SHOWN * 20 + 'px) scale(0.4)';
        s.opacity = 0;
        s.transitionDelay = delay;
      }
    });
    more.style.transform = 'translateX(' + SHOWN * 20 + 'px) scale(' + (open ? 0.4 : 1) + ')';
    more.style.opacity = open ? 0 : 1;
    caption.textContent = open
      ? hot !== null
        ? names[hot]
        : names.length + ' members'
      : names[0].split(' ')[0] + ', ' + names[1].split(' ')[0] + ' and ' + (names.length - 2) + ' others';
  }
  function onEnter(e) {
    if (e.pointerType !== 'mouse' || open) return;
    open = true;
    render();
  }
  function onClick() {
    open = !open;
    render();
  }
  function onLeave() {
    if (!open) return;
    open = false;
    render();
  }
  function onFace(e) {
    if (!open) return;
    hot = Array.prototype.indexOf.call(faces, e.currentTarget);
    render();
  }
  function onFaceOut() {
    hot = null;
    render();
  }
  group.addEventListener('pointerenter', onEnter);
  group.addEventListener('click', onClick);
  root.addEventListener('pointerleave', onLeave);
  faces.forEach(function (face) {
    face.addEventListener('pointerenter', onFace);
    face.addEventListener('pointerleave', onFaceOut);
  });
  return function () {
    group.removeEventListener('pointerenter', onEnter);
    group.removeEventListener('click', onClick);
    root.removeEventListener('pointerleave', onLeave);
    faces.forEach(function (face) {
      face.removeEventListener('pointerenter', onFace);
      face.removeEventListener('pointerleave', onFaceOut);
    });
  };
}

document.querySelectorAll('.card-team').forEach(initCardTeam);
