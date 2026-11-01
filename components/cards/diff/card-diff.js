function initCardDiff(root) {
  var tabs = root.querySelectorAll('.card-diff__tab');
  var stat = root.querySelector('.card-diff__stat');
  var rows = root.querySelectorAll('.card-diff__row');
  var nums = [];
  rows.forEach(function (row) {
    nums.push(row.querySelector('.card-diff__n').textContent);
  });

  // One class swaps the versions: the CSS strikes and folds the removed rows, then opens the added ones.
  function set(after) {
    root.classList.toggle('card-diff--after', after);
    tabs[0].setAttribute('aria-pressed', String(!after));
    tabs[1].setAttribute('aria-pressed', String(after));
    stat.setAttribute('aria-hidden', String(!after));
    rows.forEach(function (row, i) {
      var del = row.classList.contains('card-diff__row--del');
      var add = row.classList.contains('card-diff__row--add');
      row.setAttribute('aria-hidden', String((del && after) || (add && !after)));
      // After the change the gutter marks each changed line + or −.
      row.querySelector('.card-diff__n').textContent = after && (del || add) ? (add ? '+' : '−') : nums[i];
    });
  }
  function onBefore() {
    set(false);
  }
  function onAfter() {
    set(true);
  }
  tabs[0].addEventListener('click', onBefore);
  tabs[1].addEventListener('click', onAfter);
  return function () {
    tabs[0].removeEventListener('click', onBefore);
    tabs[1].removeEventListener('click', onAfter);
  };
}

document.querySelectorAll('.card-diff').forEach(initCardDiff);
