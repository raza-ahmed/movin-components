function initCbPressureDip(root) {
  const input = root.querySelector('.cb-pressure-dip__input');
  const touch = () => root.classList.add('cb-pressure-dip--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-pressure-dip').forEach(initCbPressureDip);
