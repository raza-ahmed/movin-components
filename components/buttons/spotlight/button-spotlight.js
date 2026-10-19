function initBtnSpotlight(root) {
  function move(event) {
    const rect = root.getBoundingClientRect();
    root.style.setProperty('--btn-spotlight-x', event.clientX - rect.left + 'px');
    root.style.setProperty('--btn-spotlight-y', event.clientY - rect.top + 'px');
  }
  root.addEventListener('pointermove', move);
  return () => root.removeEventListener('pointermove', move);
}

document.querySelectorAll('.btn-spotlight').forEach(initBtnSpotlight);
