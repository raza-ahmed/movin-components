"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Menu', body: 'Five courses from the market, changing with the week.' },
  { label: 'Wine', body: 'Natural wines by the glass, and a short list of old vintages.' },
  { label: 'Dessert', body: 'Burnt honey tart, poached quince and a cheese from the Jura.' },
];
// Drawn in a 112 by 18 box and stretched to each word: a long sweep, a small loop, and a flick.
const SWASH = 'M2 7C22 12 58 2.5 90 7.5C98 8.8 103 13.5 97 15.4 90.5 17.4 87 10 99 6.6 104 5.4 108 5.6 111 6.6';

const css = `
  .tabs-swash { width: 270px; }
  .tabs-swash__list { display: flex; justify-content: center; gap: 28px; }
  .tabs-swash__tab {
    position: relative;
    border: 0;
    padding: 4px 2px 14px;
    background: none;
    font-family: ui-serif, Georgia, 'Times New Roman', serif;
    font-size: 18px;
    font-style: italic;
    color: light-dark(#5f626a, #a7abb2);
    cursor: pointer;
    transition: color 0.35s;
  }
  .tabs-swash__tab:hover, .tabs-swash__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-swash__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 4px; }
  .tabs-swash__ink { position: absolute; left: -2px; top: calc(100% - 17px); width: calc(100% + 12px); height: 18px; overflow: visible; pointer-events: none; }
  .tabs-swash__ink path {
    fill: none;
    stroke: light-dark(#42454c, #e5e6e9);
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-dasharray: 1 1;
    stroke-dashoffset: 1;
    /* Leaving, it rewinds back into the start of the stroke. */
    transition: stroke-dashoffset 0.45s cubic-bezier(0.5, 0, 0.75, 0);
  }
  .tabs-swash__tab[aria-selected='true'] .tabs-swash__ink path { stroke-dashoffset: 0; transition: stroke-dashoffset 0.8s 0.15s cubic-bezier(0.35, 0, 0.25, 1); }
  .tabs-swash__panel { padding: 12px 4px 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-swash__ink path, .tabs-swash__tab[aria-selected='true'] .tabs-swash__ink path { transition: none; }
  }
`;

export function SwashTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = TABS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
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
      <div className="tabs-swash">
        <div className="tabs-swash__list" role="tablist" aria-label="Restaurant" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-swash__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {t.label}
              <svg className="tabs-swash__ink" viewBox="0 0 112 18" preserveAspectRatio="none" aria-hidden="true">
                <path d={SWASH} pathLength={1} vectorEffect="non-scaling-stroke" />
              </svg>
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-swash__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
