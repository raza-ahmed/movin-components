function initToggleSquish(root) {
  function toggle() {
    root.setAttribute('aria-checked', String(root.getAttribute('aria-checked') !== 'true'));
    root.classList.add('toggle-squish--touched');
  }
  root.addEventListener('click', toggle);
  return () => root.removeEventListener('click', toggle);
}

document.querySelectorAll('.toggle-squish').forEach(initToggleSquish);
