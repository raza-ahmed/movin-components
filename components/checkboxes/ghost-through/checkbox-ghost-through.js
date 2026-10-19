function initCbGhostThrough(root) {
  const input = root.querySelector('.cb-ghost-through__input');
  const touch = () => root.classList.add('cb-ghost-through--touched');
  input.addEventListener('change', touch);
  return () => input.removeEventListener('change', touch);
}

document.querySelectorAll('.cb-ghost-through').forEach(initCbGhostThrough);
