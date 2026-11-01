function initCardClock(root) {
  var CITIES = [
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'New York', tz: 'America/New_York' },
  ];
  var hands = { h: root.querySelector('.card-clock__hand--h'), m: root.querySelector('.card-clock__hand--m'), s: root.querySelector('.card-clock__hand--s') };
  var btns = root.querySelectorAll('.card-clock__city');
  var digits = root.querySelector('.card-clock__read b');
  var where = root.querySelector('.card-clock__read span');
  var last = { h: 0, m: 0, s: 0 };
  var city = 0;
  var timer = 0;

  function timeIn(tz, now) {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23', timeZoneName: 'shortOffset' }).formatToParts(now);
    function get(type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return '0';
    }
    return { h: +get('hour'), m: +get('minute'), s: +get('second'), zone: get('timeZoneName') };
  }
  // Keep an angle within half a turn of the last one, so a hand always takes the short way round.
  function near(prev, a) {
    return a + 360 * Math.round((prev - a) / 360);
  }
  function pad(n) {
    return String(n).padStart(2, '0');
  }
  function render() {
    var t = timeIn(CITIES[city].tz, new Date());
    last.h = near(last.h, ((t.h % 12) + t.m / 60) * 30);
    last.m = near(last.m, (t.m + t.s / 60) * 6);
    last.s = near(last.s, t.s * 6);
    ['h', 'm', 's'].forEach(function (k) {
      hands[k].style.transform = 'rotate(' + last[k] + 'deg)';
    });
    digits.textContent = pad(t.h) + ':' + pad(t.m);
    where.textContent = CITIES[city].name + ' · ' + t.zone;
  }
  function tick() {
    render();
    timer = setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  function onPick(e) {
    city = Array.prototype.indexOf.call(btns, e.currentTarget);
    btns.forEach(function (b, i) {
      b.setAttribute('aria-pressed', String(i === city));
    });
    render();
  }
  btns.forEach(function (b) {
    b.addEventListener('click', onPick);
  });
  tick();
  return function () {
    clearTimeout(timer);
    btns.forEach(function (b) {
      b.removeEventListener('click', onPick);
    });
  };
}

document.querySelectorAll('.card-clock').forEach(initCardClock);
