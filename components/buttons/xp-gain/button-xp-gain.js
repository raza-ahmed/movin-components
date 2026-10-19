function initBtnXpGain(root) {
  const total = root.querySelector('.btn-xp-gain__total');
  let xp = 0;
  function collect(event) {
    xp += 100;
    total.textContent = xp.toLocaleString();
    const rect = root.getBoundingClientRect();
    const float = document.createElement('span');
    float.className = 'btn-xp-gain__float';
    float.setAttribute('aria-hidden', 'true');
    float.textContent = '+100 XP';
    // A keyboard press has no pointer position: float from the centre.
    float.style.left = (event.detail > 0 ? event.clientX - rect.left : rect.width / 2) + 'px';
    root.append(float);
    setTimeout(() => float.remove(), 900);
  }
  root.addEventListener('click', collect);
  return () => root.removeEventListener('click', collect);
}

document.querySelectorAll('.btn-xp-gain').forEach(initBtnXpGain);
