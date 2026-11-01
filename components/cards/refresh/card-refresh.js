function initCardRefresh(root) {
  var FRESH = ['Jun: proofs look good', 'Invoice 1042 paid', 'Lea shared a board', 'Tom: van is booked'];
  var READY = 50;
  var btn = root.querySelector('.card-refresh__btn');
  var view = root.querySelector('.card-refresh__view');
  var cue = root.querySelector('.card-refresh__pull');
  var arrow = root.querySelector('.card-refresh__arrow');
  var label = cue.lastChild;
  var list = root.querySelector('.card-refresh__list');
  var ring = document.createElement('span');
  ring.className = 'card-refresh__ring';
  var pull = 0;
  var phase = 'idle';
  var start = 0;
  var next = 0;
  var timer = 0;

  function render() {
    cue.style.opacity = Math.min(1, pull / 30);
    if (phase === 'load' && arrow.parentNode) arrow.replaceWith(ring);
    if (phase !== 'load' && ring.parentNode) ring.replaceWith(arrow);
    // The arrow turns over as the pull nears the point where letting go refreshes.
    arrow.style.transform = 'rotate(' + Math.min(180, (pull / READY) * 180) + 'deg)';
    label.textContent = phase === 'load' ? 'Refreshing…' : pull >= READY ? 'Release to refresh' : 'Pull to refresh';
    list.classList.toggle('card-refresh__list--settle', phase !== 'pull');
    list.style.transform = 'translateY(' + pull + 'px)';
    btn.disabled = phase === 'load';
  }
  function load() {
    phase = 'load';
    pull = 44;
    render();
    timer = setTimeout(function () {
      var old = list.querySelector('.card-refresh__item--new');
      if (old) old.classList.remove('card-refresh__item--new');
      var item = document.createElement('li');
      item.className = 'card-refresh__item card-refresh__item--new';
      item.textContent = FRESH[next++ % FRESH.length];
      list.insertBefore(item, list.firstChild);
      while (list.children.length > 4) list.lastElementChild.remove();
      pull = 0;
      phase = 'idle';
      render();
    }, 900);
  }
  // Pull down past READY and let go to refresh; the pull eases off the further you go.
  function onDown(e) {
    if (phase === 'load') return;
    view.setPointerCapture(e.pointerId);
    start = e.clientY;
    phase = 'pull';
    render();
  }
  function onMove(e) {
    if (phase !== 'pull') return;
    var dy = Math.max(0, e.clientY - start);
    pull = 80 * (1 - Math.exp(-dy / 110));
    render();
  }
  function onUp() {
    if (phase !== 'pull') return;
    if (pull >= READY) return load();
    pull = 0;
    phase = 'idle';
    render();
  }
  function onCancel() {
    if (phase === 'load') return;
    pull = 0;
    phase = 'idle';
    render();
  }
  btn.addEventListener('click', load);
  view.addEventListener('pointerdown', onDown);
  view.addEventListener('pointermove', onMove);
  view.addEventListener('pointerup', onUp);
  view.addEventListener('pointercancel', onCancel);
  return function () {
    clearTimeout(timer);
    btn.removeEventListener('click', load);
    view.removeEventListener('pointerdown', onDown);
    view.removeEventListener('pointermove', onMove);
    view.removeEventListener('pointerup', onUp);
    view.removeEventListener('pointercancel', onCancel);
  };
}

document.querySelectorAll('.card-refresh').forEach(initCardRefresh);
