function initToggleFlip(root) {
  function toggle() {
    root.setAttribute('aria-checked', String(root.getAttribute('aria-checked') !== 'true'));
    root.classList.add('toggle-flip--touched');
  }
  root.addEventListener('click', toggle);
  return () => root.removeEventListener('click', toggle);
}

document.querySelectorAll('.toggle-flip').forEach(initToggleFlip);
