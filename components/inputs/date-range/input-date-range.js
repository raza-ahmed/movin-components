function initFieldDateRange(root) {
  var rows = root.querySelectorAll('.field-date-range__row');
  var sum = root.querySelector('.field-date-range__sum');
  if (!rows.length || !sum) return;
  var YEAR = 2026;
  var MONTH = 10; // November
  var LEAD = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7; // Monday-first offset
  var start = 12;
  var end = 18;
  var hover = null;

  function render() {
    // While choosing the end, the band previews up to the hovered day.
    var b = end !== null ? end : start !== null && hover !== null ? hover : null;
    var lo = start === null ? null : b === null ? start : Math.min(start, b);
    var hi = start === null ? null : b === null ? start : Math.max(start, b);
    rows.forEach(function (row, r) {
      var first = r * 7 - LEAD + 1;
      var band = row.querySelector('.field-date-range__band');
      var from = lo === null ? null : Math.max(lo, first);
      var to = hi === null ? null : Math.min(hi, first + 6);
      var show = from !== null && to !== null && from <= to;
      band.toggleAttribute('data-preview', end === null);
      band.style.left = 'calc(' + (show ? from - first : 0) + ' * 100% / 7)';
      band.style.width = 'calc(' + (show ? to - from + 1 : 0) + ' * 100% / 7)';
      band.style.opacity = show ? '1' : '0';
    });
    root.querySelectorAll('.field-date-range__day').forEach(function (btn) {
      var d = Number(btn.textContent);
      var isEnd = d === start || d === end;
      btn.toggleAttribute('data-end', isEnd);
      btn.setAttribute('aria-pressed', String(isEnd));
    });
    var nights = end !== null && start !== null ? end - start : 0;
    sum.textContent = start !== null && end !== null ? start + ' to ' + end + ' Nov · ' + nights + ' night' + (nights === 1 ? '' : 's') : 'Pick the last night';
  }
  function pick(d) {
    if (start === null || end !== null) {
      start = d;
      end = null;
    } else if (d < start) {
      end = start;
      start = d;
    } else end = d;
    render();
  }
  function click(e) {
    var btn = e.target.closest('.field-date-range__day');
    if (btn) pick(Number(btn.textContent));
  }
  function over(e) {
    var btn = e.target.closest('.field-date-range__day');
    hover = btn ? Number(btn.textContent) : null;
    if (end === null) render();
  }
  function out() {
    hover = null;
    if (end === null) render();
  }
  root.addEventListener('click', click);
  root.addEventListener('pointerover', over);
  root.addEventListener('pointerleave', out);
  render();
  return function () {
    root.removeEventListener('click', click);
    root.removeEventListener('pointerover', over);
    root.removeEventListener('pointerleave', out);
  };
}

document.querySelectorAll('.field-date-range').forEach(initFieldDateRange);
