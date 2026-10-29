function initTabsJukebox(root) {
  var list = root.querySelector('[role="tablist"]');
  var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  var panels = root.querySelectorAll('[role="tabpanel"]');
  var sel = tabs.findIndex(function (tab) { return tab.getAttribute('aria-selected') === 'true'; });
  var COLOURS = ['light-dark(#42454c, #e5e6e9)', 'light-dark(#5f626a, #a7abb2)', 'light-dark(#cbced3, #393c41)'];
  var flip = 0;
  var deck = root.querySelector('.tabs-jukebox__deck');
  var arm = root.querySelector('.tabs-jukebox__arm');
  // Only the playing record and the one leaving are on the deck.
  var records = {};
  records[sel] = deck.querySelector('.tabs-jukebox__record');
  function record(k) {
    if (records[k]) return records[k];
    var el = document.createElement('span');
    el.className = 'tabs-jukebox__record';
    el.style.setProperty('--tabs-jukebox-c', COLOURS[k]);
    var disc = document.createElement('span');
    disc.className = 'tabs-jukebox__disc';
    el.appendChild(disc);
    // Keep the records in song order, under the arm.
    var after = arm;
    for (var j = COLOURS.length - 1; j > k; j--) if (records[j]) after = records[j];
    deck.insertBefore(el, after);
    records[k] = el;
    return el;
  }
  function select(i) {
    if (i === sel) return;
    var prev = sel;
    sel = i;
    tabs.forEach(function (tab, k) {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach(function (panel, k) { panel.hidden = k !== i; });
    Object.keys(records).forEach(function (k) {
      if (+k !== i && +k !== prev) {
        records[k].remove();
        delete records[k];
      }
    });
    record(prev).removeAttribute('data-on');
    record(prev).setAttribute('data-prev', '');
    record(i).removeAttribute('data-prev');
    record(i).setAttribute('data-on', '');
    // Each change flips data-flip between a and b, so the keyframes restart every time.
    flip += 1;
    root.setAttribute('data-flip', flip % 2 ? 'a' : 'b');
    root.setAttribute('data-armed', '');
  }
  function onClick(e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tabs.indexOf(tab));
  }
  function onKeyDown(e) {
    var n = tabs.length;
    var next = { ArrowDown: (sel + 1) % n, ArrowUp: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs[next].focus();
  }
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKeyDown);
  return function () {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKeyDown);
  };
}

document.querySelectorAll('.tabs-jukebox').forEach(initTabsJukebox);
