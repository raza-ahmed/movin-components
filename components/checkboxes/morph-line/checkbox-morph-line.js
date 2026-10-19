function initCbMorphLine(root) {
  const input = root.querySelector('.cb-morph-line__input');
  const touch = () => root.classList.add('cb-morph-line--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-morph-line').forEach(initCbMorphLine);
