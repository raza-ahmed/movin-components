function initFieldLiquidFill(root) {
  const liquid = root.querySelector('.field-liquid-fill__liquid');
  const input = root.querySelector('.field-liquid-fill__input');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let level = 100; // the surface, as a % from the top: 100 = empty
  let phase = 0;
  let frame = 0;

  function draw(surface, wave) {
    const pts = ['0% 100%', '100% 100%'];
    for (let i = 20; i >= 0; i--) {
      const x = (i / 20) * 100;
      pts.push(`${x}% ${(surface - wave * Math.sin((x / 100) * Math.PI * 4 + phase)).toFixed(1)}%`);
    }
    liquid.style.clipPath = `polygon(${pts.join(', ')})`;
  }

  // Ease the level toward its target and roll the wave; stop once drained.
  function tick() {
    const target = document.activeElement === input ? 65 : 100;
    phase += 0.06;
    level += (target - level) * 0.04;
    draw(level, 4);
    frame = target === 100 && level > 99.5 ? 0 : requestAnimationFrame(tick);
    if (!frame) draw(100, 0);
  }

  function start() {
    if (reduce.matches) {
      draw(document.activeElement === input ? 65 : 100, 0);
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  }

  input.addEventListener('focus', start);
  input.addEventListener('blur', start);
  return () => {
    cancelAnimationFrame(frame);
    input.removeEventListener('focus', start);
    input.removeEventListener('blur', start);
  };
}

document.querySelectorAll('.field-liquid-fill').forEach(initFieldLiquidFill);
