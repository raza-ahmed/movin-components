function initCbGravityDrop(root) {
  const input = root.querySelector('.cb-gravity-drop__input');
  const touch = () => root.classList.add('cb-gravity-drop--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-gravity-drop').forEach(initCbGravityDrop);
