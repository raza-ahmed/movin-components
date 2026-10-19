function initCardTilt(root) {
  const card = root.querySelector('.card-tilt__card');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function move(event) {
    if (reduce.matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    root.style.setProperty('--card-tilt-x', y * -16 + 'deg');
    root.style.setProperty('--card-tilt-y', x * 16 + 'deg');
  }
  function reset() {
    root.style.setProperty('--card-tilt-x', '0deg');
    root.style.setProperty('--card-tilt-y', '0deg');
  }
  card.addEventListener('pointermove', move);
  card.addEventListener('pointerleave', reset);
  return () => {
    card.removeEventListener('pointermove', move);
    card.removeEventListener('pointerleave', reset);
  };
}

document.querySelectorAll('.card-tilt').forEach(initCardTilt);
