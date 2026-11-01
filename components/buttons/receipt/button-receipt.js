function initBtnReceipt(root) {
  var button = root.querySelector('.btn-receipt__button');
  var status = root.querySelector('.btn-receipt__status');
  var CHECK =
    '<svg class="btn-receipt__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
  var stage = 'idle';
  var timers = [];
  // idle, printing, paid, tear: each is a class on the root; the CSS animates the paper for each.
  // Under prefers-reduced-motion the CSS shows the receipt at once and fades it instead.
  function set(next) {
    root.classList.remove('btn-receipt--' + stage);
    stage = next;
    root.classList.add('btn-receipt--' + stage);
    button.setAttribute('aria-disabled', String(stage !== 'idle'));
    button.innerHTML = stage === 'idle' ? 'Pay $24.00' : stage === 'printing' ? 'Printing…' : CHECK + 'Paid';
    status.textContent = stage === 'paid' ? 'Paid $24.00. Receipt printed.' : '';
  }
  function pay() {
    if (stage !== 'idle') return;
    set('printing');
    timers.push(setTimeout(set, 1400, 'paid'), setTimeout(set, 2600, 'tear'), setTimeout(set, 3250, 'idle'));
  }
  button.addEventListener('click', pay);
  return function () {
    timers.forEach(clearTimeout);
    button.removeEventListener('click', pay);
  };
}

document.querySelectorAll('.btn-receipt').forEach(initBtnReceipt);
