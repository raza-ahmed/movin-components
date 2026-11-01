"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Details', body: 'Heavyweight cotton, garment dyed and cut slightly boxy.' },
  { label: 'Shipping', body: 'Free over $80. Ships in two days from Lisbon.' },
  { label: 'Returns', body: 'Thirty days, unworn, with the tags still on.' },
];

const css = `
  .tabs-caret { width: 260px; }
  .tabs-caret__list { display: grid; grid-template-columns: repeat(3, 1fr); }
  .tabs-caret__tab { padding: 8px 0 12px; border: 0; border-radius: 6px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.2s; }
  .tabs-caret__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-caret__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-caret__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-caret__card {
    position: relative;
    padding: 14px 16px;
    border-radius: 12px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: 0 0 0 1px light-dark(#ebedf0, #232529), 0 6px 16px light-dark(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.3));
  }
  /* The pointer is a turned square in the card's colours, sliding along its top edge. */
  .tabs-caret__pointer {
    position: absolute;
    top: -6px;
    left: calc((var(--tabs-caret-i) + 0.5) * 100% / 3 - 6px);
    width: 12px;
    height: 12px;
    border-radius: 2px 0 0 0;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: -1px -1px 0 0 light-dark(#ebedf0, #232529);
    transform: rotate(45deg);
    transition: left 0.5s cubic-bezier(0.3, 1.4, 0.5, 1);
  }
  .tabs-caret__panel { min-height: calc(3.1em); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  .tabs-caret__panel > p { margin: 0; animation: tabs-caret-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
  @keyframes tabs-caret-in {
    from { opacity: 0; transform: translateX(calc(var(--tabs-caret-dir) * 14px)); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-caret__pointer { transition: none; }
    .tabs-caret__panel > p { animation: none; }
  }
`;

export function CaretTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [dir, setDir] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setDir(Math.sign(i - sel));
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
      <div className="tabs-caret" style={{ '--tabs-caret-i': sel, '--tabs-caret-dir': dir } as React.CSSProperties}>
        <div className="tabs-caret__list" role="tablist" aria-label="Product" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-caret__tab"
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
        <div className="tabs-caret__card">
          <span className="tabs-caret__pointer" aria-hidden="true" />
          {TABS.map((t, i) => (
            <div key={t.label} className="tabs-caret__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              {/* Comes in from the side you moved towards. */}
              {sel === i && <p>{t.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
