function initCardMagnetic(root) {
  function move(event) {
    const rect = root.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    root.style.setProperty('--card-magnetic-x', x * 30 + 'px');
    root.style.setProperty('--card-magnetic-y', y * 20 + 'px');
  }
  function reset() {
    root.style.setProperty('--card-magnetic-x', '0px');
    root.style.setProperty('--card-magnetic-y', '0px');
  }
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', reset);
  return () => {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', reset);
  };
}

document.querySelectorAll('.card-magnetic').forEach(initCardMagnetic);
