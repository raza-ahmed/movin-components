function initCardAlmanac(root) {
  var DAYS = [
    { day: 'Thursday', date: 29, note: 'Ship the small thing.' },
    { day: 'Friday', date: 30, note: 'Tidy the desk, then leave early.' },
    { day: 'Saturday', date: 31, note: 'Nothing planned. Keep it that way.' },
    { day: 'Sunday', date: 1, note: 'A long walk before the week.' },
  ];
  var page = root.querySelector('.card-almanac__page');
  var bind = root.querySelector('.card-almanac__bind');
  var i = 0;
  function fill(el, d) {
    el.querySelector('.card-almanac__month').textContent = d.date < 15 ? 'November' : 'October';
    el.querySelector('.card-almanac__date').textContent = d.date;
    el.querySelector('.card-almanac__day').textContent = d.day;
    el.querySelector('.card-almanac__note').textContent = d.note;
  }
  function onClick() {
    var prev = DAYS[i % DAYS.length];
    i += 1;
    var cur = DAYS[i % DAYS.length];
    // The page you tore off is a fresh copy on top, so its tear runs from the start every time.
    var old = root.querySelector('.card-almanac__page[data-gone]');
    if (old) old.remove();
    var gone = page.cloneNode(true);
    fill(gone, prev);
    gone.setAttribute('data-gone', '');
    root.insertBefore(gone, bind);
    fill(page, cur);
    // The name reads the page as it is printed, then the action.
    root.setAttribute('aria-label', (cur.date < 15 ? 'November' : 'October') + ' ' + cur.date + ', ' + cur.day + '. ' + cur.note + ' Tear off this page');
  }
  root.addEventListener('click', onClick);
  return function () { root.removeEventListener('click', onClick); };
}

document.querySelectorAll('.card-almanac').forEach(initCardAlmanac);
