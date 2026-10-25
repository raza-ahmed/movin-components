"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-tile-flip {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 192px;
    height: 64px;
    padding: 0;
    overflow: hidden;
    isolation: isolate;
    border: 0;
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#42454c, #e5e6e9);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-tile-flip:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }

  .btn-tile-flip__tiles {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1px;
  }

  .btn-tile-flip__tile {
    position: relative;
    transform-style: preserve-3d;
    transform: perspective(220px) rotate3d(var(--btn-tile-flip-ax, 0), var(--btn-tile-flip-ay, 1), 0, 0deg);
    transition: transform 0.6s cubic-bezier(0.35, 1.15, 0.5, 1) var(--btn-tile-flip-d, 0ms);
  }

  .btn-tile-flip__tile::before,
  .btn-tile-flip__tile::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 2px;
    backface-visibility: hidden;
  }

  .btn-tile-flip__tile::before {
    background: light-dark(#ebedf0, #232529);
  }

  /* Turned on the tile's own axis, so a full flip lands it square. */
  .btn-tile-flip__tile::after {
    background: light-dark(#42454c, #e5e6e9);
    transform: rotate3d(var(--btn-tile-flip-ax, 0), var(--btn-tile-flip-ay, 1), 0, 180deg);
  }

  .btn-tile-flip--on .btn-tile-flip__tile {
    transform: perspective(220px) rotate3d(var(--btn-tile-flip-ax, 0), var(--btn-tile-flip-ay, 1), 0, 180deg);
  }

  /* Turns dark as the wave passes under it (a blend would stripe it at the gaps). */
  .btn-tile-flip__label {
    position: relative;
    pointer-events: none;
    transition: color 0.3s 0.15s;
  }

  .btn-tile-flip--on .btn-tile-flip__label {
    color: light-dark(#fbfcfd, #121417);
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-tile-flip__label,
    .btn-tile-flip__tile {
      transition: none;
    }
  }
`;

export function TileFlipButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initTileFlip(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-tile-flip" type="button">
        <span className="btn-tile-flip__tiles" aria-hidden="true" />
        <span className="btn-tile-flip__label">Flip the grid</span>
      </button>
    </>
  );
}

// Each tile waits by its distance from the entry (or exit) point and turns
// about the axis at right angles to the line from it, so the wave rolls outwards.
function initTileFlip(root: HTMLElement): (() => void) | undefined {
  const grid = root.querySelector<HTMLElement>('.btn-tile-flip__tiles');
  if (!grid) return;
  const COLS = 12;
  const ROWS = 4;
  const tiles = Array.from({ length: COLS * ROWS }, () => {
    const t = document.createElement('span');
    t.className = 'btn-tile-flip__tile';
    grid.appendChild(t);
    return t;
  });

  const wave = (x: number, y: number, on: boolean) => {
    const w = root.clientWidth / COLS;
    const h = root.clientHeight / ROWS;
    tiles.forEach((t, i) => {
      const dx = (i % COLS) * w + w / 2 - x;
      const dy = Math.floor(i / COLS) * h + h / 2 - y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      t.style.setProperty('--btn-tile-flip-d', `${(d * 2.4).toFixed(0)}ms`);
      if (on) {
        t.style.setProperty('--btn-tile-flip-ax', (-dy / d).toFixed(3));
        t.style.setProperty('--btn-tile-flip-ay', (dx / d).toFixed(3));
      }
    });
    root.classList.toggle('btn-tile-flip--on', on);
  };

  const at = (e: PointerEvent): [number, number] => {
    const box = root.getBoundingClientRect();
    return [e.clientX - box.left, e.clientY - box.top];
  };
  const enter = (e: PointerEvent) => wave(...at(e), true);
  const leave = (e: PointerEvent) => wave(...at(e), false);
  const focus = () => {
    if (root.matches(':focus-visible')) wave(root.clientWidth / 2, root.clientHeight / 2, true);
  };
  const blur = () => {
    if (!root.matches(':hover')) wave(root.clientWidth / 2, root.clientHeight / 2, false);
  };

  root.addEventListener('pointerenter', enter);
  root.addEventListener('pointerleave', leave);
  root.addEventListener('focus', focus);
  root.addEventListener('blur', blur);
  return () => {
    root.removeEventListener('pointerenter', enter);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('focus', focus);
    root.removeEventListener('blur', blur);
    root.classList.remove('btn-tile-flip--on');
    tiles.forEach((t) => t.remove());
  };
}
