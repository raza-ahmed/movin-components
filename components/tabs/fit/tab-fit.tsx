"use client";

import * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  {
    label: 'Profile',
    rows: [
      ['Name', 'Mira Holt'],
      ['Email', 'mira@studio.co'],
    ],
  },
  {
    label: 'Alerts',
    rows: [
      ['Mentions', 'On'],
      ['Comments', 'On'],
      ['New followers', 'Off'],
      ['Weekly digest', 'On'],
    ],
  },
  { label: 'Privacy', rows: [['Your profile is public. Drafts stay private until you publish them.', '']] },
];
const W = 240;
const COL = W / TABS.length;

const css = `
  .tabs-fit { width: ${W}px; }
  .tabs-fit__list { position: relative; display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); margin-bottom: 10px; }
  .tabs-fit__tab { border: 0; padding: 6px 0 9px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.25s; }
  .tabs-fit__tab:hover, .tabs-fit__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-fit__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-fit__line { position: absolute; bottom: 0; height: 2px; border-radius: 1px; background: light-dark(#373a40, #f1f2f3); transition: left 0.35s cubic-bezier(0.3, 1.2, 0.5, 1); }
  /* The box eases to the height of whatever it holds, so the page below moves smoothly too. */
  .tabs-fit__box { position: relative; overflow: hidden; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: height 0.4s cubic-bezier(0.3, 1.1, 0.4, 1); }
  .tabs-fit__panel { padding: 6px 12px; }
  .tabs-fit__panel--out { position: absolute; left: 0; right: 0; top: 0; animation: tabs-fit-out 0.2s ease-in forwards; pointer-events: none; }
  @keyframes tabs-fit-out {
    to { opacity: 0; filter: blur(2px); }
  }
  .tabs-fit__row { display: flex; justify-content: space-between; gap: 12px; padding: 7px 0; font-size: 12.5px; line-height: 1.45; color: light-dark(#50535b, #c6c8cd); animation: tabs-fit-row 0.35s ease-out backwards; }
  .tabs-fit__row + .tabs-fit__row { border-top: 1px solid light-dark(#ebedf0, #232529); }
  .tabs-fit__row b { font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .tabs-fit__panel--out .tabs-fit__row { animation: none; }
  @keyframes tabs-fit-row {
    from { opacity: 0; transform: translateY(4px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-fit__box, .tabs-fit__line { transition: none; }
    .tabs-fit__row { animation: none; }
    .tabs-fit__panel--out { display: none; }
  }
`;

export function FitTabs() {
  const id = useId();
  const [s, setS] = useState({ sel: 0, out: -1 });
  const [h, setH] = useState<number | undefined>(undefined);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Measure the new panel before paint and hand that height to the box to ease towards.
  useLayoutEffect(() => {
    setH(panels.current[s.sel]!.offsetHeight);
  }, [s.sel]);

  const pick = (i: number) => {
    if (i === s.sel) return;
    setS({ sel: i, out: s.sel });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setS((o) => ({ ...o, out: -1 })), 220);
  };
  const n = TABS.length;
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
      <div className="tabs-fit">
        <div className="tabs-fit__list" role="tablist" aria-label="Settings" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-fit__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={s.sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={s.sel === i ? 0 : -1}
              onClick={() => pick(i)}
            >
              {t.label}
            </button>
          ))}
          <span className="tabs-fit__line" style={{ left: s.sel * COL + 16, width: COL - 32 }} aria-hidden="true" />
        </div>
        <div className="tabs-fit__box" style={{ height: h }}>
          {TABS.map((t, i) => (
            <div
              key={t.label}
              ref={(el) => {
                panels.current[i] = el;
              }}
              className={`tabs-fit__panel${i === s.out ? ' tabs-fit__panel--out' : ''}`}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              aria-hidden={i === s.out || undefined}
              hidden={i !== s.sel && i !== s.out}
            >
              {t.rows.map(([k, v], r) => (
                <div key={k} className="tabs-fit__row" style={{ animationDelay: `${r * 45}ms` }}>
                  {k}
                  {v && <b>{v}</b>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
