function initToggleIcon(root) {
  function toggle() {
    const on = root.getAttribute('aria-checked') !== 'true';
    root.setAttribute('aria-checked', String(on));
    // The label names what a press will do next.
    root.setAttribute('aria-label', on ? 'Switch to dark mode' : 'Switch to light mode');
  }
  root.addEventListener('click', toggle);
  return () => root.removeEventListener('click', toggle);
}

document.querySelectorAll('.toggle-icon').forEach(initToggleIcon);
