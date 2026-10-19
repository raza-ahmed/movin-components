function initFieldSpotlight(root) {
  function move(event) {
    const rect = root.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    root.style.setProperty('--field-spotlight-x', x + '%');
  }
  root.addEventListener('pointermove', move);
  return () => root.removeEventListener('pointermove', move);
}

document.querySelectorAll('.field-spotlight').forEach(initFieldSpotlight);
