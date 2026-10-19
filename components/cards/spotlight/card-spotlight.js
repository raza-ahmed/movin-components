function initCardSpotlight(root) {
  function move(event) {
    const rect = root.getBoundingClientRect();
    root.style.setProperty('--card-spotlight-x', event.clientX - rect.left + 'px');
    root.style.setProperty('--card-spotlight-y', event.clientY - rect.top + 'px');
  }
  root.addEventListener('pointermove', move);
  return () => root.removeEventListener('pointermove', move);
}

document.querySelectorAll('.card-spotlight').forEach(initCardSpotlight);
