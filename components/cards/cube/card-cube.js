function initCardCube(root) {
  var body = root.querySelector('.card-cube__body');
  var faces = root.querySelectorAll('.card-cube__face');
  var dots = root.querySelectorAll('.card-cube__dots i');
  var buttons = root.querySelectorAll('.card-cube__nav button');
  if (!body || faces.length !== 4 || buttons.length !== 2) return;
  // Turning by a running count, not the face index, keeps every turn going the short way.
  var turn = 0;
  function render() {
    var face = ((turn % 4) + 4) % 4;
    body.style.transform = 'translateZ(-100px) rotateY(' + turn * -90 + 'deg)';
    faces.forEach(function (f, i) { f.setAttribute('aria-hidden', String(i !== face)); });
    dots.forEach(function (d, i) { d.toggleAttribute('data-on', i === face); });
  }
  function prev() { turn -= 1; render(); }
  function next() { turn += 1; render(); }
  buttons[0].addEventListener('click', prev);
  buttons[1].addEventListener('click', next);
  return function () {
    buttons[0].removeEventListener('click', prev);
    buttons[1].removeEventListener('click', next);
  };
}

document.querySelectorAll('.card-cube').forEach(initCardCube);
