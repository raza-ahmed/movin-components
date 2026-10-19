function initBtnShockwave(root) {
  function spawn(event) {
    const rect = root.getBoundingClientRect();
    // A keyboard press has no pointer position: start from the centre.
    const x = event.detail > 0 ? event.clientX - rect.left : rect.width / 2;
    const y = event.detail > 0 ? event.clientY - rect.top : rect.height / 2;
    for (const n of [1, 2, 3]) {
      const ring = document.createElement('span');
      ring.className = `btn-shockwave__ring btn-shockwave__ring--${n}`;
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';
      root.append(ring);
      setTimeout(() => ring.remove(), 900);
    }
  }
  root.addEventListener('click', spawn);
  return () => root.removeEventListener('click', spawn);
}

document.querySelectorAll('.btn-shockwave').forEach(initBtnShockwave);
