"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'List', body: 'Every task in one column, sorted by due date.' },
  { label: 'Board', body: 'To do, doing and done, side by side.' },
  { label: 'Calendar', body: 'Tasks laid out across the month ahead.' },
];

const css = `
  .tabs-puck { width: 260px; }
  .tabs-puck__list {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 44px;
    padding: 4px;
    border-radius: 14px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow:
      inset 0 2px 4px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.45)),
      inset 0 0 0 1px light-dark(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.3)),
      0 1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 6%, transparent);
  }
  .tabs-puck__slot {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: calc(var(--tabs-puck-i) * (100% - 8px) / 3 + 4px);
    width: calc((100% - 8px) / 3);
    transition: left 0.5s cubic-bezier(0.3, 1.3, 0.5, 1);
  }
  /* Raised: a lit top edge and two layers of shadow, so it reads as sitting proud of the groove. */
  .tabs-puck__puck {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: light-dark(#fbfcfd, #2e3035);
    box-shadow:
      inset 0 1px 0 color-mix(in oklab, light-dark(#fbfcfd, #f1f2f3) 22%, transparent),
      0 1px 2px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.5)),
      0 4px 10px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.35));
    transform-origin: 50% 100%;
  }
  .tabs-puck__tab { position: relative; border: 0; border-radius: 10px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.25s; }
  .tabs-puck__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-puck__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-puck__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-puck__panel { padding: 14px 6px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-puck__slot { transition: none; }
  }
`;

export function PuckTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const puck = useRef<HTMLSpanElement>(null);
  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // It leans into the slide like something with weight, then rocks back level.
    const lean = Math.sign(i - sel) * Math.min(14, 8 + Math.abs(i - sel) * 3);
    puck.current?.animate(
      [
        { transform: 'none' },
        { transform: `skewX(${-lean}deg) scaleY(0.94)`, offset: 0.3 },
        { transform: `skewX(${lean * 0.35}deg)`, offset: 0.7 },
        { transform: 'none' },
      ],
      { duration: 520, easing: 'ease-out' },
    );
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
      <div className="tabs-puck" style={{ '--tabs-puck-i': sel } as React.CSSProperties}>
        <div className="tabs-puck__list" role="tablist" aria-label="Layout" onKeyDown={onKeyDown}>
          <span className="tabs-puck__slot" aria-hidden="true">
            <span ref={puck} className="tabs-puck__puck" />
          </span>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-puck__tab"
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
          <div key={t.label} className="tabs-puck__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
