"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Today', lines: ['Call the printer', 'Send invoice', 'Water plants'] },
  { label: 'Week', lines: ['Draft the talk', 'Book the venue', 'Team lunch'] },
  { label: 'Later', lines: ['Learn to sail', 'Fix the bike'] },
];

const css = `
  @keyframes tabs-sticky-settle { 0% { transform: rotate(-3deg) translateY(-4px); opacity: 0.4; } 60% { transform: rotate(1deg); } 100% { transform: none; } }
  .tabs-sticky { position: relative; width: 230px; padding-top: 38px; }
  .tabs-sticky__list { position: absolute; left: 18px; top: 0; display: flex; gap: 6px; }
  .tabs-sticky__tab {
    width: 58px;
    height: 40px;
    padding: 6px 0 0;
    border: 0;
    border-radius: 3px 3px 0 0;
    background: var(--tabs-sticky-c);
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    vertical-align: top;
    cursor: pointer;
    transform: translateY(8px);
    transition: transform 0.35s cubic-bezier(0.3, 1.7, 0.5, 1), filter 0.2s;
    filter: brightness(0.85);
  }
  .tabs-sticky__tab:hover { transform: translateY(4px); }
  .tabs-sticky__tab[aria-selected='true'] { transform: translateY(0); filter: none; }
  .tabs-sticky__tab:focus-visible { outline: 2px solid light-dark(#373a40, #f1f2f3); outline-offset: 2px; }
  .tabs-sticky__pad { position: relative; z-index: 1; height: 128px; padding: 14px 16px; border-radius: 4px; background: repeating-linear-gradient(transparent 0 23px, color-mix(in oklab, light-dark(#6d7179, #7d8087) 40%, transparent) 23px 24px) 0 12px / 100% 100% no-repeat, light-dark(#42454c, #e5e6e9); box-shadow: 0 14px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-sticky[data-armed] .tabs-sticky__panel { animation: tabs-sticky-settle 0.45s ease-out; transform-origin: 10% 0; }
  .tabs-sticky__item { display: flex; align-items: center; gap: 8px; height: 24px; color: light-dark(#f3f4f7, #1a1c1f); font-size: 12.5px; }
  .tabs-sticky__item::before { content: ''; width: 9px; height: 9px; border-radius: 2px; box-shadow: inset 0 0 0 1.5px light-dark(#dbdde1, #2e3035); }
  @media (prefers-reduced-motion: reduce) {
    .tabs-sticky__tab { transition: none; }
    .tabs-sticky__panel { animation: none !important; }
  }
`;

const SHADES = ['light-dark(#50535b, #c6c8cd)', 'light-dark(#5f626a, #a7abb2)', 'light-dark(#6d7179, #7d8087)'];

export function StickyTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    setArmed(true);
    setSel(i);
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
      <div className="tabs-sticky" data-armed={armed ? '' : undefined}>
        <div className="tabs-sticky__list" role="tablist" aria-label="To-do lists" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-sticky__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              style={{ '--tabs-sticky-c': SHADES[i] } as React.CSSProperties}
              onClick={() => select(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="tabs-sticky__pad">
          {TABS.map((t, i) => (
            <div key={t.label} className="tabs-sticky__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              {t.lines.map((l) => (
                <div key={l} className="tabs-sticky__item">
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
