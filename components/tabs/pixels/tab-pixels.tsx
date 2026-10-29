"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Level 1', title: 'Green Hills', body: 'Collect the stars before the sun sets.' },
  { label: 'Level 2', title: 'Ice Caves', body: 'Mind the slippery floors and falling icicles.' },
  { label: 'Level 3', title: 'Sky Castle', body: 'The last climb. Save your double jump.' },
];
// 10 x 4 tiles, each with a scrambled start so they clear in a scattered order.
const TILES = Array.from({ length: 40 }, (_, k) => ({ k, order: (k * 17 + 7) % 40 }));

const css = `
  @keyframes tabs-pixels-clear-a { from { opacity: 1; } to { opacity: 0; } }
  @keyframes tabs-pixels-clear-b { from { opacity: 1; } to { opacity: 0; } }
  .tabs-pixels { width: 250px; }
  .tabs-pixels__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 10px; }
  .tabs-pixels__tab { padding: 7px 0; border: 0; border-radius: 4px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529), 0 2px 0 light-dark(#fbfcfd, #121417); color: light-dark(#5f626a, #a7abb2); font: inherit; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-weight: 600; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
  .tabs-pixels__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-pixels__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-pixels__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-pixels__screen { position: relative; height: 100px; overflow: hidden; border-radius: 6px; background: light-dark(#ebedf0, #232529); }
  .tabs-pixels__panel { padding: 16px; }
  .tabs-pixels__title { display: block; margin-bottom: 6px; color: light-dark(#373a40, #f1f2f3); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 15px; font-weight: 600; letter-spacing: 0.04em; }
  .tabs-pixels__body { color: light-dark(#50535b, #c6c8cd); font-size: 12.5px; line-height: 1.5; }
  .tabs-pixels__tiles { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(4, 1fr); pointer-events: none; }
  .tabs-pixels__tile { background: light-dark(#f3f4f7, #1a1c1f); opacity: 0; }
  .tabs-pixels[data-flip='a'] .tabs-pixels__tile { animation: tabs-pixels-clear-a 0.12s steps(2, jump-none) backwards; animation-delay: calc(var(--o) * 11ms); }
  .tabs-pixels[data-flip='b'] .tabs-pixels__tile { animation: tabs-pixels-clear-b 0.12s steps(2, jump-none) backwards; animation-delay: calc(var(--o) * 11ms); }
  @media (prefers-reduced-motion: reduce) {
    .tabs-pixels__tile { animation: none !important; }
  }
`;

export function PixelsTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [flip, setFlip] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setFlip((f) => f + 1);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-pixels" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}>
        <div className="tabs-pixels__list" role="tablist" aria-label="Levels" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-pixels__tab"
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
        </div>
        <div className="tabs-pixels__screen">
          {TABS.map((t, i) => (
            <div key={t.label} className="tabs-pixels__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              <span className="tabs-pixels__title">{t.title}</span>
              <span className="tabs-pixels__body">{t.body}</span>
            </div>
          ))}
          <span className="tabs-pixels__tiles" aria-hidden="true">
            {TILES.map((t) => (
              <span key={t.k} className="tabs-pixels__tile" style={{ '--o': t.order } as React.CSSProperties} />
            ))}
          </span>
        </div>
      </div>
    </>
  );
}
