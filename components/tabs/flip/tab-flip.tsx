"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Front', title: 'Ada Park', body: 'Product designer, Seoul. Says yes to coffee.' },
  { label: 'Back', title: 'Contact', body: 'ada@example.com, +82 10 5555 0199' },
  { label: 'Notes', title: 'Met at', body: 'Config, the session on motion systems.' },
];

const css = `
  @keyframes tabs-flip-out { to { transform: rotateY(calc(var(--tabs-flip-d) * 90deg)); } }
  @keyframes tabs-flip-in { from { transform: rotateY(calc(var(--tabs-flip-d) * -90deg)); } }
  .tabs-flip { width: 250px; }
  .tabs-flip__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 10px; padding: 3px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); }
  .tabs-flip__tab { padding: 6px 0; border: 0; border-radius: 7px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
  .tabs-flip__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-flip__tab[aria-selected='true'] { background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); }
  .tabs-flip__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-flip__stage { display: grid; perspective: 700px; }
  .tabs-flip__panel { grid-area: 1 / 1; height: 96px; padding: 16px; border-radius: 14px; background: linear-gradient(150deg, light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529)); box-shadow: inset 0 1px 0 light-dark(#cbced3, #393c41), 0 14px 26px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); backface-visibility: hidden; }
  .tabs-flip__panel[data-prev] { animation: tabs-flip-out 0.22s ease-in forwards; }
  .tabs-flip[data-armed] .tabs-flip__panel[data-on] { animation: tabs-flip-in 0.32s cubic-bezier(0.3, 1.4, 0.5, 1) 0.22s backwards; }
  .tabs-flip__title { display: block; margin-bottom: 4px; color: light-dark(#373a40, #f1f2f3); font-size: 16px; font-weight: 600; }
  .tabs-flip__body { color: light-dark(#50535b, #c6c8cd); font-size: 12.5px; line-height: 1.5; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-flip__panel { animation: none !important; }
    .tabs-flip__panel[data-prev] { display: none; }
  }
`;

export function FlipTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, prev: -1, d: 1 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, prev } = state;
  const select = (i: number) => {
    if (i !== sel) setState({ sel: i, prev: sel, d: i > sel ? -1 : 1 });
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
      <div className="tabs-flip" data-armed={prev >= 0 ? '' : undefined} style={{ '--tabs-flip-d': state.d } as React.CSSProperties}>
        <div className="tabs-flip__list" role="tablist" aria-label="Contact card" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-flip__tab"
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
        <div className="tabs-flip__stage">
          {TABS.map((t, i) => (
            <div
              key={t.label}
              className="tabs-flip__panel"
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              hidden={i !== sel && i !== prev}
              aria-hidden={i === prev || undefined}
              inert={i === prev}
              data-on={i === sel ? '' : undefined}
              data-prev={i === prev ? '' : undefined}
            >
              <span className="tabs-flip__title">{t.title}</span>
              <span className="tabs-flip__body">{t.body}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
