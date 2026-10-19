function initBtnBurstRing(root) {
  function burst(event) {
    const rect = root.getBoundingClientRect();
    // A keyboard press has no pointer position: burst from the centre.
    const fromPointer = event.detail > 0;
    const ring = document.createElement('span');
    ring.className = 'btn-burst-ring__ring';
    ring.style.left = (fromPointer ? event.clientX - rect.left : rect.width / 2) + 'px';
    ring.style.top = (fromPointer ? event.clientY - rect.top : rect.height / 2) + 'px';
    root.append(ring);
    setTimeout(() => ring.remove(), 540);
  }
  root.addEventListener('click', burst);
  return () => root.removeEventListener('click', burst);
}

document.querySelectorAll('.btn-burst-ring').forEach(initBtnBurstRing);
