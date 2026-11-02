"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const APPS = [
  { label: 'Photos', body: '2,481 photos. The latest is from this morning, at the harbour.' },
  { label: 'Music', body: 'Playing Tides. Three albums saved for the train.' },
  { label: 'Maps', body: 'Home in 24 minutes by bike. Light rain after four.' },
  { label: 'Notes', body: 'Poster sizes, the ink order and a list of printers to call.' },
];
const BIG = { x: 0, y: 0, w: 240, h: 104 };
const small = (k: number) => ({ x: k * 82, y: 112, w: 76, h: 48 });
// The chosen tile takes the big slot; the rest fill the small ones in their usual order.
function slots(sel: number) {
  let k = 0;
  return APPS.map((_, i) => (i === sel ? BIG : small(k++)));
}

const EASE = 'cubic-bezier(0.3, 1.15, 0.4, 1)';
const css = `
  .tabs-tiles { position: relative; width: 240px; height: 160px; }
  .tabs-tiles__tile {
    position: absolute;
    padding: 0;
    border: 0;
    border-radius: 14px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#50535b, #c6c8cd);
    font: inherit;
    cursor: pointer;
    transition: left 0.5s ${EASE}, top 0.5s ${EASE}, width 0.5s ${EASE}, height 0.5s ${EASE}, background-color 0.3s, color 0.3s;
  }
  .tabs-tiles__tile[aria-selected='true'] { z-index: 1; background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); }
  .tabs-tiles__tile:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .tabs-tiles__icon { position: absolute; left: calc(50% - 9px); top: 8px; width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: left 0.5s ${EASE}, top 0.5s ${EASE}, width 0.5s ${EASE}, height 0.5s ${EASE}; }
  .tabs-tiles__tile[aria-selected='true'] .tabs-tiles__icon { left: calc(100% - 42px); top: 14px; width: 28px; height: 28px; }
  .tabs-tiles__label { position: absolute; left: 50%; top: 29px; font-size: 10.5px; font-weight: 600; white-space: nowrap; transform: translateX(-50%); transition: left 0.5s ${EASE}, top 0.5s ${EASE}, transform 0.5s ${EASE}, font-size 0.5s ${EASE}; }
  .tabs-tiles__tile[aria-selected='true'] .tabs-tiles__label { left: 14px; top: 14px; font-size: 16px; transform: none; }
  .tabs-tiles__panel { position: absolute; left: 14px; right: 14px; top: 46px; z-index: 2; margin: 0; font-size: 12px; line-height: 1.5; color: light-dark(#42454c, #e5e6e9); pointer-events: none; animation: tabs-tiles-in 0.35s ease-out 0.35s backwards; }
  @keyframes tabs-tiles-in {
    from { opacity: 0; transform: translateY(5px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-tiles__tile, .tabs-tiles__icon, .tabs-tiles__label { transition: none; }
    .tabs-tiles__panel { animation: none; }
  }
`;

function Icon({ i }: { i: number }) {
  return (
    <svg className="tabs-tiles__icon" viewBox="0 0 24 24" aria-hidden="true">
      {i === 0 && <path d="M3 18L9 11L13 15L16 12L21 18ZM3 5H21V19H3Z" />}
      {i === 1 && <path d="M9 18V6L19 4V16M9 18A2.5 2.5 0 1 1 4 18A2.5 2.5 0 0 1 9 18ZM19 16A2.5 2.5 0 1 1 14 16A2.5 2.5 0 0 1 19 16Z" />}
      {i === 2 && <path d="M12 21C12 21 5 14.5 5 9.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21ZM12 12A2.5 2.5 0 1 0 12 7A2.5 2.5 0 0 0 12 12Z" />}
      {i === 3 && <path d="M6 3H18V21H6ZM9 8H15M9 12H15M9 16H13" />}
    </svg>
  );
}

export function TilesTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = slots(sel);
  const n = APPS.length;
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
      <div className="tabs-tiles">
        <div role="tablist" aria-label="Apps" onKeyDown={onKeyDown}>
          {APPS.map((a, i) => (
            <button
              key={a.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-tiles__tile"
              style={{ left: at[i].x, top: at[i].y, width: at[i].w, height: at[i].h }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <Icon i={i} />
              <span className="tabs-tiles__label">{a.label}</span>
            </button>
          ))}
        </div>
        {APPS.map((a, i) => (
          <p key={a.label} className="tabs-tiles__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {a.body}
          </p>
        ))}
      </div>
    </>
  );
}
