"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'World 1', body: 'Grasslands. Eight levels, a hidden pipe in the fourth.' },
  { label: 'World 2', body: 'Caverns. Low ceilings, falling rocks and one long chase.' },
  { label: 'World 3', body: 'Sky fortress. Moving platforms all the way to the boss.' },
];
const COLS = 12;
const ROWS = 2;
// A scatter that is the same on the server and in the browser.
const jitter = (c: number, r: number) => ((c * 7 + r * 5) % COLS) / COLS;

const css = `
  .tabs-blocks { width: 240px; }
  .tabs-blocks__list { display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); }
  .tabs-blocks__tab { display: grid; justify-items: center; gap: 6px; padding: 6px 0 0; border: 0; background: none; font: inherit; font-size: 12.5px; font-weight: 600; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-blocks__tab:hover, .tabs-blocks__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-blocks__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-blocks__bed { display: grid; grid-template-columns: repeat(${COLS}, 5px); grid-auto-rows: 5px; gap: 1px; height: 11px; border-bottom: 1px solid light-dark(#ebedf0, #232529); padding-bottom: 2px; }
  .tabs-blocks__block { background: light-dark(#373a40, #f1f2f3); }
  .tabs-blocks__block--dim { background: light-dark(#50535b, #c6c8cd); }
  /* New blocks fall in and stack, bottom row first; the old ones crumble and drop away. */
  .tabs-blocks__bed--land .tabs-blocks__block { animation: tabs-blocks-land 0.42s cubic-bezier(0.5, 0, 0.75, 0) backwards; }
  @keyframes tabs-blocks-land {
    from { opacity: 0; transform: translateY(-28px); }
    70% { opacity: 1; transform: translateY(0); }
    85% { transform: translateY(-1.5px); }
  }
  .tabs-blocks__bed--crumble .tabs-blocks__block { animation: tabs-blocks-crumble 0.5s cubic-bezier(0.5, 0, 0.9, 0.5) forwards; }
  @keyframes tabs-blocks-crumble {
    to { opacity: 0; transform: translateY(18px) rotate(var(--spin)); }
  }
  .tabs-blocks__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-blocks__bed--land .tabs-blocks__block { animation: none; }
    .tabs-blocks__bed--crumble { display: none; }
  }
`;

function Bed({ mode }: { mode: 'set' | 'land' | 'crumble' }) {
  return (
    <span className={`tabs-blocks__bed tabs-blocks__bed--${mode}`} aria-hidden="true">
      {Array.from({ length: ROWS * COLS }, (_, k) => {
        const r = Math.floor(k / COLS);
        const c = k % COLS;
        const j = jitter(c, r);
        const delay = mode === 'land' ? (ROWS - 1 - r) * 140 + j * 260 : j * 160;
        return (
          <span
            key={k}
            className={`tabs-blocks__block${(c + r) % 3 === 0 ? ' tabs-blocks__block--dim' : ''}`}
            style={{ animationDelay: `${Math.round(delay)}ms`, '--spin': `${(j - 0.5) * 90}deg` } as React.CSSProperties}
          />
        );
      })}
    </span>
  );
}

export function BlocksTabs() {
  const id = useId();
  const [s, setS] = useState({ sel: 0, prev: -1, gen: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (i: number) => setS((o) => (i === o.sel ? o : { sel: i, prev: o.sel, gen: o.gen + 1 }));
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
      <div className="tabs-blocks">
        <div className="tabs-blocks__list" role="tablist" aria-label="Worlds" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-blocks__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={s.sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={s.sel === i ? 0 : -1}
              onClick={() => pick(i)}
            >
              {t.label}
              {i === s.sel ? (
                <Bed key={`${i}-${s.gen}`} mode={s.gen ? 'land' : 'set'} />
              ) : i === s.prev ? (
                <Bed key={`${i}-${s.gen}`} mode="crumble" />
              ) : (
                <span className="tabs-blocks__bed" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-blocks__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={s.sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
