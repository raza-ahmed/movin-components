"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Read', body: 'Pick up where you left off: chapter nine.' },
  { label: 'Listen', body: 'The audiobook is at 2 h 14 min.' },
  { label: 'Notes', body: 'Eleven highlights, three with notes.' },
];

const css = `
  @keyframes tabs-lamp-swing-a {
    0% { transform: rotate(calc(var(--tabs-lamp-d) * 16deg)); }
    40% { transform: rotate(calc(var(--tabs-lamp-d) * -9deg)); }
    65% { transform: rotate(calc(var(--tabs-lamp-d) * 5deg)); }
    85% { transform: rotate(calc(var(--tabs-lamp-d) * -2deg)); }
    100% { transform: rotate(0deg); }
  }
  @keyframes tabs-lamp-swing-b {
    0% { transform: rotate(calc(var(--tabs-lamp-d) * 16deg)); }
    40% { transform: rotate(calc(var(--tabs-lamp-d) * -9deg)); }
    65% { transform: rotate(calc(var(--tabs-lamp-d) * 5deg)); }
    85% { transform: rotate(calc(var(--tabs-lamp-d) * -2deg)); }
    100% { transform: rotate(0deg); }
  }
  .tabs-lamp { width: 260px; }
  .tabs-lamp__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); padding-top: 64px; border-top: 1px solid light-dark(#dbdde1, #2e3035); }
  .tabs-lamp__hang { position: absolute; top: 0; left: calc((var(--tabs-lamp-i) + 0.5) / 3 * 100%); width: 0; height: 0; transition: left 0.6s cubic-bezier(0.45, 0, 0.3, 1); }
  .tabs-lamp__swing { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
  .tabs-lamp[data-flip='a'] .tabs-lamp__swing { animation: tabs-lamp-swing-a 1.2s ease-out; }
  .tabs-lamp[data-flip='b'] .tabs-lamp__swing { animation: tabs-lamp-swing-b 1.2s ease-out; }
  .tabs-lamp__cord { position: absolute; left: -0.5px; top: 0; width: 1px; height: 22px; background: light-dark(#6d7179, #7d8087); }
  .tabs-lamp__shade { position: absolute; left: -17px; top: 22px; width: 34px; height: 14px; border-radius: 12px 12px 2px 2px; background: light-dark(#50535b, #c6c8cd); }
  .tabs-lamp__bulb { position: absolute; left: -5px; top: 33px; width: 10px; height: 6px; border-radius: 0 0 6px 6px; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 10px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent); }
  .tabs-lamp__cone { position: absolute; left: -44px; top: 36px; width: 88px; height: 64px; background: linear-gradient(color-mix(in oklab, light-dark(#373a40, #f1f2f3) 28%, transparent), transparent); clip-path: polygon(40% 0, 60% 0, 100% 100%, 0 100%); pointer-events: none; }
  .tabs-lamp__tab { position: relative; padding: 8px 0; border: 0; border-radius: 6px; background: none; color: light-dark(#6d7179, #7d8087); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.3s 0.25s; }
  .tabs-lamp__tab:hover { color: light-dark(#50535b, #c6c8cd); }
  .tabs-lamp__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-lamp__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-lamp__panel { padding: 10px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-lamp__hang { transition: none; }
    .tabs-lamp__swing { animation: none !important; }
  }
`;

export function LampTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const [move, setMove] = useState({ d: 1, flip: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setMove((m) => ({ d: i > sel ? 1 : -1, flip: m.flip + 1 }));
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
      <div
        className="tabs-lamp"
        data-flip={move.flip ? (move.flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--tabs-lamp-i': sel, '--tabs-lamp-d': move.d } as React.CSSProperties}
      >
        <div className="tabs-lamp__list" role="tablist" aria-label="Book" onKeyDown={onKeyDown}>
          <span className="tabs-lamp__hang" aria-hidden="true">
            <span className="tabs-lamp__swing">
              <span className="tabs-lamp__cone" />
              <span className="tabs-lamp__cord" />
              <span className="tabs-lamp__shade" />
              <span className="tabs-lamp__bulb" />
            </span>
          </span>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-lamp__tab"
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
          <div key={t.label} className="tabs-lamp__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
