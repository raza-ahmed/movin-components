"use client";

import { useEffect, useState } from 'react';

const css = `
  .card-bento { position: relative; width: 236px; height: 176px; }
  .card-bento__tile {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    border-radius: 14px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    transition:
      left 0.65s cubic-bezier(0.65, 0, 0.35, 1),
      top 0.65s cubic-bezier(0.65, 0, 0.35, 1),
      width 0.65s cubic-bezier(0.65, 0, 0.35, 1),
      height 0.65s cubic-bezier(0.65, 0, 0.35, 1);
  }
  .card-bento__tile small { color: light-dark(#5f626a, #a7abb2); font-size: 10px; }
  .card-bento__tile b { color: light-dark(#373a40, #f1f2f3); font-size: 16px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
  .card-bento__tile--hero { background: linear-gradient(135deg, light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529)); }
  .card-bento__tile--hero small { color: light-dark(#42454c, #e5e6e9); }
  @media (prefers-reduced-motion: reduce) { .card-bento__tile { transition: none; } }
`;

// Layouts on a 3 x 3 grid as [col, row, colSpan, rowSpan] per tile, in tile order.
const LAYOUTS: [number, number, number, number][][] = [
  [[0, 0, 2, 2], [2, 0, 1, 1], [2, 1, 1, 2], [0, 2, 2, 1]],
  [[1, 0, 2, 2], [0, 0, 1, 2], [0, 2, 1, 1], [1, 2, 2, 1]],
  [[0, 1, 2, 2], [0, 0, 2, 1], [2, 0, 1, 2], [2, 2, 1, 1]],
  [[1, 1, 2, 2], [0, 2, 1, 1], [0, 0, 1, 2], [1, 0, 2, 1]],
];
const TILES = [
  { k: 'Revenue', v: '$48.2k', hero: true },
  { k: 'Users', v: '9.1k' },
  { k: 'Uptime', v: '99.98%' },
  { k: 'Response', v: '182 ms' },
];
const GAP = 6;
const CW = (236 - GAP * 2) / 3;
const CH = (176 - GAP * 2) / 3;

export function BentoCard() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setN((v) => (v + 1) % LAYOUTS.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-bento" role="group" aria-label="Dashboard summary">
        {TILES.map((t, i) => {
          const [c, r, cs, rs] = LAYOUTS[n][i];
          return (
            <div
              key={t.k}
              className={`card-bento__tile${t.hero ? ' card-bento__tile--hero' : ''}`}
              style={{
                left: c * (CW + GAP),
                top: r * (CH + GAP),
                width: cs * CW + (cs - 1) * GAP,
                height: rs * CH + (rs - 1) * GAP,
              }}
            >
              <small>{t.k}</small>
              <b>{t.v}</b>
            </div>
          );
        })}
      </div>
    </>
  );
}
