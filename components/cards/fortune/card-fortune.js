function initCardFortune(root) {
  var FORTUNES = [
    { text: 'Small steps, taken often, go far.', nums: '4 · 17 · 23' },
    { text: 'The idea you dropped is worth a second look.', nums: '8 · 12 · 31' },
    { text: 'Ship it on Tuesday. Polish it on Wednesday.', nums: '2 · 19 · 40' },
  ];
  var slip = root.querySelector('.card-fortune__slip');
  var n = 0;
  var open = false;
  function onClick() {
    // Pressing an open cookie closes it and loads the next fortune for the next crack.
    if (open) n += 1;
    open = !open;
    var f = FORTUNES[n % FORTUNES.length];
    slip.firstChild.nodeValue = f.text;
    slip.querySelector('small').textContent = 'LUCKY ' + f.nums;
    root.setAttribute('aria-pressed', String(open));
    // The name starts with the words on screen: the hint while closed, the slip once open.
    root.setAttribute('aria-label', open ? f.text + ' Lucky ' + f.nums + '. Press for another fortune.' : 'Tap to crack the fortune cookie');
  }
  root.addEventListener('click', onClick);
  return function () { root.removeEventListener('click', onClick); };
}

document.querySelectorAll('.card-fortune').forEach(initCardFortune);
