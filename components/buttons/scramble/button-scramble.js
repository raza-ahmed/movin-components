function initBtnScramble(root) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  const label = root.textContent.trim().toUpperCase();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = 0;

  // Letters settle left to right, half a letter every 40 ms; the rest flicker.
  function start() {
    if (reduce.matches) return;
    let settled = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      settled += 0.5;
      root.textContent = [...label]
        .map((char, i) => (i < settled ? char : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join('');
      if (settled >= label.length) stop();
    }, 40);
  }

  function stop() {
    clearInterval(timer);
    root.textContent = label;
  }

  root.addEventListener('pointerenter', start);
  root.addEventListener('pointerleave', stop);
  return () => {
    stop();
    root.removeEventListener('pointerenter', start);
    root.removeEventListener('pointerleave', stop);
  };
}

document.querySelectorAll('.btn-scramble').forEach(initBtnScramble);
