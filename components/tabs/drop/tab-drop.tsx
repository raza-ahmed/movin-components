"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const RANGES = [
  { label: 'Day', value: '1,204', note: 'visits today', bars: [30, 50, 42, 70, 64, 90, 76] },
  { label: 'Week', value: '8,630', note: 'visits this week', bars: [60, 84, 70, 66, 92, 48, 40] },
  { label: 'Month', value: '34.9k', note: 'visits this month', bars: [40, 52, 66, 58, 74, 88, 96] },
];

const css = `
  .tabs-drop { width: 240px; }
  .tabs-drop__list { display: flex; gap: 4px; margin-bottom: 10px; padding: 3px; border-radius: 10px; background: light-dark(#ebedf0, #232529); }
  .tabs-drop__tab { flex: 1; height: 26px; border: 0; border-radius: 7px; background: none; color: light-dark(#50535b, #c6c8cd); font: inherit; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
  .tabs-drop__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-drop__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .tabs-drop__box { position: relative; height: 104px; border-radius: 14px; overflow: hidden; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .tabs-drop__panel { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: space-between; padding: 14px; }
  .tabs-drop__panel[hidden] { display: none; }
  .tabs-drop__value { display: block; font-size: 26px; font-weight: 700; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; }
  .tabs-drop__note { font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .tabs-drop__bars { display: flex; align-items: flex-end; gap: 3px; height: 56px; }
  .tabs-drop__bars span { width: 7px; border-radius: 2px; background: light-dark(#6d7179, #7d8087); }
  .tabs-drop__bars span:last-child { background: light-dark(#373a40, #f1f2f3); }
  /* The new panel drops in from above and bounces to rest; the old one falls out of the bottom, tipping. */
  .tabs-drop__panel--in { animation: tabs-drop-in 0.75s 0.08s backwards; }
  @keyframes tabs-drop-in {
    from { transform: translateY(-115%); animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.5); }
    52% { transform: translateY(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
    68% { transform: translateY(-11%); animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.5); }
    82% { transform: translateY(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
    91% { transform: translateY(-3%); animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.5); }
    to { transform: translateY(0); }
  }
  .tabs-drop__panel--out { animation: tabs-drop-out 0.42s cubic-bezier(0.5, 0, 0.9, 0.5) forwards; pointer-events: none; }
  @keyframes tabs-drop-out {
    to { transform: translateY(125%) rotate(8deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-drop__panel--in { animation: none; }
    .tabs-drop__panel--out { display: none; }
  }
`;

export function DropTabs() {
  const id = useId();
  const [s, setS] = useState({ sel: 0, out: -1, gen: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const pick = (i: number) => {
    if (i === s.sel) return;
    setS({ sel: i, out: s.sel, gen: s.gen + 1 });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setS((o) => ({ ...o, out: -1 })), 450);
  };
  const n = RANGES.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (s.sel + 1) % n, ArrowLeft: (s.sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    pick(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-drop">
        <div className="tabs-drop__list" role="tablist" aria-label="Range" onKeyDown={onKeyDown}>
          {RANGES.map((r, i) => (
            <button
              key={r.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-drop__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={s.sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={s.sel === i ? 0 : -1}
              onClick={() => pick(i)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="tabs-drop__box">
          {RANGES.map((r, i) => (
            <div
              key={i === s.sel || i === s.out ? `${i}-${s.gen}` : i}
              className={`tabs-drop__panel${i === s.sel && s.gen ? ' tabs-drop__panel--in' : ''}${i === s.out ? ' tabs-drop__panel--out' : ''}`}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              aria-hidden={i === s.out || undefined}
              hidden={i !== s.sel && i !== s.out}
            >
              <div>
                <span className="tabs-drop__value">{r.value}</span>
                <span className="tabs-drop__note">{r.note}</span>
              </div>
              <div className="tabs-drop__bars" aria-hidden="true">
                {r.bars.map((h, k) => (
                  <span key={k} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
