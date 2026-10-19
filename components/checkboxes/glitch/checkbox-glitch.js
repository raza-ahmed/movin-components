function initCbGlitch(root) {
  const input = root.querySelector('.cb-glitch__input');
  let timer = 0;
  function play() {
    root.classList.remove('cb-glitch--glitching');
    void root.offsetWidth; // restart even mid-animation
    root.classList.add('cb-glitch--glitching');
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove('cb-glitch--glitching'), 320);
  }
  input.addEventListener('change', play);
  return () => {
    clearTimeout(timer);
    input.removeEventListener('change', play);
  };
}

document.querySelectorAll('.cb-glitch').forEach(initCbGlitch);
