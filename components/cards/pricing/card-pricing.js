function initCardPricing(root) {
  var PRICE = { monthly: 12, yearly: 10 };
  var NOTE = { monthly: 'Billed monthly', yearly: 'Billed $120 yearly' };
  var opts = root.querySelectorAll('.card-pricing__opt');
  // One reel per digit; both prices have two digits, so the reels stay and only roll.
  var reels = root.querySelectorAll('.card-pricing__reel');
  var sr = root.querySelector('.card-pricing__sr');
  var note = root.querySelector('.card-pricing__note');
  var plan = 'monthly';

  function set(next) {
    if (next === plan) return;
    root.classList.replace('card-pricing--' + plan, 'card-pricing--' + next);
    plan = next;
    opts[0].setAttribute('aria-pressed', String(plan === 'monthly'));
    opts[1].setAttribute('aria-pressed', String(plan === 'yearly'));
    var digits = String(PRICE[plan]).split('');
    reels.forEach(function (reel, i) {
      reel.style.transform = 'translateY(' + -digits[i] * 40 + 'px)';
    });
    sr.textContent = '$' + PRICE[plan] + ' per month';
    // A new note replays its fade in.
    var fresh = note.cloneNode(false);
    fresh.textContent = NOTE[plan];
    note.replaceWith(fresh);
    note = fresh;
  }
  function onMonthly() {
    set('monthly');
  }
  function onYearly() {
    set('yearly');
  }
  opts[0].addEventListener('click', onMonthly);
  opts[1].addEventListener('click', onYearly);
  return function () {
    opts[0].removeEventListener('click', onMonthly);
    opts[1].removeEventListener('click', onYearly);
  };
}

document.querySelectorAll('.card-pricing').forEach(initCardPricing);
