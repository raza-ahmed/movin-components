"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'Eco', body: 'Lower power, quieter fans, longer battery.' },
  { label: 'Normal', body: 'Balanced for everyday work.' },
  { label: 'Boost', body: 'Full clock speed while plugged in.' },
  { label: 'Silent', body: 'Fans off; the system throttles to keep cool.' },
];
const ANGLES = [-60, -20, 20, 60];

const css = `
  .tabs-selector { display: grid; grid-template-columns: 132px 1fr; align-items: center; gap: 14px; width: 280px; }
  .tabs-selector__list { position: relative; grid-row: 1; grid-column: 1; width: 132px; height: 120px; }
  .tabs-selector__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-selector__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  /* Labels sit round the left half of the dial, one per detent. */
  .tabs-selector__tab { position: absolute; left: calc(var(--x) * 1px); top: calc(var(--y) * 1px); padding: 2px 4px; color: light-dark(#5f626a, #a7abb2); font-size: 11.5px; white-space: nowrap; transform: translate(-100%, -50%); transition: color 0.2s; }
  .tabs-selector__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .tabs-selector__knob { position: absolute; right: 0; top: 50%; width: 56px; height: 56px; margin-top: -28px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529)); box-shadow: 0 0 0 4px light-dark(#f3f4f7, #1a1c1f), 0 0 0 5px light-dark(#dbdde1, #2e3035), 0 8px 16px -8px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); pointer-events: none; transform: rotate(calc(-90deg - var(--a) * 1deg)); transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .tabs-selector__knob::before { content: ''; position: absolute; left: 50%; top: 5px; width: 3px; height: 14px; margin-left: -1.5px; border-radius: 2px; background: light-dark(#373a40, #f1f2f3); }
  .tabs-selector__knob::after { content: ''; position: absolute; inset: 12px; border-radius: 50%; background: repeating-conic-gradient(light-dark(#dbdde1, #2e3035) 0 6deg, light-dark(#ebedf0, #232529) 6deg 12deg); opacity: 0.6; }
  .tabs-selector__panel { grid-row: 1; grid-column: 2; color: light-dark(#50535b, #c6c8cd); font-size: 12.5px; line-height: 1.5; }
  .tabs-selector__panel b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 14px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-selector__knob { transition: none; }
  }
`;

export function SelectorTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 1, prev: -1, flip: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, prev, flip } = state;
  const select = (i: number) => {
    if (i !== sel) setState((s) => ({ sel: i, prev: s.sel, flip: s.flip + 1 }));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = ITEMS.length;
    const next = ({ ArrowDown: (sel + 1) % n, ArrowUp: (sel + n - 1) % n, ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
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
        className="tabs-selector"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev, '--a': ANGLES[sel] } as React.CSSProperties}
      >
        <div className="tabs-selector__list" role="tablist" aria-label="Mode" aria-orientation="vertical" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-selector__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
              style={{ '--x': 104 - 46 * Math.cos(((ANGLES[i] ?? 0) * Math.PI) / 180), '--y': 60 + 46 * Math.sin(((ANGLES[i] ?? 0) * Math.PI) / 180) } as React.CSSProperties}
            >
              {t.label}
            </button>
          ))}
          <span className="tabs-selector__knob" aria-hidden="true" />
        </div>
        {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-selector__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <b>{t.label}</b>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
