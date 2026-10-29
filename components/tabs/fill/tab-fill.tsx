"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Water', body: 'Six glasses so far today. Two to go.' },
  { label: 'Coffee', body: 'One oat latte at 8:40. Easy does it.' },
  { label: 'Tea', body: 'A green tea after lunch, still warm.' },
];

const css = `
  @keyframes tabs-fill-wave { to { transform: translateX(-12px); } }
  .tabs-fill { width: 260px; }
  .tabs-fill__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .tabs-fill__tab { position: relative; overflow: hidden; height: 40px; border: 0; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); color: light-dark(#50535b, #c6c8cd); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; isolation: isolate; transition: color 0.25s 0.3s; }
  .tabs-fill__liquid { position: absolute; left: -12px; right: -12px; bottom: -8px; z-index: -1; height: 0; background: light-dark(#373a40, #f1f2f3); transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .tabs-fill__liquid::before { content: ''; position: absolute; left: 0; right: 0; top: -5px; height: 6px; background: radial-gradient(circle at 6px 6px, light-dark(#373a40, #f1f2f3) 5.5px, transparent 6px) 0 0 / 12px 6px repeat-x; animation: tabs-fill-wave 0.7s linear infinite; }
  .tabs-fill__tab[aria-selected='true'] { color: light-dark(#fbfcfd, #121417); transition-delay: 0.2s; }
  .tabs-fill__tab[aria-selected='true'] .tabs-fill__liquid { height: calc(120% + 8px); }
  .tabs-fill__tab:hover { box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087); }
  .tabs-fill__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-fill__panel { padding: 14px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-fill__liquid { transition: none; }
    .tabs-fill__liquid::before { animation: none; }
  }
`;

export function FillTabs() {
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
      <div className="tabs-fill">
        <div className="tabs-fill__list" role="tablist" aria-label="Drinks" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-fill__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span className="tabs-fill__liquid" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-fill__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
