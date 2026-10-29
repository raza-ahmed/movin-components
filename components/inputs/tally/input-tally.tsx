"use client";

import { useState } from 'react';

const css = `
  @keyframes field-tally-draw { to { stroke-dashoffset: 0; } }
  @keyframes field-tally-roll { from { transform: translateY(60%); opacity: 0; } }
  .field-tally { width: 240px; }
  .field-tally__head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .field-tally__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-tally__count { overflow: hidden; color: light-dark(#373a40, #f1f2f3); font-family: inherit; font-size: 22px; font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; }
  .field-tally__count span { display: inline-block; animation: field-tally-roll 0.25s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .field-tally__board { user-select: none; -webkit-user-select: none;
    display: block;
    width: 100%;
    height: 78px;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    cursor: pointer;
    transition: transform 0.08s;
  }
  .field-tally__board:active { transform: scale(0.98); }
  .field-tally__board:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .field-tally__board svg { display: block; width: 240px; height: 78px; }
  .field-tally__mark { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: field-tally-draw 0.18s ease-out forwards; }
  .field-tally__empty { fill: light-dark(#5f626a, #a7abb2); font-family: inherit; font-size: 12px; }
  .field-tally__foot { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .field-tally__undo { padding: 3px 8px; border: 0; border-radius: 6px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font-family: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
  .field-tally__undo:disabled { opacity: 0.4; cursor: default; }
  .field-tally__undo:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .field-tally__mark { animation: none; stroke-dashoffset: 0; } .field-tally__count span { animation: none; } }
  .field-tally__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-tally__top > :first-child { margin: 0; }
  .field-tally__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-tally__info svg { width: 14px; height: 14px; }
  .field-tally__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-tally__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-tally__info::after {
    content: attr(data-tip);
    position: absolute;
    left: -6px;
    bottom: calc(100% + 6px);
    z-index: 5;
    padding: 4px 8px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-family: inherit; font-size: 11px; font-weight: 500; line-height: 1.3;
    width: max-content;
    max-width: 150px;
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
  }
  .field-tally__info:hover::after, .field-tally__info:focus-visible::after { opacity: 1; transform: none; }
`;

const MAX_SHOWN = 30;
const jitter = (n: number, k: number) => {
  const x = Math.sin(n * 91.7 + k * 13.3) * 43758.5;
  return Math.round((x - Math.floor(x) - 0.5) * 240) / 100;
};

/** Stroke n of the tally: four uprights, then a slash across them, in groups of five. */
function mark(n: number) {
  const g = Math.floor(n / 5);
  const k = n % 5;
  const x0 = 18 + g * 36;
  if (k < 4) {
    const x = x0 + k * 7;
    return `M${x + jitter(n, 1)} ${22 + jitter(n, 2)} L${x + jitter(n, 3)} ${56 + jitter(n, 4)}`;
  }
  return `M${x0 - 5} ${50 + jitter(n, 5)} L${x0 + 27} ${28 + jitter(n, 6)}`;
}

export function TallyInput() {
  const [n, setN] = useState(7);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-tally">
        <div className="field-tally__head">
          <div className="field-tally__top">
            <span id="field-tally-label" className="field-tally__label">
              Laps
            </span>
            <button type="button" className="field-tally__info" aria-label="Tap the board to count" data-tip="Tap the board to count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
          </div>
          <span className="field-tally__count" aria-live="polite">
            <span key={n}>{n}</span>
          </span>
        </div>
        <button type="button" className="field-tally__board" aria-labelledby="field-tally-label" onClick={() => setN((c) => c + 1)}>
          <svg viewBox="0 0 240 78" aria-hidden="true">
            {n === 0 && (
              <text className="field-tally__empty" x="120" y="44" textAnchor="middle">
                Tap to count
              </text>
            )}
            {Array.from({ length: Math.min(n, MAX_SHOWN) }, (_, i) => (
              <path key={i} className="field-tally__mark" d={mark(i)} pathLength={1} />
            ))}
          </svg>
        </button>
        <div className="field-tally__foot">
          <span id="field-tally-hint">{n > MAX_SHOWN ? 'Board full, still counting' : ''}</span>
          <button type="button" className="field-tally__undo" disabled={n === 0} onClick={() => setN((c) => Math.max(0, c - 1))}>
            Undo
          </button>
        </div>
      </div>
    </>
  );
}
