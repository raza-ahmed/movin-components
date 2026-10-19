function initBtnLoadingLock(root) {
  const label = root.querySelector('.btn-loading-lock__label');
  const idleText = label.textContent;
  let timers = [];

  function set(state, text) {
    root.dataset.state = state;
    label.textContent = text;
  }

  function unlock() {
    if (root.dataset.state !== 'idle') return;
    set('loading', 'UNLOCKING\u2026');
    timers = [
      setTimeout(() => set('done', 'UNLOCKED'), 1600),
      setTimeout(() => set('idle', idleText), 3600),
    ];
  }

  root.addEventListener('click', unlock);
  return () => {
    timers.forEach(clearTimeout);
    root.removeEventListener('click', unlock);
  };
}

document.querySelectorAll('.btn-loading-lock').forEach(initBtnLoadingLock);
