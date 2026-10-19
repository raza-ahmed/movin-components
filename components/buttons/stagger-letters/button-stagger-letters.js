function initBtnStaggerLetters(root) {
  const label = root.textContent.trim();
  // Split the label into one span per letter; screen readers get the word whole.
  root.setAttribute('aria-label', label);
  root.replaceChildren(
    ...[...label].map((char, i) => {
      const letter = document.createElement('span');
      letter.className = 'btn-stagger-letters__letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.style.setProperty('--btn-stagger-letters-i', String(i));
      letter.textContent = char;
      return letter;
    }),
  );
  return () => {
    root.textContent = label;
    root.removeAttribute('aria-label');
  };
}

document.querySelectorAll('.btn-stagger-letters').forEach(initBtnStaggerLetters);
