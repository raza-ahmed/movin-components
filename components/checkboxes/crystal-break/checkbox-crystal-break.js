function initCbCrystalBreak(root) {
  const input = root.querySelector('.cb-crystal-break__input');
  let timer = 0;
  function play() {
    root.classList.remove('cb-crystal-break--cracking');
    void root.offsetWidth; // restart even mid-animation
    root.classList.add('cb-crystal-break--cracking');
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove('cb-crystal-break--cracking'), 500);
  }
  input.addEventListener('change', play);
  return () => {
    clearTimeout(timer);
    input.removeEventListener('change', play);
  };
}

document.querySelectorAll('.cb-crystal-break').forEach(initCbCrystalBreak);
