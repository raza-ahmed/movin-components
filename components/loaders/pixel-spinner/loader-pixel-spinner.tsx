"use client";

import { useEffect, useState } from 'react';

const css = `
  .loader-pixel-spinner {
    display: grid;
    grid-template-columns: repeat(11, 7px);
    grid-auto-rows: 7px;
    gap: 1px;
  }
  .loader-pixel-spinner__px { background: transparent; }
  .loader-pixel-spinner__px[data-ring] { background: light-dark(#ebedf0, #232529); }
  .loader-pixel-spinner__px[data-lit='3'] { background: light-dark(#373a40, #f1f2f3); }
  .loader-pixel-spinner__px[data-lit='2'] { background: light-dark(#50535b, #c6c8cd); }
  .loader-pixel-spinner__px[data-lit='1'] { background: light-dark(#6d7179, #7d8087); }
`;

const N = 11;
const C = (N - 1) / 2;
// The ring: every pixel whose centre lies between radius 3.4 and 5.1, ordered by angle.
const RING = Array.from({ length: N * N }, (_, i) => i)
  .filter((i) => {
    const d = Math.hypot((i % N) - C, Math.floor(i / N) - C);
    return d > 3.4 && d < 5.1;
  })
  .sort((a, b) => {
    const ang = (i: number) => Math.atan2(Math.floor(i / N) - C, (i % N) - C);
    return ang(a) - ang(b);
  });
const ON_RING = new Set(RING);
const TAIL = 5;

export function PixelSpinnerLoader() {
  const [head, setHead] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setHead((h) => (h + 1) % RING.length), 55);
    return () => clearInterval(id);
  }, []);

  // Brightness by distance behind the head: 3 for the head, fading to 1 at the tail.
  const lit = new Map<number, number>();
  for (let k = 0; k < TAIL; k++) lit.set(RING[(head - k + RING.length) % RING.length], k < 2 ? 3 : k < 4 ? 2 : 1);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-pixel-spinner" role="status" aria-label="Loading">
        {Array.from({ length: N * N }, (_, i) => (
          <span
            key={i}
            className="loader-pixel-spinner__px"
            data-ring={ON_RING.has(i) || undefined}
            data-lit={lit.get(i)}
            aria-hidden="true"
          />
        ))}
      </div>
    </>
  );
}
