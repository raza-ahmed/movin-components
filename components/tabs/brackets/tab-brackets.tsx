"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Design', body: 'Wireframes, the visual system and every screen state.' },
  { label: 'Build', body: 'Components, pages and the motion that ties them together.' },
  { label: 'Launch', body: 'Testing, a soft release, then the public announcement.' },
];

const css = `
  @keyframes tabs-brackets-clamp-a { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.25); } }
  @keyframes tabs-brackets-clamp-b { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.25); } }
  .tabs-brackets { width: 260px; }
  .tabs-brackets__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); }
  .tabs-brackets__tab { padding: 10px 0; border: 0; border-radius: 6px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; cursor: pointer; transition: color 0.2s; }
  .tabs-brackets__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-brackets__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-brackets__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-brackets__mark {
    position: absolute;
    top: 6px;
    bottom: 6px;
    width: 7px;
    border: 2px solid light-dark(#373a40, #f1f2f3);
    transition: left 0.45s cubic-bezier(0.3, 1.5, 0.5, 1);
    pointer-events: none;
  }
  .tabs-brackets__mark--l { left: calc(var(--tabs-brackets-i) / 3 * 100% + 6px); border-right: 0; border-radius: 3px 0 0 3px; }
  .tabs-brackets__mark--r { left: calc((var(--tabs-brackets-i) + 1) / 3 * 100% - 13px); border-left: 0; border-radius: 0 3px 3px 0; transition-delay: 0.05s; }
  .tabs-brackets[data-flip='a'] .tabs-brackets__mark { animation: tabs-brackets-clamp-a 0.45s ease-out 0.2s; }
  .tabs-brackets[data-flip='b'] .tabs-brackets__mark { animation: tabs-brackets-clamp-b 0.45s ease-out 0.2s; }
  .tabs-brackets__panel { padding: 12px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-brackets__mark { transition: none; animation: none !important; }
  }
`;

export function BracketsTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [flip, setFlip] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setFlip((f) => f + 1);
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
      <div className="tabs-brackets" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} style={{ '--tabs-brackets-i': sel } as React.CSSProperties}>
        <div className="tabs-brackets__list" role="tablist" aria-label="Project phase" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-brackets__tab"
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
          <span className="tabs-brackets__mark tabs-brackets__mark--l" aria-hidden="true" />
          <span className="tabs-brackets__mark tabs-brackets__mark--r" aria-hidden="true" />
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-brackets__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
