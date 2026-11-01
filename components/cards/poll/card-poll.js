function initCardPoll(root) {
  var VOTES = [48, 37, 15];
  var TICK =
    '<svg class="card-poll__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"></path></svg>';
  var opts = root.querySelectorAll('.card-poll__opt');
  var foot = root.querySelector('.card-poll__foot');
  var again = document.createElement('button');
  again.type = 'button';
  again.className = 'card-poll__again';
  again.textContent = 'Change vote';
  var names = [];
  opts.forEach(function (o) {
    names.push(o.querySelector('.card-poll__t').textContent);
  });
  var mine = null;
  var raf = 0;

  function total() {
    return VOTES.reduce(function (n, v) {
      return n + v;
    }, 0) + (mine === null ? 0 : 1);
  }
  function pct(i) {
    return Math.round(((VOTES[i] + (mine === i ? 1 : 0)) / total()) * 100);
  }
  function count(t) {
    opts.forEach(function (o, i) {
      o.querySelector('.card-poll__pct').textContent = Math.round(pct(i) * t) + '%';
    });
  }
  // After the vote each option becomes a bar grown to its share, a beat after the one above.
  function render() {
    root.classList.toggle('card-poll--voted', mine !== null);
    opts.forEach(function (o, i) {
      o.classList.toggle('card-poll__opt--mine', mine === i);
      o.disabled = mine !== null;
      o.setAttribute('aria-pressed', String(mine === i));
      o.setAttribute('aria-label', mine === null ? names[i] : names[i] + ', ' + pct(i) + '%' + (mine === i ? ', your vote' : ''));
      o.querySelector('.card-poll__bar').style.transform = mine === null ? '' : 'scaleX(' + pct(i) / 100 + ')';
      var tick = o.querySelector('.card-poll__tick');
      if (mine === i && !tick) o.querySelector('.card-poll__t').insertAdjacentHTML('afterend', TICK);
      if (mine !== i && tick) tick.remove();
    });
    foot.firstChild.textContent = total() + ' votes';
    if (mine !== null && !again.parentNode) foot.appendChild(again);
    if (mine === null && again.parentNode) again.remove();
  }
  // The percentages count up from zero over the same time the bars grow.
  function run() {
    cancelAnimationFrame(raf);
    if (mine === null) return count(0);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return count(1);
    var t0 = performance.now();
    function step(now) {
      var k = Math.min(1, (now - t0) / 700);
      count(1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function onVote(e) {
    mine = Array.prototype.indexOf.call(opts, e.currentTarget);
    render();
    run();
  }
  function onAgain() {
    mine = null;
    render();
    run();
  }
  opts.forEach(function (o) {
    o.addEventListener('click', onVote);
  });
  again.addEventListener('click', onAgain);
  return function () {
    cancelAnimationFrame(raf);
    opts.forEach(function (o) {
      o.removeEventListener('click', onVote);
    });
    again.removeEventListener('click', onAgain);
  };
}

document.querySelectorAll('.card-poll').forEach(initCardPoll);
