function initFieldStrength(root) {
  const input = root.querySelector('.field-strength__input');
  const label = root.querySelector('.field-strength__label');
  const LEVELS = [
    null,
    { label: 'Weak', color: 'light-dark(#cbced3, #393c41)' },
    { label: 'Fair', color: 'light-dark(#6d7179, #7d8087)' },
    { label: 'Good', color: 'light-dark(#50535b, #c6c8cd)' },
    { label: 'Strong', color: 'light-dark(#373a40, #f1f2f3)' },
  ];

  // One point each for: 8+ chars, 12+ chars, a capital, a digit, a symbol.
  function score(pw) {
    if (!pw) return 0;
    const s = [pw.length >= 8, pw.length >= 12, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
    return s <= 1 ? 1 : s <= 2 ? 2 : s <= 3 ? 3 : 4;
  }

  function update() {
    const level = LEVELS[score(input.value)];
    root.dataset.score = String(score(input.value));
    root.style.setProperty('--field-strength-color', level ? level.color : 'light-dark(rgba(55, 58, 64, 0.55), rgba(241, 242, 243, 0.55))');
    label.textContent = level ? level.label : '';
  }

  input.addEventListener('input', update);
  return () => input.removeEventListener('input', update);
}

document.querySelectorAll('.field-strength').forEach(initFieldStrength);
