function initFieldSplitLabel(root) {
  const label = root.querySelector('.field-split-label__label');
  const text = label.textContent.trim();
  const words = text.split(/\s+/);

  label.setAttribute('aria-label', text);
  label.replaceChildren(
    ...words.map((word, i) => {
      const span = document.createElement('span');
      span.className = 'field-split-label__word';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--field-split-label-i', String(i));
      span.style.setProperty('--field-split-label-n', String(words.length));
      span.textContent = word;
      return span;
    }),
  );
  // Each word shrinks about its own left edge, so pull it left by the share
  // of its offset the shrink removes.
  label.querySelectorAll('.field-split-label__word').forEach((span) => {
    span.style.setProperty('--field-split-label-shift', -span.offsetLeft * 0.2 + 'px');
  });

  return () => {
    label.textContent = text;
    label.removeAttribute('aria-label');
  };
}

document.querySelectorAll('.field-split-label').forEach(initFieldSplitLabel);
