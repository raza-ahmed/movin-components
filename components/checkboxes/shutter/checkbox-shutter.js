function initCbShutter(root) {
  const input = root.querySelector('.cb-shutter__input');
  const touch = () => root.classList.add('cb-shutter--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-shutter').forEach(initCbShutter);
