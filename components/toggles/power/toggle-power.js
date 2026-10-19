function initTogglePower(root) {
  function toggle() {
    root.setAttribute('aria-checked', String(root.getAttribute('aria-checked') !== 'true'));
    root.classList.remove('toggle-power--pressed');
    void root.offsetWidth; // restart the spin + ripple even mid-animation
    root.classList.add('toggle-power--pressed');
  }
  root.addEventListener('click', toggle);
  return () => root.removeEventListener('click', toggle);
}

document.querySelectorAll('.toggle-power').forEach(initTogglePower);
