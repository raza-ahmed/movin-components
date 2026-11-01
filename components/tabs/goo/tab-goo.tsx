"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Daily', body: '4,210 visits today, 8% more than the same day last week.' },
  { label: 'Weekly', body: '27,940 visits this week, with Tuesday the busiest day.' },
  { label: 'Monthly', body: '112,300 visits in October, a new record for the site.' },
];

const css = `
  .tabs-goo { width: 260px; }
  .tabs-goo__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); padding: 4px; border-radius: 20px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .tabs-goo__liquid { position: absolute; inset: 4px; pointer-events: none; }
  .tabs-goo__blob {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--tabs-goo-i) * 100% / 3);
    width: calc(100% / 3);
    border-radius: 16px;
    background: light-dark(#373a40, #f1f2f3);
    transition: left 0.6s cubic-bezier(0.5, 0, 0.15, 1);
  }
  /* Two thinner drops trail the pill; the filter joins all three into one stretching body. */
  .tabs-goo__blob:nth-child(2) { top: 4px; bottom: 4px; transition-delay: 0.07s; }
  .tabs-goo__blob:nth-child(3) { top: 8px; bottom: 8px; transition-delay: 0.14s; }
  .tabs-goo__tab { position: relative; height: 32px; border: 0; border-radius: 16px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.2s; }
  .tabs-goo__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-goo__tab[aria-selected='true'] { color: light-dark(#fbfcfd, #121417); transition-delay: 0.18s; }
  .tabs-goo__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-goo__panel { padding: 14px 6px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-goo__blob, .tabs-goo__tab { transition: none !important; }
  }
`;

export function GooTabs() {
  const id = useId();
  const filter = `tabs-goo-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-goo" style={{ '--tabs-goo-i': sel } as React.CSSProperties}>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id={filter} x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
          </filter>
        </svg>
        <div className="tabs-goo__list" role="tablist" aria-label="Visits" onKeyDown={onKeyDown}>
          <span className="tabs-goo__liquid" style={{ filter: `url(#${filter})` }} aria-hidden="true">
            <span className="tabs-goo__blob" />
            <span className="tabs-goo__blob" />
            <span className="tabs-goo__blob" />
          </span>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-goo__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-goo__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
