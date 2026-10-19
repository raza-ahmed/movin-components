function initFieldStrength(root) {
  const input = root.querySelector('.field-strength__input');
  const label = root.querySelector('.field-strength__label');
  const LEVELS = [
    null,
    { label: 'Weak', color: '#4d4d4d' },
    { label: 'Fair', color: '#7c7c7c' },
    { label: 'Good', color: '#c9c9c9' },
    { label: 'Strong', color: '#f6f6f6' },
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
    root.style.setProperty('--field-strength-color', level ? level.color : 'rgba(246, 246, 246, 0.55)');
    label.textContent = level ? level.label : '';
  }

  input.addEventListener('input', update);
  return () => input.removeEventListener('input', update);
}

document.querySelectorAll('.field-strength').forEach(initFieldStrength);
