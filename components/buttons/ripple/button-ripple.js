function initBtnRipple(root) {
  function spawn(event) {
    const rect = root.getBoundingClientRect();
    // A keyboard press has no pointer position: start from the centre.
    const x = event.detail > 0 ? event.clientX - rect.left : rect.width / 2;
    const y = event.detail > 0 ? event.clientY - rect.top : rect.height / 2;
    const wave = document.createElement('span');
    wave.className = 'btn-ripple__wave';
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    root.append(wave);
    setTimeout(() => wave.remove(), 620);
  }
  root.addEventListener('click', spawn);
  return () => root.removeEventListener('click', spawn);
}

document.querySelectorAll('.btn-ripple').forEach(initBtnRipple);
