function initCbInkBlot(root) {
  const input = root.querySelector('.cb-ink-blot__input');
  const touch = () => root.classList.add('cb-ink-blot--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-ink-blot').forEach(initCbInkBlot);
