function initCardChat(root) {
  var SCRIPT = [
    { me: false, text: 'Did the new build land?' },
    { me: true, text: 'Deployed 2 min ago' },
    { me: false, text: 'The loader is so smooth now' },
    { me: true, text: 'Shipping the cards next' },
  ];
  // Each message takes two beats: a typing beat (for theirs) and the bubble.
  var beat = 0;
  function render() {
    var count = Math.floor(beat / 2);
    var bubbles = root.querySelectorAll('.card-chat__msg');
    if (bubbles.length > count) root.textContent = '';
    var typing = root.querySelector('.card-chat__typing');
    if (typing) typing.remove();
    for (var i = root.querySelectorAll('.card-chat__msg').length; i < count; i++) {
      var m = document.createElement('div');
      m.className = 'card-chat__msg';
      if (SCRIPT[i].me) m.setAttribute('data-me', '');
      m.textContent = SCRIPT[i].text;
      root.appendChild(m);
    }
    var next = SCRIPT[count];
    if (beat % 2 === 1 && next && !next.me) {
      var t = document.createElement('div');
      t.className = 'card-chat__typing';
      t.setAttribute('aria-label', 'Jordan is typing');
      t.innerHTML = '<i></i><i></i><i></i>';
      root.appendChild(t);
    }
  }
  var timer = setInterval(function () {
    beat = beat >= SCRIPT.length * 2 + 2 ? 0 : beat + 1;
    render();
  }, 850);
  return function () { clearInterval(timer); };
}

document.querySelectorAll('.card-chat').forEach(initCardChat);
