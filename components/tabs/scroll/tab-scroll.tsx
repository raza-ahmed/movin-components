"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'I', title: 'On bread', body: 'Every street shall have one good bakery.' },
  { label: 'II', title: 'On rest', body: 'Sundays belong to long lunches and naps.' },
  { label: 'III', title: 'On music', body: 'The square shall have a piano, always tuned.' },
];

const css = `
  @keyframes tabs-scroll-unroll { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
  @keyframes tabs-scroll-roll { from { transform: translateY(-96px); } to { transform: none; } }
  .tabs-scroll { display: grid; justify-items: center; gap: 12px; width: 240px; }
  .tabs-scroll__list { display: flex; gap: 6px; }
  .tabs-scroll__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-scroll__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  .tabs-scroll__tab { width: 40px; height: 32px; border-radius: 16px; color: light-dark(#5f626a, #a7abb2); font-family: Georgia, 'Times New Roman', serif; font-size: 14px; box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: background-color 0.2s, color 0.2s; }
  .tabs-scroll__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); box-shadow: none; }
  .tabs-scroll__stage { position: relative; width: 200px; }
  .tabs-scroll__rod { position: relative; z-index: 1; height: 10px; margin: 0 -8px; border-radius: 5px; background: linear-gradient(light-dark(#5f626a, #a7abb2), light-dark(#cbced3, #393c41)); box-shadow: 0 3px 6px -2px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); }
  .tabs-scroll__rod::before, .tabs-scroll__rod::after { content: ''; position: absolute; top: -2px; width: 8px; height: 14px; border-radius: 3px; background: light-dark(#50535b, #c6c8cd); }
  .tabs-scroll__rod::before { left: -4px; }
  .tabs-scroll__rod::after { right: -4px; }
  .tabs-scroll__panel { display: grid; justify-items: center; gap: 6px; height: 96px; padding: 14px 16px; background: linear-gradient(90deg, light-dark(#ebedf0, #232529), light-dark(#f3f4f7, #1a1c1f) 15%, light-dark(#f3f4f7, #1a1c1f) 85%, light-dark(#ebedf0, #232529)); color: light-dark(#50535b, #c6c8cd); font-family: Georgia, 'Times New Roman', serif; font-size: 12.5px; font-style: italic; line-height: 1.45; text-align: center; }
  .tabs-scroll__panel[hidden] { display: none; }
  .tabs-scroll__panel b { color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-style: normal; font-weight: 400; letter-spacing: 0.04em; }
  .tabs-scroll__roll { position: absolute; left: -8px; right: -8px; bottom: -5px; height: 10px; border-radius: 5px; background: linear-gradient(light-dark(#5f626a, #a7abb2), light-dark(#cbced3, #393c41)); box-shadow: 0 3px 6px -2px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); }
  .tabs-scroll[data-armed] .tabs-scroll__panel { animation: tabs-scroll-unroll 0.7s cubic-bezier(0.4, 0, 0.3, 1) both; }
  .tabs-scroll[data-armed] .tabs-scroll__roll { animation: tabs-scroll-roll 0.7s cubic-bezier(0.4, 0, 0.3, 1) both; }
  .tabs-scroll[data-flip='b'] .tabs-scroll__roll { animation-name: tabs-scroll-roll-b; }
  @keyframes tabs-scroll-roll-b { from { transform: translateY(-96px); } to { transform: none; } }
  @media (prefers-reduced-motion: reduce) {
    .tabs-scroll__panel, .tabs-scroll__roll { animation: none !important; }
  }
`;

export function ScrollTabs() {
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
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="tabs-scroll"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev } as React.CSSProperties}
      >
        <div className="tabs-scroll__list" role="tablist" aria-label="Decrees" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-scroll__tab"
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
        <div className="tabs-scroll__stage">
          <div className="tabs-scroll__rod" aria-hidden="true" />
          {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-scroll__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <b>{t.title}</b>
            {t.body}
          </div>
        ))}
          <span className="tabs-scroll__roll" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
