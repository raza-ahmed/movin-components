"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Dawn', title: '6:12 am', body: 'First light, cool and still. Best for long shadows.' },
  { label: 'Noon', title: '12:40 pm', body: 'Hard light from overhead. Look for shade.' },
  { label: 'Dusk', title: '7:58 pm', body: 'The golden hour, soft and warm.' },
];
const SURFACES = ['light-dark(#ebedf0, #232529)', 'light-dark(#cbced3, #393c41)', 'light-dark(#dbdde1, #2e3035)'];

const css = `
  @keyframes tabs-reveal-open { from { clip-path: circle(0% at var(--tabs-reveal-x) 0%); } to { clip-path: circle(160% at var(--tabs-reveal-x) 0%); } }
  .tabs-reveal { width: 260px; }
  .tabs-reveal__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 8px; }
  .tabs-reveal__tab { padding: 8px 0; border: 0; border-radius: 8px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
  .tabs-reveal__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-reveal__tab[aria-selected='true'] { background: light-dark(#f3f4f7, #1a1c1f); color: light-dark(#373a40, #f1f2f3); }
  .tabs-reveal__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-reveal__stage { display: grid; overflow: hidden; border-radius: 12px; }
  .tabs-reveal__panel { grid-area: 1 / 1; padding: 16px; background: var(--tabs-reveal-bg); }
  .tabs-reveal__panel[data-prev] { z-index: 0; }
  .tabs-reveal__panel[data-on] { z-index: 1; }
  .tabs-reveal[data-armed] .tabs-reveal__panel[data-on] { animation: tabs-reveal-open 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .tabs-reveal__title { display: block; margin-bottom: 4px; color: light-dark(#373a40, #f1f2f3); font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
  .tabs-reveal__body { color: light-dark(#42454c, #e5e6e9); font-size: 12.5px; line-height: 1.5; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-reveal__panel { animation: none !important; }
  }
`;

export function RevealTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, prev: -1 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, prev } = state;
  const select = (i: number) => {
    if (i !== sel) setState({ sel: i, prev: sel });
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
      <div
        className="tabs-reveal"
        data-armed={prev >= 0 ? '' : undefined}
        style={{ '--tabs-reveal-x': `${((sel + 0.5) / TABS.length) * 100}%` } as React.CSSProperties}
      >
        <div className="tabs-reveal__list" role="tablist" aria-label="Light" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-reveal__tab"
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
        <div className="tabs-reveal__stage">
          {/* The panel you left stays underneath, out of reach, while the new one opens over it. */}
          {TABS.map((t, i) => (
            <div
              key={t.label}
              className="tabs-reveal__panel"
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              hidden={i !== sel && i !== prev}
              aria-hidden={i === prev || undefined}
              inert={i === prev}
              data-on={i === sel ? '' : undefined}
              data-prev={i === prev ? '' : undefined}
              style={{ '--tabs-reveal-bg': SURFACES[i] } as React.CSSProperties}
            >
              <span className="tabs-reveal__title">{t.title}</span>
              <span className="tabs-reveal__body">{t.body}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
