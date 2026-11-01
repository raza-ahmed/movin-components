function initCardActions(root) {
  var LEFT = 112;
  var RIGHT = 56;
  var rows = root.querySelectorAll('.card-actions__row');
  var fronts = root.querySelectorAll('.card-actions__front');
  var open = null;
  var drag = null;
  var flags = [];
  var timer = 0;

  // Past an open position the row keeps moving, but only a quarter as far as the pointer.
  function resist(dx) {
    return dx < -LEFT ? -LEFT + (dx + LEFT) * 0.25 : dx > RIGHT ? RIGHT + (dx - RIGHT) * 0.25 : dx;
  }
  function render() {
    rows.forEach(function (row, i) {
      var dx = drag && drag.i === i ? drag.dx : open && open.i === i ? open.dx : 0;
      var isOpen = !!open && open.i === i;
      var acts = row.querySelectorAll('.card-actions__act');
      acts[0].tabIndex = isOpen && open.dx > 0 ? 0 : -1;
      acts[1].tabIndex = acts[2].tabIndex = isOpen && open.dx < 0 ? 0 : -1;
      acts[0].textContent = flags.indexOf(i) > -1 ? 'Unflag' : 'Flag';
      fronts[i].classList.toggle('card-actions__front--settle', !drag || drag.i !== i);
      fronts[i].style.transform = 'translateX(' + dx + 'px)';
      var from = fronts[i].querySelector('.card-actions__from');
      var dot = from.querySelector('.card-actions__flag');
      if (flags.indexOf(i) > -1 && !dot) from.insertAdjacentHTML('afterbegin', '<span class="card-actions__flag" role="img" aria-label="Flagged"></span>');
      if (flags.indexOf(i) < 0 && dot) dot.remove();
    });
  }
  function rowOf(el) {
    return Array.prototype.indexOf.call(rows, el.closest('.card-actions__row'));
  }
  function remove(i) {
    open = null;
    rows[i].classList.add('card-actions__row--gone');
    render();
    // The demo puts it back after a moment.
    clearTimeout(timer);
    timer = setTimeout(function () {
      rows[i].classList.remove('card-actions__row--gone');
    }, 1600);
  }
  function onAct(e) {
    var i = rowOf(e.currentTarget);
    if (!e.currentTarget.classList.contains('card-actions__act--flag')) return remove(i);
    var at = flags.indexOf(i);
    if (at > -1) flags.splice(at, 1);
    else flags.push(i);
    open = null;
    render();
  }
  function onDown(e) {
    var i = rowOf(e.currentTarget);
    var dx = open && open.i === i ? open.dx : 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag = { i: i, x0: e.clientX, dx: dx, base: dx };
    render();
  }
  function onMove(e) {
    if (!drag || drag.i !== rowOf(e.currentTarget)) return;
    drag.dx = resist(drag.base + e.clientX - drag.x0);
    render();
  }
  function onUp() {
    if (!drag) return;
    // Let go past halfway and it stays open; otherwise it springs shut.
    var to = drag.dx < -LEFT / 2 ? -LEFT : drag.dx > RIGHT * 0.7 ? RIGHT : 0;
    open = to ? { i: drag.i, dx: to } : null;
    drag = null;
    render();
  }
  function onCancel() {
    drag = null;
    render();
  }
  function onKey(e) {
    var i = rowOf(e.currentTarget);
    var isOpen = !!open && open.i === i;
    if (e.key === 'ArrowLeft') open = { i: i, dx: -LEFT };
    else if (e.key === 'ArrowRight') open = isOpen && open.dx < 0 ? null : { i: i, dx: RIGHT };
    else if (e.key === 'Escape') open = null;
    else return;
    e.preventDefault();
    render();
  }
  var acts = root.querySelectorAll('.card-actions__act');
  acts.forEach(function (a) {
    a.addEventListener('click', onAct);
  });
  fronts.forEach(function (f) {
    f.addEventListener('pointerdown', onDown);
    f.addEventListener('pointermove', onMove);
    f.addEventListener('pointerup', onUp);
    f.addEventListener('pointercancel', onCancel);
    f.addEventListener('keydown', onKey);
  });
  return function () {
    clearTimeout(timer);
    acts.forEach(function (a) {
      a.removeEventListener('click', onAct);
    });
    fronts.forEach(function (f) {
      f.removeEventListener('pointerdown', onDown);
      f.removeEventListener('pointermove', onMove);
      f.removeEventListener('pointerup', onUp);
      f.removeEventListener('pointercancel', onCancel);
      f.removeEventListener('keydown', onKey);
    });
  };
}

document.querySelectorAll('.card-actions').forEach(initCardActions);
