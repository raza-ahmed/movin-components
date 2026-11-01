"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Mon', body: 'Stand-up at 9:30, then a clear afternoon for deep work.' },
  { label: 'Tue', body: 'Design review at 11 and a client call at 3.' },
  { label: 'Wed', body: 'No meetings. Ship the onboarding flow.' },
  { label: 'Thu', body: 'Team lunch at 1 and a workshop until 5.' },
  { label: 'Fri', body: 'Demo day at 4, then the weekly write-up.' },
  { label: 'Sat', body: 'Nothing planned. Keep it that way.' },
  { label: 'Sun', body: 'Plan the week ahead over a slow breakfast.' },
];

const STEP = 25;
const R = 170;

const css = `
  .tabs-wheel { width: 260px; }
  .tabs-wheel__list { position: relative; height: 44px; perspective: 520px; overflow: hidden; }
  .tabs-wheel__drum {
    position: absolute;
    left: 50%;
    top: 0;
    width: 0;
    height: 44px;
    transform-style: preserve-3d;
    transform: translateZ(-${R}px) rotateY(calc(var(--tabs-wheel-i) * -${STEP}deg));
    transition: transform 0.65s cubic-bezier(0.3, 1.25, 0.5, 1);
  }
  .tabs-wheel__tab {
    position: absolute;
    left: -30px;
    top: 4px;
    width: 60px;
    height: 36px;
    border: 0;
    border-radius: 10px;
    background: none;
    color: light-dark(#50535b, #c6c8cd);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    backface-visibility: hidden;
    transition: color 0.3s, opacity 0.4s;
  }
  .tabs-wheel__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-wheel__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-wheel__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  /* The front of the wheel is marked by a fixed dot; the days turn past it. */
  .tabs-wheel__mark { display: block; width: 4px; height: 4px; margin: 2px auto 0; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); }
  .tabs-wheel__panel { padding: 12px 6px 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-wheel__drum { transition: none; }
  }
`;

export function WheelTabs() {
  const id = useId();
  const [sel, setSel] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowRight: Math.min(n - 1, sel + 1), ArrowLeft: Math.max(0, sel - 1), Home: 0, End: n - 1 }[e.key];
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
      <div className="tabs-wheel">
        <div className="tabs-wheel__list" role="tablist" aria-label="Day" onKeyDown={onKeyDown}>
          <div className="tabs-wheel__drum" style={{ '--tabs-wheel-i': sel } as React.CSSProperties}>
            {TABS.map((t, i) => {
              const d = Math.abs(i - sel);
              return (
                <button
                  key={t.label}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  className="tabs-wheel__tab"
                  type="button"
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={sel === i}
                  aria-controls={`${id}-panel-${i}`}
                  tabIndex={sel === i ? 0 : -1}
                  onClick={() => setSel(i)}
                  // Days fade as they turn away; the ones round the back can't be clicked.
                  style={{ transform: `rotateY(${i * STEP}deg) translateZ(${R}px)`, opacity: [1, 0.7, 0.42, 0.18][d] ?? 0, pointerEvents: d > 3 ? 'none' : undefined }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <span className="tabs-wheel__mark" aria-hidden="true" />
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-wheel__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
