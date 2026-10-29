"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Q1', title: 'Q1 · Plan', body: 'Research, roadmap and the first hires.' },
  { label: 'Q2', title: 'Q2 · Build', body: 'The beta ships to forty teams.' },
  { label: 'Q3', title: 'Q3 · Grow', body: 'Pricing, partners and the launch.' },
  { label: 'Q4', title: 'Q4 · Tune', body: 'Speed, polish and a calm December.' },
];
const W = 240;

const css = `
  .tabs-cube { width: ${W}px; }
  .tabs-cube__list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-bottom: 14px; }
  .tabs-cube__tab { padding: 6px 0; border: 0; border-radius: 7px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: color 0.2s, box-shadow 0.2s; }
  .tabs-cube__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-cube__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .tabs-cube__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-cube__scene { height: 92px; perspective: 900px; }
  .tabs-cube__box { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transform: translateZ(-${W / 2}px) rotateY(calc(var(--tabs-cube-turn) * -90deg)); transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1); }
  .tabs-cube__panel { position: absolute; inset: 0; padding: 16px; border-radius: 12px; background: linear-gradient(160deg, light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529)); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41); transform: rotateY(calc(var(--k) * 90deg)) translateZ(${W / 2}px); backface-visibility: hidden; }
  .tabs-cube__title { display: block; margin-bottom: 4px; color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-weight: 600; }
  .tabs-cube__body { color: light-dark(#50535b, #c6c8cd); font-size: 12.5px; line-height: 1.5; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-cube__box { transition: none; }
  }
`;

export function CubeTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, turn: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel } = state;
  const select = (i: number) => {
    // Turn the short way round, so Q4 to Q1 is one quarter turn, not three.
    const step = ((i - sel + 6) % 4) - 2;
    setState((s) => ({ sel: i, turn: s.turn + step }));
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
      <div className="tabs-cube" style={{ '--tabs-cube-turn': state.turn } as React.CSSProperties}>
        <div className="tabs-cube__list" role="tablist" aria-label="Quarter" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-cube__tab"
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
        <div className="tabs-cube__scene">
          <div className="tabs-cube__box">
            {TABS.map((t, i) => (
              <div
                key={t.label}
                className="tabs-cube__panel"
                role="tabpanel"
                id={`${id}-panel-${i}`}
                aria-labelledby={`${id}-tab-${i}`}
                aria-hidden={sel !== i}
                inert={sel !== i}
                style={{ '--k': i } as React.CSSProperties}
              >
                <span className="tabs-cube__title">{t.title}</span>
                <span className="tabs-cube__body">{t.body}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
