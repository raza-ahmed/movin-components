"use client";

import { useEffect, useState } from 'react';

const css = `
  .loader-slide-puzzle {
    position: relative;
    width: 84px;
    height: 84px;
    border-radius: 10px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .loader-slide-puzzle__tile {
    position: absolute;
    left: 4px;
    top: 4px;
    width: 24px;
    height: 24px;
    border-radius: 5px;
    background: light-dark(#dbdde1, #2e3035);
    box-shadow: inset 0 1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 12%, transparent);
    transition: transform 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
  }
  .loader-slide-puzzle__tile[data-key] { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 10px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent); }
  @media (prefers-reduced-motion: reduce) { .loader-slide-puzzle__tile { transition: none; } }
`;

// The eight border cells of the 3x3, clockwise. The gap walks round them, and each
// step slides the tile in its way into the hole: the ring of tiles rotates for ever.
const RING = [0, 1, 2, 5, 8, 7, 6, 3];
const at = (cell: number) => `translate(${(cell % 3) * 26}px, ${Math.floor(cell / 3) * 26}px)`;

export function SlidePuzzleLoader() {
  // where[t] = the cell tile t sits in. Tile 7 starts in the centre; the gap starts at cell 3.
  const [where, setWhere] = useState(() => [0, 1, 2, 5, 8, 7, 6, 4]);
  const [gap, setGap] = useState(3);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let g = 3;
    let w = [0, 1, 2, 5, 8, 7, 6, 4];
    const id = window.setInterval(() => {
      const next = RING[(RING.indexOf(g) + 7) % 8]; // the cell before the gap, going anticlockwise
      w = w.map((c) => (c === next ? g : c));
      g = next;
      setWhere(w);
      setGap(g);
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-slide-puzzle" role="status" aria-label="Loading" data-gap={gap}>
        {where.map((cell, t) => (
          <span
            key={t}
            className="loader-slide-puzzle__tile"
            data-key={t === 0 || undefined}
            style={{ transform: at(cell) }}
            aria-hidden="true"
          />
        ))}
      </div>
    </>
  );
}
