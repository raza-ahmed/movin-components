function initCardCart(root) {
  var bag = root.querySelector('.card-cart__bag');
  var sr = root.querySelector('.card-cart__sr');
  var row = root.querySelector('.card-cart__row');
  var add = root.querySelector('.card-cart__add');
  var TICK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
  var count = 0;
  var timer = 0;
  var flights = [];

  // When a copy lands the bag bumps (a fresh class replays it) and a new badge pops in with the count.
  function land() {
    count++;
    bag.classList.remove('card-cart__bag--bump');
    void bag.offsetWidth;
    bag.classList.add('card-cart__bag--bump');
    var old = bag.querySelector('.card-cart__count');
    var badge = document.createElement('span');
    badge.className = 'card-cart__count';
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = count;
    if (old) old.replaceWith(badge);
    else bag.appendChild(badge);
    sr.textContent = count + ' in cart';
  }
  // A copy of the product flies up and over into the bag (WAAPI). Each press gets its own copy, so quick presses all land.
  function onAdd() {
    add.innerHTML = TICK + 'Added';
    clearTimeout(timer);
    timer = setTimeout(function () {
      add.textContent = 'Add to cart';
    }, 1400);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return land();
    var fly = document.createElement('span');
    fly.className = 'card-cart__fly';
    fly.setAttribute('aria-hidden', 'true');
    root.insertBefore(fly, row);
    var a = fly.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: 'translate(52px, -64px) scale(0.75)', opacity: 1, offset: 0.55 },
        { transform: 'translate(92px, -51px) scale(0.3)', opacity: 0.4 },
      ],
      { duration: 650, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
    );
    flights.push(a);
    a.onfinish = function () {
      flights.splice(flights.indexOf(a), 1);
      fly.remove();
      land();
    };
  }
  add.addEventListener('click', onAdd);
  return function () {
    clearTimeout(timer);
    flights.forEach(function (a) {
      a.cancel();
    });
    add.removeEventListener('click', onAdd);
  };
}

document.querySelectorAll('.card-cart').forEach(initCardCart);
