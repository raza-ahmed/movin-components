"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Saved', body: 'Twenty-three recipes you marked to cook later.' },
  { label: 'Cooked', body: 'Nine you made, with your own notes on each.' },
  { label: 'Shared', body: 'Four you sent to friends this month.' },
];

const css = `
  .tabs-ribbon { width: 260px; }
  .tabs-ribbon__list { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 2px solid light-dark(#cbced3, #393c41); }
  .tabs-ribbon__tab { position: relative; overflow: hidden; padding: 30px 0 8px; border: 0; border-radius: 0 0 8px 8px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.25s; }
  .tabs-ribbon__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-ribbon__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-ribbon__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-ribbon__mark {
    position: absolute;
    left: 50%;
    top: 0;
    width: 14px;
    height: 24px;
    margin-left: -7px;
    background: linear-gradient(90deg, light-dark(#42454c, #e5e6e9), light-dark(#373a40, #f1f2f3) 40%, light-dark(#42454c, #e5e6e9));
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 74%, 0 100%);
    transform: translateY(-105%);
    transition: transform 0.3s cubic-bezier(0.5, 0, 0.75, 0);
  }
  .tabs-ribbon__tab[aria-selected='true'] .tabs-ribbon__mark { transform: translateY(0); transition: transform 0.55s cubic-bezier(0.3, 1.6, 0.5, 1) 0.2s; }
  .tabs-ribbon__panel { padding: 12px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-ribbon__mark { transition: none !important; }
  }
`;

export function RibbonTabs() {
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
      <div className="tabs-ribbon">
        <div className="tabs-ribbon__list" role="tablist" aria-label="Recipes" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-ribbon__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span className="tabs-ribbon__mark" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-ribbon__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
