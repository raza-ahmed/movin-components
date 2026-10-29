"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from 'react';

const css = `
  .btn-dot-matrix {
    display: inline-block;
    padding: 12px 14px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    cursor: pointer;
    box-shadow: inset 0 2px 10px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4));
    transition: border-color 0.3s ease;
  }
  .btn-dot-matrix:hover { border-color: light-dark(#6d7179, #7d8087); }
  .btn-dot-matrix:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-dot-matrix__grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), 4px);
    grid-auto-rows: 4px;
    gap: 2px;
  }
  .btn-dot-matrix__dot {
    border-radius: 50%;
    background: light-dark(#ebedf0, #232529);
  }
  .btn-dot-matrix__dot[data-on] {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 4px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 70%, transparent);
  }
`;

// 5x7 glyphs, one string of five bits per row.
const FONT: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  '>': ['01000', '00100', '00010', '00001', '00010', '00100', '01000'],
  ' ': ['000', '000', '000', '000', '000', '000', '000'],
};

/** A message as columns of 7 bits, one blank column between glyphs. */
function columns(text: string): boolean[][] {
  const cols: boolean[][] = [];
  for (const ch of text) {
    const g = FONT[ch];
    for (let c = 0; c < g[0].length; c++) cols.push(g.map((row) => row[c] === '1'));
    cols.push(Array(7).fill(false));
  }
  return cols;
}

const VISIBLE = 37;
const WORD = columns('LAUNCH');
const LOOP = columns('LAUNCH >> ');
const PAD = Math.floor((VISIBLE - WORD.length + 1) / 2);

export function DotMatrixButton() {
  const [offset, setOffset] = useState<number | null>(null);
  const timer = useRef(0);
  useEffect(() => () => clearInterval(timer.current), []);

  const lit = useMemo(() => {
    const grid: boolean[] = [];
    // At rest: the word, centred. Scrolling: the looped message from `offset`.
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < VISIBLE; c++) {
        grid.push(offset === null ? (WORD[c - PAD]?.[r] ?? false) : LOOP[(c + offset) % LOOP.length][r]);
      }
    return grid;
  }, [offset]);

  const start = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(timer.current);
    // Start where the resting word already sits, so the first frame doesn't jump.
    let o = (LOOP.length - PAD) % LOOP.length;
    setOffset(o);
    timer.current = window.setInterval(() => setOffset((o = (o + 1) % LOOP.length)), 70);
  };
  const stop = () => {
    clearInterval(timer.current);
    setOffset(null);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-dot-matrix"
        aria-label="Launch"
        onPointerEnter={start}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        <span className="btn-dot-matrix__grid" style={{ '--cols': VISIBLE } as React.CSSProperties} aria-hidden="true">
          {lit.map((on, i) => (
            <span key={i} className="btn-dot-matrix__dot" data-on={on || undefined} />
          ))}
        </span>
      </button>
    </>
  );
}
