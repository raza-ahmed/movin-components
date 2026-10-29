"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const CITIES = [
  { label: 'London', time: 9 * 60 + 30, note: 'Morning. The office is filling up.' },
  { label: 'Tokyo', time: 17 * 60 + 30, note: 'Evening. Eight hours ahead of London.' },
  { label: 'New York', time: 4 * 60 + 30, note: 'Before dawn. Wait a few hours to call.' },
];
const TICKS = Array.from({ length: 12 }, (_, i) => i);
const hhmm = (t: number) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;

const css = `
  .tabs-clock { width: 260px; }
  .tabs-clock__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 14px; }
  .tabs-clock__tab { padding: 7px 0; border: 0; border-radius: 8px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
  .tabs-clock__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-clock__tab[aria-selected='true'] { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  .tabs-clock__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-clock__row { display: flex; align-items: center; gap: 16px; }
  .tabs-clock__face { position: relative; flex: none; width: 96px; height: 96px; border-radius: 50%; background: radial-gradient(circle, light-dark(#ebedf0, #232529), light-dark(#f3f4f7, #1a1c1f)); box-shadow: inset 0 0 0 2px light-dark(#cbced3, #393c41), 0 10px 20px -10px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .tabs-clock__tick { position: absolute; left: 50%; top: 50%; width: 2px; height: 7px; margin: -3.5px -1px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); transform: rotate(calc(var(--k) * 30deg)) translateY(-38px); }
  .tabs-clock__hand { position: absolute; left: 50%; bottom: 50%; border-radius: 2px; transform-origin: 50% 100%; transition: transform 1.2s cubic-bezier(0.5, 0, 0.2, 1); }
  .tabs-clock__hand--h { width: 4px; height: 24px; margin-left: -2px; background: light-dark(#373a40, #f1f2f3); transform: rotate(calc(var(--tabs-clock-t) * 0.5deg)); }
  .tabs-clock__hand--m { width: 2px; height: 36px; margin-left: -1px; background: light-dark(#50535b, #c6c8cd); transform: rotate(calc(var(--tabs-clock-t) * 6deg)); }
  .tabs-clock__pin { position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; margin: -4px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 2px light-dark(#ebedf0, #232529); }
  .tabs-clock__panel { flex: 1; }
  .tabs-clock__time { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 26px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .tabs-clock__note { color: light-dark(#50535b, #c6c8cd); font-size: 12px; line-height: 1.45; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-clock__hand { transition: none; }
  }
`;

export function ClockTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, total: CITIES[0].time });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel } = state;
  const select = (i: number) => {
    if (i === sel) return;
    // Always wind forward to the new time, so the minute hand whirls through the hours in between.
    setState((s) => ({ sel: i, total: s.total + ((((CITIES[i].time - s.total) % 720) + 720) % 720 || 720) }));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = CITIES.length;
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
      <div className="tabs-clock" style={{ '--tabs-clock-t': state.total } as React.CSSProperties}>
        <div className="tabs-clock__list" role="tablist" aria-label="City" onKeyDown={onKeyDown}>
          {CITIES.map((c, i) => (
            <button
              key={c.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-clock__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="tabs-clock__row">
          <span className="tabs-clock__face" aria-hidden="true">
            {TICKS.map((k) => (
              <span key={k} className="tabs-clock__tick" style={{ '--k': k } as React.CSSProperties} />
            ))}
            <span className="tabs-clock__hand tabs-clock__hand--h" />
            <span className="tabs-clock__hand tabs-clock__hand--m" />
            <span className="tabs-clock__pin" />
          </span>
          {CITIES.map((c, i) => (
            <div key={c.label} className="tabs-clock__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              <span className="tabs-clock__time">{hhmm(c.time)}</span>
              <span className="tabs-clock__note">{c.note}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
