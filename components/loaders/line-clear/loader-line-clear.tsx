"use client";

import { useEffect, useState } from 'react';

const css = `
  .loader-line-clear {
    display: grid;
    grid-template-columns: repeat(6, 10px);
    grid-auto-rows: 10px;
    gap: 2px;
    padding: 5px;
    border-radius: 6px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .loader-line-clear__cell { border-radius: 2px; background: light-dark(#f3f4f7, #1a1c1f); }
  .loader-line-clear__cell[data-s='set'] { background: light-dark(#5f626a, #a7abb2); }
  .loader-line-clear__cell[data-s='live'] { background: light-dark(#373a40, #f1f2f3); }
  .loader-line-clear__cell[data-s='flash'] { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px light-dark(#373a40, #f1f2f3); }
`;

const W = 6;
const H = 9;
type Cell = '' | 'set' | 'live' | 'flash';

// Pieces as [col, row] cells relative to their top-left, each dropped at column `x`.
// Together they fill the bottom two rows exactly, so the board clears back to empty.
const PIECES: { cells: [number, number][]; x: number }[] = [
  { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], x: 0 }, // J
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], x: 4 }, // O
  { cells: [[0, 0], [1, 0], [2, 0], [2, 1]], x: 1 }, // L, dropping its foot into the last gap
];

/** Every frame of one round: each piece falling cell by cell, then the full rows flashing and clearing. */
function frames(): Cell[][] {
  const board: Cell[] = Array(W * H).fill('');
  const out: Cell[][] = [];
  const fits = (cells: [number, number][], x: number, y: number) =>
    cells.every(([cx, cy]) => y + cy < H && !board[(y + cy) * W + x + cx]);
  for (const p of PIECES) {
    let y = 0;
    while (fits(p.cells, p.x, y + 1)) {
      const f = board.slice();
      p.cells.forEach(([cx, cy]) => (f[(y + cy) * W + p.x + cx] = 'live'));
      out.push(f);
      y += 1;
    }
    p.cells.forEach(([cx, cy]) => (board[(y + cy) * W + p.x + cx] = 'set'));
    out.push(board.slice());
  }
  const full = Array.from({ length: H }, (_, r) => r).filter((r) => board.slice(r * W, r * W + W).every(Boolean));
  for (let k = 0; k < 4; k++) {
    const f = board.slice();
    if (k % 2 === 0) full.forEach((r) => f.fill('flash', r * W, r * W + W));
    out.push(f);
  }
  // Clear: drop whatever sits above the cleared rows, then a beat of rest.
  const kept = Array.from({ length: H }, (_, r) => r).filter((r) => !full.includes(r));
  const after: Cell[] = Array(W * H).fill('');
  kept.reverse().forEach((r, i) => after.splice((H - 1 - i) * W, W, ...board.slice(r * W, r * W + W)));
  out.push(after, after, after);
  return out;
}

const FRAMES = frames();

export function LineClearLoader() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % FRAMES.length), 85);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-line-clear" role="status" aria-label="Loading">
        {FRAMES[i].map((s, k) => (
          <span key={k} className="loader-line-clear__cell" data-s={s || undefined} aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
