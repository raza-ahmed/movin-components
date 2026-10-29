function initCardAchievement(root) {
  var title = root.querySelector('.card-achievement__title');
  var gain = root.querySelector('.card-achievement__gain');
  if (!title || !gain) return;
  function click() {
    var won = root.getAttribute('aria-pressed') !== 'true';
    root.setAttribute('aria-pressed', String(won));
    title.textContent = won ? 'Night Owl unlocked' : 'Night Owl';
    gain.textContent = won ? '+250 XP' : 'Locked';
  }
  root.addEventListener('click', click);
  return function () { root.removeEventListener('click', click); };
}

document.querySelectorAll('.card-achievement').forEach(initCardAchievement);
