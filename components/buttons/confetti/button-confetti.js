function initBtnConfetti(root) {
  const COLORS = ['light-dark(#373a40, #f1f2f3)', 'light-dark(#42454c, #e5e6e9)', 'light-dark(#50535b, #c6c8cd)', 'light-dark(#5f626a, #a7abb2)', 'light-dark(#6d7179, #7d8087)', 'light-dark(#373a40, #f1f2f3)', 'light-dark(#cbced3, #393c41)'];
  const button = root.querySelector('.btn-confetti__button');

  function burst(event) {
    const rect = button.getBoundingClientRect();
    // A keyboard press has no pointer position: burst from the centre.
    const ox = event.detail > 0 ? event.clientX - rect.left : rect.width / 2;
    const oy = event.detail > 0 ? event.clientY - rect.top : rect.height / 2;
    for (let i = 0; i < 22; i++) {
      const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.4;
      const speed = 55 + Math.random() * 80;
      const dur = 500 + Math.random() * 400;
      const piece = document.createElement('span');
      piece.className = 'btn-confetti__piece';
      Object.assign(piece.style, {
        left: ox + 'px',
        top: oy + 'px',
        width: 5 + Math.random() * 5 + 'px',
        height: 4 + Math.random() * 4 + 'px',
        background: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
      piece.style.setProperty('--btn-confetti-x', Math.cos(angle) * speed + 'px');
      piece.style.setProperty('--btn-confetti-y', Math.sin(angle) * speed - 30 + 'px');
      piece.style.setProperty('--btn-confetti-rot', (Math.random() - 0.5) * 720 + 'deg');
      piece.style.setProperty('--btn-confetti-dur', dur + 'ms');
      root.append(piece);
      setTimeout(() => piece.remove(), dur + 50);
    }
  }

  button.addEventListener('click', burst);
  return () => button.removeEventListener('click', burst);
}

document.querySelectorAll('.btn-confetti').forEach(initBtnConfetti);
