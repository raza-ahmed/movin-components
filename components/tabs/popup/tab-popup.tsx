"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Forest', body: 'Chapter one: a path of paper pines that rise as the page opens.' },
  { label: 'Castle', body: 'Chapter two: towers fold up from the spine, flags and all.' },
  { label: 'Sea', body: 'Chapter three: three layers of waves and a ship between them.' },
];
const HINGE = '0.6s cubic-bezier(0.3, 1.45, 0.45, 1)';

const css = `
  .tabs-popup { width: 270px; }
  .tabs-popup__list { position: relative; display: flex; justify-content: center; gap: 26px; padding-top: 10px; perspective: 260px; }
  /* The page the labels lie on and stand up from. */
  .tabs-popup__list::after { content: ''; position: absolute; left: 4px; right: 4px; bottom: 0; height: 1px; background: light-dark(#dbdde1, #2e3035); }
  .tabs-popup__tab {
    position: relative;
    border: 0;
    padding: 4px 2px;
    background: none;
    font: inherit;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: light-dark(#5f626a, #a7abb2);
    cursor: pointer;
    transform-origin: 50% 100%;
    transform: rotateX(56deg);
    transition: transform ${HINGE}, color 0.35s;
  }
  .tabs-popup__tab:hover { color: light-dark(#50535b, #c6c8cd); }
  .tabs-popup__tab[aria-selected='true'] { transform: none; color: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 5px 3px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.5))); }
  .tabs-popup__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 4px; }
  .tabs-popup__panel { padding: 14px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-popup__tab { transition: color 0.2s; }
  }
`;

export function PopupTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
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
      <div className="tabs-popup">
        <div className="tabs-popup__list" role="tablist" aria-label="Chapters" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-popup__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-popup__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
