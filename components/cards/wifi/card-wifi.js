function initCardWifi(root) {
  var NETS = [
    { name: 'Studio', lock: true },
    { name: 'Home 5G', lock: true },
    { name: 'Cafe Guest', lock: false },
    { name: 'Printer 4F', lock: true },
  ];
  var ROW = 38;
  var TICK =
    '<svg class="card-wifi__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"></path></svg>';
  var LOCK =
    '<svg class="card-wifi__lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>';
  var items = root.querySelectorAll('.card-wifi__item');
  var order = NETS.map(function (n) {
    return n.name;
  });
  var busy = null;
  var timer = 0;

  function kind(n) {
    return n.name === busy ? 'busy' : n.name === order[0] ? 'on' : n.lock ? 'lock' : '';
  }
  var kinds = NETS.map(kind);
  function render() {
    var live = order[0];
    items.forEach(function (item, k) {
      var n = NETS[k];
      var state = n.name === busy ? 'Connecting…' : n.name === live ? 'Connected' : '';
      item.style.transform = 'translateY(' + order.indexOf(n.name) * ROW + 'px)';
      item.classList.toggle('card-wifi__item--on', n.name === live);
      item.classList.toggle('card-wifi__item--busy', n.name === busy);
      item.querySelector('.card-wifi__row').setAttribute('aria-label', n.name + (state ? ', ' + state : '') + (n.lock ? ', secured' : ''));
      // Only a change of state redraws the status, so the tick draws once, when it arrives.
      var next = kind(n);
      if (next === kinds[k]) return;
      kinds[k] = next;
      item.querySelector('.card-wifi__status').innerHTML = next === 'busy' ? 'Connecting…' : next === 'on' ? TICK : next === 'lock' ? LOCK : '';
    });
  }
  // Joining a network: it pulses while it connects, then ticks and moves to the top as the rest shift down.
  function onPick(e) {
    var name = NETS[Array.prototype.indexOf.call(items, e.currentTarget.parentNode)].name;
    if (name === order[0] || busy) return;
    busy = name;
    render();
    timer = setTimeout(function () {
      busy = null;
      order = [name].concat(
        order.filter(function (n) {
          return n !== name;
        }),
      );
      render();
    }, 1300);
  }
  var btns = root.querySelectorAll('.card-wifi__row');
  btns.forEach(function (b) {
    b.addEventListener('click', onPick);
  });
  return function () {
    clearTimeout(timer);
    btns.forEach(function (b) {
      b.removeEventListener('click', onPick);
    });
  };
}

document.querySelectorAll('.card-wifi').forEach(initCardWifi);
