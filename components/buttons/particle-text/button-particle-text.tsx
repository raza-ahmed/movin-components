"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-particle-text {
    position: relative;
    display: inline-grid;
    place-items: center;
    height: 56px;
    padding: 0 40px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#42454c, #e5e6e9);
    font: inherit;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: border-color 0.3s, transform 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-particle-text:hover {
    border-color: light-dark(#6d7179, #7d8087);
  }

  .btn-particle-text:active {
    transform: scale(0.97);
  }

  .btn-particle-text:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }

  /* Bigger than the button so the dust can fly past its edge. */
  .btn-particle-text__canvas {
    position: absolute;
    top: -48px;
    left: -48px;
    width: calc(100% + 96px);
    height: calc(100% + 96px);
    pointer-events: none;
  }

  .btn-particle-text__label {
    position: relative;
  }

  /* The real text stays for screen readers and as the no-script fallback. */
  .btn-particle-text--live .btn-particle-text__label {
    color: transparent;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-particle-text {
      transition: none;
    }
  }
`;

export function ParticleTextButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initParticleText(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-particle-text" type="button">
        <canvas className="btn-particle-text__canvas" aria-hidden="true" />
        <span className="btn-particle-text__label">Scatter</span>
      </button>
    </>
  );
}

// The word is drawn once offscreen and every inked pixel becomes a particle
// with a spring to its home. The cursor pushes them away; a click blows them
// outwards and weakens the spring for a moment so they drift before returning.
function initParticleText(root: HTMLElement): (() => void) | undefined {
  const canvas = root.querySelector<HTMLCanvasElement>('.btn-particle-text__canvas');
  const label = root.querySelector<HTMLElement>('.btn-particle-text__label');
  if (!canvas || !label || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const STRIDE = 7; // x, y, vx, vy, homeX, homeY, alpha: device pixels
  let parts = new Float32Array(0);
  let colour = '';
  let dpr = 1;
  let pointer: { x: number; y: number } | null = null;
  let pull = 0.07;
  let raf = 0;
  let dead = false;

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colour;
    for (let i = 0; i < parts.length; i += STRIDE) {
      ctx.globalAlpha = parts[i + 6];
      ctx.fillRect(parts[i], parts[i + 1], 1, 1);
    }
    ctx.globalAlpha = 1;
  };

  const build = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    colour = getComputedStyle(root).color; // particles in the button's text colour
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    const lb = label.getBoundingClientRect();
    const cs = getComputedStyle(label);
    const off = document.createElement('canvas');
    off.width = canvas.width;
    off.height = canvas.height;
    const o = off.getContext('2d');
    if (!o) return;
    o.scale(dpr, dpr);
    o.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in o) (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText(label.textContent?.trim() ?? '', lb.left - box.left + lb.width / 2, lb.top - box.top + lb.height / 2 + 1);
    const data = o.getImageData(0, 0, off.width, off.height).data;
    const out: number[] = [];
    for (let y = 0; y < off.height; y++) {
      for (let x = 0; x < off.width; x++) {
        const a = data[(y * off.width + x) * 4 + 3];
        if (a > 24) out.push(x, y, 0, 0, x, y, a / 255);
      }
    }
    parts = new Float32Array(out);
    root.classList.add('btn-particle-text--live');
    draw();
  };

  const tick = () => {
    const R = 30 * dpr;
    let energy = 0;
    pull = Math.min(0.07, pull * 1.06);
    for (let i = 0; i < parts.length; i += STRIDE) {
      const x = parts[i];
      const y = parts[i + 1];
      let vx = parts[i + 2];
      let vy = parts[i + 3];
      if (pointer) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 2.4 * dpr;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        }
      }
      vx = (vx + (parts[i + 4] - x) * pull) * 0.86;
      vy = (vy + (parts[i + 5] - y) * pull) * 0.86;
      parts[i] = x + vx;
      parts[i + 1] = y + vy;
      parts[i + 2] = vx;
      parts[i + 3] = vy;
      energy += Math.abs(vx) + Math.abs(vy) + Math.abs(parts[i + 4] - x) + Math.abs(parts[i + 5] - y);
    }
    if (!pointer && energy < parts.length * 0.002) {
      // Settled: snap home so the resting frame is the crisp word.
      for (let j = 0; j < parts.length; j += STRIDE) {
        parts[j] = parts[j + 4];
        parts[j + 1] = parts[j + 5];
        parts[j + 2] = parts[j + 3] = 0;
      }
      draw();
      raf = 0;
      return;
    }
    draw();
    raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (!raf && !dead) raf = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    pointer = x >= 0 && y >= 0 && x <= box.width && y <= box.height ? { x: x * dpr, y: y * dpr } : null;
    if (pointer) kick();
  };

  const onLeave = () => {
    pointer = null;
  };

  const burst = (e: MouseEvent) => {
    const box = canvas.getBoundingClientRect();
    // From the click point; from the centre for a keyboard press.
    const cx = (e.detail ? e.clientX - box.left : box.width / 2) * dpr;
    const cy = (e.detail ? e.clientY - box.top : box.height / 2) * dpr;
    for (let i = 0; i < parts.length; i += STRIDE) {
      const dx = parts[i] - cx;
      const dy = parts[i + 1] - cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const speed = (2 + Math.random() * 7) * dpr;
      const turn = (Math.random() - 0.5) * 1.2;
      parts[i + 2] += ((dx / d) * Math.cos(turn) - (dy / d) * Math.sin(turn)) * speed;
      parts[i + 3] += ((dx / d) * Math.sin(turn) + (dy / d) * Math.cos(turn)) * speed - Math.random() * 2 * dpr;
    }
    pull = 0.004;
    kick();
  };

  const ro = new ResizeObserver(() => {
    if (!dead) build();
  });
  document.fonts.ready.then(() => {
    if (dead) return;
    build();
    ro.observe(root);
  });
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  root.addEventListener('click', burst);

  return () => {
    dead = true;
    ro.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('click', burst);
    root.classList.remove('btn-particle-text--live');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
