"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'Lisbon', dest: 'LISBON', time: '09:40', gate: 'B12', note: 'Boarding' },
  { label: 'Kyoto', dest: 'KYOTO', time: '11:15', gate: 'C04', note: 'On time' },
  { label: 'Oslo', dest: 'OSLO', time: '13:05', gate: 'A21', note: 'Delayed 10 min' },
];
const W = 6;
const cells = (s: string) => s.padEnd(W, ' ').slice(0, W).split('');

const css = `
  /* A cell flaps down from the top half: hinged at the middle, a beat after the cell to its left. */
  @keyframes tabs-departures-flap { 0% { transform: rotateX(-90deg); filter: brightness(1.6); } 70% { transform: rotateX(8deg); } 100% { transform: none; } }
  .tabs-departures { display: grid; gap: 12px; width: 260px; }
  .tabs-departures__list { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .tabs-departures__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-departures__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  .tabs-departures__tab { flex: 1; padding: 6px 0; border-radius: 7px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; transition: background-color 0.2s, color 0.2s; }
  .tabs-departures__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-departures__panel { display: grid; gap: 6px; padding: 12px; border-radius: 10px; background: light-dark(#fbfcfd, #121417); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .tabs-departures__row { display: flex; align-items: center; gap: 2px; perspective: 200px; }
  .tabs-departures__key { width: 36px; color: light-dark(#5f626a, #a7abb2); font-size: 9px; letter-spacing: 0.12em; }
  .tabs-departures__cell {
    position: relative;
    display: grid;
    place-items: center;
    width: 22px;
    height: 26px;
    border-radius: 3px;
    background: linear-gradient(light-dark(#ebedf0, #232529) 0 49%, light-dark(#fbfcfd, #121417) 49% 51%, light-dark(#ebedf0, #232529) 51%);
    color: light-dark(#373a40, #f1f2f3);
    font: 600 14px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    transform-origin: 50% 50%;
  }
  .tabs-departures[data-armed] .tabs-departures__cell { animation: tabs-departures-flap 0.38s cubic-bezier(0.3, 0, 0.4, 1.3) backwards; animation-delay: calc(var(--k) * 45ms); }
  .tabs-departures__note { margin-top: 2px; color: light-dark(#50535b, #c6c8cd); font-size: 11.5px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-departures__cell { animation: none !important; }
  }
`;

export function DeparturesTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, prev: -1, flip: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, prev, flip } = state;
  const select = (i: number) => {
    if (i !== sel) setState((s) => ({ sel: i, prev: s.sel, flip: s.flip + 1 }));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = ITEMS.length;
    const next = ({ ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
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
        className="tabs-departures"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev } as React.CSSProperties}
      >
        <div className="tabs-departures__list" role="tablist" aria-label="Destinations" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-departures__tab"
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
        {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-departures__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {(
              [
                ['DEST', t.dest],
                ['TIME', t.time],
                ['GATE', t.gate],
              ] as const
            ).map(([k, val], r) => (
              <div key={k} className="tabs-departures__row" aria-hidden="true">
                <span className="tabs-departures__key">{k}</span>
                {cells(val).map((c, j) => (
                  <span key={j} className="tabs-departures__cell" style={{ '--k': r * W + j } as React.CSSProperties}>
                    {c}
                  </span>
                ))}
              </div>
            ))}
            <span className="tabs-departures__note">
              {t.dest[0]}{t.dest.slice(1).toLowerCase()}, {t.time}, gate {t.gate}. {t.note}.
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
