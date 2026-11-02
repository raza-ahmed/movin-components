"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const STAMPS = [
  { label: 'Japan', code: 'NRT', date: '12 MAR 2026', radius: '50%', tilt: -12, size: 108 },
  { label: 'Peru', code: 'LIM', date: '04 JUN 2026', radius: '6px', tilt: 8, size: 0 },
  { label: 'Iceland', code: 'KEF', date: '21 SEP 2026', radius: '50% / 40%', tilt: -5, size: 0 },
];

const css = `
  @keyframes tabs-passport-slam { from { opacity: 0; transform: rotate(calc(var(--tabs-passport-tilt) - 14deg)) scale(1.9); } 55% { opacity: 1; transform: rotate(var(--tabs-passport-tilt)) scale(0.94); } to { opacity: 1; transform: rotate(var(--tabs-passport-tilt)) scale(1); } }
  @keyframes tabs-passport-jolt { 0%, 100% { transform: translate(0, 0); } 30% { transform: translate(1px, 3px); } 60% { transform: translate(-1px, -1px); } }
  .tabs-passport { width: 250px; }
  .tabs-passport__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 10px; }
  .tabs-passport__tab { padding: 6px 0; border: 0; border-radius: 7px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
  .tabs-passport__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-passport__tab[aria-selected='true'] { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  .tabs-passport__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-passport__page {
    position: relative;
    height: 128px;
    padding: 10px 12px;
    border-radius: 4px 10px 10px 4px;
    background:
      repeating-radial-gradient(circle at 0 100%, transparent 0 7px, color-mix(in oklab, light-dark(#5f626a, #a7abb2) 22%, transparent) 7px 8px),
      light-dark(#42454c, #e5e6e9);
    box-shadow: inset 6px 0 8px -6px light-dark(rgba(0, 0, 0, 0.11), rgba(0, 0, 0, 0.35)), 0 12px 22px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
  }
  .tabs-passport[data-flip='a'] .tabs-passport__page { animation: tabs-passport-jolt 0.25s ease-out 0.2s; }
  .tabs-passport[data-flip='b'] .tabs-passport__page { animation: tabs-passport-jolt 0.25s ease-out 0.2s; }
  .tabs-passport__head { display: flex; justify-content: space-between; color: light-dark(#6d7179, #7d8087); font-size: 9px; font-weight: 600; letter-spacing: 0.18em; }
  .tabs-passport__panel { position: absolute; inset: 0; display: grid; place-items: center; padding-top: 8px; }
  .tabs-passport__panel[hidden] { display: none; }
  .tabs-passport__stamp {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 1px;
    padding: 10px 22px;
    border: 2.5px solid light-dark(#dbdde1, #2e3035);
    border-radius: var(--tabs-passport-r);
    box-shadow: inset 0 0 0 2px light-dark(#42454c, #e5e6e9), inset 0 0 0 3.5px light-dark(#dbdde1, #2e3035);
    color: light-dark(#dbdde1, #2e3035);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    text-align: center;
    opacity: 0.88;
    transform: rotate(var(--tabs-passport-tilt));
  }
  .tabs-passport[data-flip] .tabs-passport__stamp { animation: tabs-passport-slam 0.35s cubic-bezier(0.5, 0, 0.6, 1.3); }
  .tabs-passport__country { font-size: 14px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
  .tabs-passport__meta { font-size: 9px; letter-spacing: 0.1em; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-passport__page, .tabs-passport__stamp { animation: none !important; }
  }
`;

export function PassportTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [flip, setFlip] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setFlip((f) => f + 1);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = STAMPS.length;
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
      <div className="tabs-passport" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}>
        <div className="tabs-passport__list" role="tablist" aria-label="Trips" onKeyDown={onKeyDown}>
          {STAMPS.map((s, i) => (
            <button
              key={s.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-passport__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="tabs-passport__page">
          <span className="tabs-passport__head" aria-hidden="true">
            <span>VISAS</span>
            <span>12</span>
          </span>
          {STAMPS.map((s, i) => (
            <div key={s.label} className="tabs-passport__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              <span className="tabs-passport__stamp" style={{ '--tabs-passport-r': s.radius, '--tabs-passport-tilt': `${s.tilt}deg`, ...(s.size ? { width: s.size, height: s.size, padding: 0 } : {}) } as React.CSSProperties}>
                <span className="tabs-passport__meta">ARRIVED</span>
                <span className="tabs-passport__country">{s.label}</span>
                <span className="tabs-passport__meta">
                  {s.code} · {s.date}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
