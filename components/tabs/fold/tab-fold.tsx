"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Starters', items: ['Burrata, peaches', 'Charred leeks', 'Oysters'] },
  { label: 'Mains', items: ['Hake, brown butter', 'Lamb shoulder', 'Mushroom risotto'] },
  { label: 'Dessert', items: ['Olive oil cake', 'Plum sorbet'] },
];

const css = `
  @keyframes tabs-fold-open { from { transform: perspective(600px) rotateX(-88deg); } 70% { transform: perspective(600px) rotateX(8deg); } to { transform: perspective(600px) rotateX(0deg); } }
  @keyframes tabs-fold-shade { from { opacity: 0.7; } to { opacity: 0; } }
  .tabs-fold { width: 250px; }
  .tabs-fold__list { display: grid; grid-template-columns: repeat(3, 1fr); padding: 4px; border-radius: 12px 12px 0 0; background: light-dark(#ebedf0, #232529); }
  .tabs-fold__tab { padding: 7px 0; border: 0; border-radius: 8px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
  .tabs-fold__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-fold__tab[aria-selected='true'] { background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); }
  .tabs-fold__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-fold__panel { position: relative; padding: 12px 16px 14px; border-radius: 0 0 12px 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); transform-origin: 50% 0; }
  .tabs-fold__panel::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(color-mix(in oklab, light-dark(#fbfcfd, #121417) 70%, transparent), transparent); opacity: 0; pointer-events: none; }
  .tabs-fold[data-armed] .tabs-fold__panel { animation: tabs-fold-open 0.55s cubic-bezier(0.3, 1.1, 0.5, 1); }
  .tabs-fold[data-armed] .tabs-fold__panel::after { animation: tabs-fold-shade 0.45s ease-out; }
  .tabs-fold__item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font-size: 12.5px; }
  .tabs-fold__item:last-child { border-bottom: 0; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-fold__panel, .tabs-fold__panel::after { animation: none !important; }
  }
`;

export function FoldTabs() {
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
      <div className="tabs-fold" data-armed={armed ? '' : undefined}>
        <div className="tabs-fold__list" role="tablist" aria-label="Menu" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-fold__tab"
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
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-fold__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.items.map((it) => (
              <div key={it} className="tabs-fold__item">
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
