"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Photos', body: 'Every shot from the trip, sorted by the day it was taken.' },
  { label: 'Albums', body: 'Seven albums, including the ones your friends shared.' },
  { label: 'People', body: 'Faces we found in your library, grouped and named.' },
];

const css = `
  .tabs-trace { width: 260px; }
  .tabs-trace__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .tabs-trace__tab { position: relative; padding: 9px 0; border: 0; border-radius: 9px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.25s; }
  .tabs-trace__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-trace__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-trace__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .tabs-trace__line { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .tabs-trace__line rect { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.5; stroke-dasharray: 100; stroke-dashoffset: -100; transition: stroke-dashoffset 0.45s cubic-bezier(0.5, 0, 0.3, 1); }
  .tabs-trace__line .tabs-trace__ghost { stroke: light-dark(#ebedf0, #232529); stroke-dashoffset: 0; transition: none; }
  .tabs-trace__tab[aria-selected='true'] .tabs-trace__line rect { stroke-dashoffset: 0; transition-duration: 0.6s; transition-delay: 0.1s; }
  .tabs-trace__panel { padding: 14px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-trace__line rect { transition: none !important; }
  }
`;

export function TraceTabs() {
  const id = useId();
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
      <div className="tabs-trace">
        <div className="tabs-trace__list" role="tablist" aria-label="Library" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-trace__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <svg className="tabs-trace__line" aria-hidden="true">
                <rect className="tabs-trace__ghost" width="100%" height="100%" rx="9" pathLength={100} />
                <rect width="100%" height="100%" rx="9" pathLength={100} />
              </svg>
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-trace__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
