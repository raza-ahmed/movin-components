"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'Day', body: 'Hour by hour, with travel time between events.' },
  { label: 'Week', body: 'Seven columns, today outlined.' },
  { label: 'Month', body: 'The whole month at a glance, busy days shaded.' },
];

const css = `
  @keyframes tabs-lens-stretch-a { 0% { transform: scaleX(1); } 35% { transform: scaleX(1.35) scaleY(0.88); } 70% { transform: scaleX(0.94) scaleY(1.04); } 100% { transform: none; } }
  @keyframes tabs-lens-stretch-b { 0% { transform: scaleX(1); } 35% { transform: scaleX(1.35) scaleY(0.88); } 70% { transform: scaleX(0.94) scaleY(1.04); } 100% { transform: none; } }
  .tabs-lens { display: grid; gap: 14px; width: 246px; }
  .tabs-lens__list { position: relative; display: flex; padding: 5px; border-radius: 999px; background: repeating-linear-gradient(115deg, light-dark(#ebedf0, #232529) 0 6px, light-dark(#f3f4f7, #1a1c1f) 6px 12px); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), inset 0 2px 6px light-dark(rgba(0, 0, 0, 0.11), rgba(0, 0, 0, 0.35)); }
  .tabs-lens__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-lens__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  .tabs-lens__tab { position: relative; z-index: 1; flex: 1; height: 36px; border-radius: 999px; color: light-dark(#50535b, #c6c8cd); font-size: 13.5px; font-weight: 500; transition: color 0.3s; }
  .tabs-lens__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  /* The glass: blurs and brightens what is under it, a bright rim on top and a soft one below. */
  .tabs-lens__glass {
    position: absolute;
    top: 5px;
    bottom: 5px;
    left: calc(5px + var(--i) * (100% - 10px) / 3);
    width: calc((100% - 10px) / 3);
    border-radius: 999px;
    background: color-mix(in oklab, light-dark(#6d7179, #7d8087) 22%, transparent);
    -webkit-backdrop-filter: blur(3px) brightness(1.25) saturate(1.4);
    backdrop-filter: blur(3px) brightness(1.25) saturate(1.4);
    box-shadow: inset 0 1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 55%, transparent), inset 0 -1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 18%, transparent), inset 0 0 0 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 14%, transparent), 0 6px 14px -6px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    pointer-events: none;
    transition: left 0.55s cubic-bezier(0.3, 1.3, 0.5, 1);
  }
  .tabs-lens[data-flip='a'] .tabs-lens__glass { animation: tabs-lens-stretch-a 0.55s ease-out; }
  .tabs-lens[data-flip='b'] .tabs-lens__glass { animation: tabs-lens-stretch-b 0.55s ease-out; }
  .tabs-lens__panel { color: light-dark(#50535b, #c6c8cd); font-size: 13px; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-lens__glass { transition: none; animation: none !important; }
  }
`;

export function LensTabs() {
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
        className="tabs-lens"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev } as React.CSSProperties}
      >
        <div className="tabs-lens__list" role="tablist" aria-label="View" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-lens__tab"
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
          <span className="tabs-lens__glass" aria-hidden="true" />
        </div>
        {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-lens__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
