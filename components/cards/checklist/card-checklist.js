function initCardChecklist(root) {
  var inputs = root.querySelectorAll('.card-checklist__input');
  var title = root.querySelector('.card-checklist__title');
  var ring = root.querySelector('.card-checklist__ring');
  var arc = root.querySelector('.card-checklist__arc');
  var count = root.querySelector('.card-checklist__ring > span');
  var total = inputs.length;
  var all = false;

  // The ticks and strike-throughs are pure CSS off :checked; this keeps the ring and heading in step.
  function update() {
    var n = 0;
    inputs.forEach(function (input) {
      if (input.checked) n++;
    });
    arc.style.strokeDashoffset = 1 - n / total;
    ring.setAttribute('aria-label', n + ' of ' + total + ' done');
    count.textContent = n + '/' + total;
    if ((n === total) === all) return;
    all = n === total;
    // A new heading replays its pop.
    var fresh = title.cloneNode(false);
    fresh.className = 'card-checklist__title' + (all ? ' card-checklist__title--done' : '');
    fresh.textContent = all ? 'All set for launch' : 'Launch prep';
    title.replaceWith(fresh);
    title = fresh;
  }
  root.addEventListener('change', update);
  return function () {
    root.removeEventListener('change', update);
  };
}

document.querySelectorAll('.card-checklist').forEach(initCardChecklist);
