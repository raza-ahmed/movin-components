"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'Dawn', body: 'Soft greys and a cool, quiet light.' },
  { label: 'Noon', body: 'Hard edges, bright paper, short shadows.' },
  { label: 'Dusk', body: 'Long shadows and a warm, low glow.' },
];

const css = `
  @keyframes tabs-wash-bloom-a { 0% { transform: scale(0.3, 0.5); opacity: 0; } 60% { opacity: 1; } 100% { transform: none; opacity: 1; } }
  @keyframes tabs-wash-bloom-b { 0% { transform: scale(0.3, 0.5); opacity: 0; } 60% { opacity: 1; } 100% { transform: none; opacity: 1; } }
  .tabs-wash { display: grid; gap: 14px; width: 234px; }
  .tabs-wash__list { position: relative; display: flex; }
  .tabs-wash__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-wash__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  .tabs-wash__tab { position: relative; z-index: 1; width: 78px; height: 44px; color: light-dark(#5f626a, #a7abb2); font-size: 14px; font-weight: 500; transition: color 0.3s; }
  .tabs-wash__tab[aria-selected='true'] { color: light-dark(#fbfcfd, #121417); }
  /* The wash: a soft blot whose edge is roughened by noise, so it reads as paint soaked into paper. */
  .tabs-wash__wash { position: absolute; top: 2px; left: calc(var(--i) * 78px + 2px); width: 74px; height: 40px; pointer-events: none; transition: left 0.5s cubic-bezier(0.5, 0, 0.3, 1); }
  .tabs-wash__wash svg { width: 100%; height: 100%; overflow: visible; }
  .tabs-wash__wash ellipse { fill: light-dark(#42454c, #e5e6e9); }
  .tabs-wash__wash .tabs-wash__edge { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; opacity: 0.6; }
  .tabs-wash[data-flip='a'] .tabs-wash__wash svg { animation: tabs-wash-bloom-a 0.7s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .tabs-wash[data-flip='b'] .tabs-wash__wash svg { animation: tabs-wash-bloom-b 0.7s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .tabs-wash__panel { color: light-dark(#50535b, #c6c8cd); font-size: 13px; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-wash__wash { transition: none; }
    .tabs-wash__wash svg { animation: none !important; }
  }
`;

export function WashTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, prev: -1, flip: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, prev, flip } = state;
  const select = (i: number) => {
    if (i !== sel) setState((s) => ({ sel: i, prev: s.sel, flip: s.flip + 1 }));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = ITEMS.length;
    const next = ({ ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };
  const filter = `tabs-wash-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="tabs-wash"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev } as React.CSSProperties}
      >
        <div className="tabs-wash__list" role="tablist" aria-label="Palette" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-wash__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              {t.label}
            </button>
          ))}
          <span className="tabs-wash__wash" aria-hidden="true">
            <svg viewBox="0 0 74 40">
              <defs>
                <filter id={filter} x="-20%" y="-30%" width="140%" height="160%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="7" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
                </filter>
              </defs>
              <g filter={`url(#${filter})`}>
                <ellipse cx="37" cy="20" rx="33" ry="15" />
                <ellipse className="tabs-wash__edge" cx="37" cy="20" rx="33" ry="15" />
              </g>
            </svg>
          </span>
        </div>
        {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-wash__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
