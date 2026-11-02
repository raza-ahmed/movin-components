"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Home', title: 'Good morning', body: 'Three things on today, and the first is at ten.' },
  { label: 'Search', title: 'Search', body: 'Recent: poster sizes, risograph inks, Ana.' },
  { label: 'Alerts', title: 'Alerts', body: 'Jun commented on the proofs. Two new followers.' },
  { label: 'Profile', title: 'Mira Holt', body: 'Motion designer. 48 projects, 1,284 followers.' },
];

const css = `
  .tabs-icons { width: 240px; }
  .tabs-icons__screen { box-sizing: border-box; height: 92px; margin-bottom: 8px; padding: 14px; border-radius: 14px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .tabs-icons__title { margin: 0 0 4px; font-size: 14px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .tabs-icons__body { margin: 0; font-size: 12.5px; line-height: 1.5; color: light-dark(#50535b, #c6c8cd); }
  .tabs-icons__panel { animation: tabs-icons-in 0.35s ease-out; }
  @keyframes tabs-icons-in {
    from { opacity: 0; transform: translateY(4px); }
  }
  .tabs-icons__bar { display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); padding: 6px; border-radius: 16px; background: light-dark(#ebedf0, #232529); }
  .tabs-icons__tab { display: grid; justify-items: center; gap: 3px; padding: 5px 0 4px; border: 0; border-radius: 11px; background: none; font: inherit; font-size: 10.5px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.25s; }
  .tabs-icons__tab:hover, .tabs-icons__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-icons__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -2px; }
  .tabs-icons__icon { width: 22px; height: 22px; overflow: visible; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .tabs-icons__icon * { transform-box: fill-box; }
  .tabs-icons__shape { fill: currentColor; fill-opacity: 0; transition: fill-opacity 0.3s; }
  .tabs-icons__tab[aria-selected='true'] .tabs-icons__shape { fill-opacity: 0.22; }
  /* Each icon acts out its meaning when picked. */
  .tabs-icons__door { transform-origin: 0 50%; }
  .tabs-icons__tab[aria-selected='true'] .tabs-icons__door { animation: tabs-icons-door 0.9s ease-in-out; }
  @keyframes tabs-icons-door {
    30%, 65% { transform: scaleX(0.15); }
  }
  .tabs-icons__puff { opacity: 0; }
  .tabs-icons__tab[aria-selected='true'] .tabs-icons__puff { animation: tabs-icons-puff 0.9s ease-out 0.15s; }
  @keyframes tabs-icons-puff {
    from { opacity: 0.9; transform: translateY(0) scale(0.6); }
    to { opacity: 0; transform: translateY(-6px) scale(1.4); }
  }
  .tabs-icons__glass { transform-origin: 40% 40%; }
  .tabs-icons__tab[aria-selected='true'] .tabs-icons__glass { animation: tabs-icons-scan 0.8s ease-in-out; }
  @keyframes tabs-icons-scan {
    25% { transform: translate(-2px, -1px) rotate(-14deg); }
    55% { transform: translate(2px, -2px) rotate(10deg); }
    80% { transform: translate(0.5px, 0.5px) rotate(-3deg); }
  }
  .tabs-icons__bell { transform-origin: 50% 0; }
  .tabs-icons__tab[aria-selected='true'] .tabs-icons__bell { animation: tabs-icons-ring 0.9s ease-out; }
  @keyframes tabs-icons-ring {
    12% { transform: rotate(18deg); }
    28% { transform: rotate(-15deg); }
    44% { transform: rotate(10deg); }
    60% { transform: rotate(-6deg); }
    76% { transform: rotate(3deg); }
  }
  .tabs-icons__clapper { transform-origin: 50% -500%; }
  .tabs-icons__tab[aria-selected='true'] .tabs-icons__clapper { animation: tabs-icons-clap 0.9s ease-out 0.05s; }
  @keyframes tabs-icons-clap {
    15% { transform: rotate(-26deg); }
    32% { transform: rotate(22deg); }
    50% { transform: rotate(-12deg); }
    68% { transform: rotate(5deg); }
  }
  .tabs-icons__head { transform-origin: 50% 100%; }
  .tabs-icons__tab[aria-selected='true'] .tabs-icons__head { animation: tabs-icons-nod 0.8s ease-in-out; }
  @keyframes tabs-icons-nod {
    30% { transform: translateY(-2.5px); }
    60% { transform: translateY(1px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-icons__icon *, .tabs-icons__panel { animation: none !important; }
  }
`;

function Icon({ i }: { i: number }) {
  return (
    <svg className="tabs-icons__icon" viewBox="0 0 24 24" aria-hidden="true">
      {i === 0 && (
        <>
          <circle className="tabs-icons__puff" cx={17} cy={3} r={1.6} />
          <path className="tabs-icons__shape" d="M3.5 11L12 4L20.5 11V20H3.5Z" />
          <rect className="tabs-icons__door" x={10} y={14} width={4} height={6} />
        </>
      )}
      {i === 1 && (
        <g className="tabs-icons__glass">
          <circle className="tabs-icons__shape" cx={10.5} cy={10.5} r={6} />
          <path d="M15 15L20 20" />
        </g>
      )}
      {i === 2 && (
        <>
          <path className="tabs-icons__bell tabs-icons__shape" d="M6 16.5V11A6 6 0 0 1 18 11V16.5L19.5 18.5H4.5Z" />
          <circle className="tabs-icons__clapper" cx={12} cy={21} r={1.4} />
        </>
      )}
      {i === 3 && (
        <>
          <circle className="tabs-icons__head tabs-icons__shape" cx={12} cy={8} r={3.6} />
          <path className="tabs-icons__shape" d="M4.5 20.5C4.5 16.5 7.8 14.5 12 14.5S19.5 16.5 19.5 20.5" />
        </>
      )}
    </svg>
  );
}

export function IconsTabs() {
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
      <div className="tabs-icons">
        <div className="tabs-icons__screen">
          {TABS.map((t, i) => (
            <div key={t.label} className="tabs-icons__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              <p className="tabs-icons__title">{t.title}</p>
              <p className="tabs-icons__body">{t.body}</p>
            </div>
          ))}
        </div>
        <div className="tabs-icons__bar" role="tablist" aria-label="App" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-icons__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <Icon i={i} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
