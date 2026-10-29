"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'For you', body: 'Picks based on what you read this week.' },
  { label: 'Following', body: 'New posts from the forty people you follow.' },
  { label: 'Trending', body: 'What everyone is talking about right now.' },
];

const css = `
  @keyframes tabs-hop-arc-a {
    0% { transform: translateY(0) scale(1); }
    45% { transform: translateY(-18px) scale(0.9, 1.15); }
    80% { transform: translateY(0) scale(1.5, 0.6); }
    100% { transform: translateY(0) scale(1); }
  }
  @keyframes tabs-hop-arc-b {
    0% { transform: translateY(0) scale(1); }
    45% { transform: translateY(-18px) scale(0.9, 1.15); }
    80% { transform: translateY(0) scale(1.5, 0.6); }
    100% { transform: translateY(0) scale(1); }
  }
  .tabs-hop { width: 260px; }
  .tabs-hop__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); padding-bottom: 14px; }
  .tabs-hop__tab { padding: 10px 0 4px; border: 0; border-radius: 6px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s; }
  .tabs-hop__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-hop__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-hop__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-hop__track { position: absolute; bottom: 2px; left: calc((var(--tabs-hop-i) + 0.5) / 3 * 100% - 4px); width: 8px; height: 8px; transition: left 0.5s cubic-bezier(0.45, 0, 0.55, 1); }
  .tabs-hop__dot { display: block; width: 8px; height: 8px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); transform-origin: 50% 100%; }
  .tabs-hop[data-flip='a'] .tabs-hop__dot { animation: tabs-hop-arc-a 0.62s ease-in-out; }
  .tabs-hop[data-flip='b'] .tabs-hop__dot { animation: tabs-hop-arc-b 0.62s ease-in-out; }
  .tabs-hop__panel { padding: 10px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-hop__track { transition: none; }
    .tabs-hop__dot { animation: none !important; }
  }
`;

export function HopTabs() {
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
      <div className="tabs-hop" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} style={{ '--tabs-hop-i': sel } as React.CSSProperties}>
        <div className="tabs-hop__list" role="tablist" aria-label="Feed" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-hop__tab"
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
          <span className="tabs-hop__track" aria-hidden="true">
            <span className="tabs-hop__dot" />
          </span>
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-hop__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
