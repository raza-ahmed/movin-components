function initCardServings(root) {
  var ITEMS = [
    { per: 100, unit: ' g' },
    { per: 0.5, unit: '' },
    { per: 25, unit: ' g' },
    { per: 15, unit: ' g' },
  ];
  var btns = root.querySelectorAll('.card-servings__btn');
  var count = root.querySelector('.card-servings__n').firstChild;
  var qtys = root.querySelectorAll('.card-servings__qty');
  var n = 2;

  function fmt(q, unit) {
    var whole = Math.floor(q);
    return (q % 1 ? (whole || '') + '½' : String(whole)) + unit;
  }
  // Each quantity is a short window: the old figure rolls out as the new one rolls in, each row a beat after the one above.
  function set(next) {
    var dir = next > n ? 'up' : 'down';
    qtys.forEach(function (qty, i) {
      var item = ITEMS[i];
      var delay = i * 60 + 'ms';
      var out = document.createElement('span');
      out.className = 'card-servings__out--' + dir;
      out.style.animationDelay = delay;
      out.setAttribute('aria-hidden', 'true');
      out.textContent = fmt(item.per * n, item.unit);
      var into = document.createElement('span');
      into.className = 'card-servings__in--' + dir;
      into.style.animationDelay = delay;
      into.textContent = fmt(item.per * next, item.unit);
      qty.replaceChildren(out, into);
    });
    n = next;
    count.textContent = n;
    btns[0].disabled = n <= 1;
    btns[1].disabled = n >= 8;
  }
  function onLess() {
    set(n - 1);
  }
  function onMore() {
    set(n + 1);
  }
  btns[0].addEventListener('click', onLess);
  btns[1].addEventListener('click', onMore);
  return function () {
    btns[0].removeEventListener('click', onLess);
    btns[1].removeEventListener('click', onMore);
  };
}

document.querySelectorAll('.card-servings').forEach(initCardServings);
