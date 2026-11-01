"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Day', body: 'Six meetings, two of them back to back after lunch.' },
  { label: 'Week', body: 'A lighter week: Thursday is clear from noon onwards.' },
  { label: 'Month', body: 'Three trips and the quarterly review on the 24th.' },
  { label: 'Year', body: 'Twelve releases planned, four already shipped.' },
];
const R = 12;
const GAP = 3;
const EASE = '0.45s cubic-bezier(0.3, 1.25, 0.5, 1)';

const css = `
  .tabs-split { width: 264px; }
  .tabs-split__list { display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); height: 38px; }
  .tabs-split__tab { position: relative; border: 0; padding: 0; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#50535b, #c6c8cd); cursor: pointer; outline: none; transition: color 0.3s; }
  .tabs-split__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-split__seg {
    position: absolute;
    top: 0;
    bottom: 0;
    background: light-dark(#ebedf0, #232529);
    transition: left ${EASE}, right ${EASE}, top ${EASE}, bottom ${EASE}, border-radius ${EASE}, background-color 0.3s, box-shadow 0.3s;
  }
  .tabs-split__tab[aria-selected='true'] { color: light-dark(#fbfcfd, #121417); }
  .tabs-split__tab[aria-selected='true'] .tabs-split__seg {
    top: -2px;
    bottom: -2px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45));
  }
  .tabs-split__tab:focus-visible .tabs-split__seg { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-split__label { position: relative; }
  .tabs-split__panel { padding: 16px 4px 0; min-height: calc(3.1em + 16px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-split__seg { transition: background-color 0.2s; }
  }
`;

export function SplitTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
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
      <div className="tabs-split">
        <div className="tabs-split__list" role="tablist" aria-label="Calendar range" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => {
            // Square, touching edges make one bar; any edge next to the active tab pulls back and rounds off.
            const open = (j: number) => j === sel || j < 0 || j >= n;
            const l = i === sel || i - 1 === sel ? GAP : 0;
            const r = i === sel || i + 1 === sel ? GAP : 0;
            const left = open(i - 1) || i === sel ? R : 0;
            const right = open(i + 1) || i === sel ? R : 0;
            return (
              <button
                key={t.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-split__tab"
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => setSel(i)}
              >
                <span className="tabs-split__seg" style={{ left: l, right: r, borderRadius: `${left}px ${right}px ${right}px ${left}px` }} aria-hidden="true" />
                <span className="tabs-split__label">{t.label}</span>
              </button>
            );
          })}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-split__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
