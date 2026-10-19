function initCbShakeLock(root) {
  const input = root.querySelector('.cb-shake-lock__input');
  const touch = () => root.classList.add('cb-shake-lock--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-shake-lock').forEach(initCbShakeLock);
