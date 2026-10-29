"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const LETTERS = [
  { label: 'Mia', tilt: -4, body: 'Lisbon is all hills and tiled walls. A postcard is on its way.' },
  { label: 'Theo', tilt: 3, body: 'The band played our song last night. Wish you were there.' },
  { label: 'Ava', tilt: -2, body: 'Snow at last! The cabin smells of pine and toast.' },
];

const css = `
  @keyframes tabs-envelope-rise { from { transform: translateY(78px); } }
  .tabs-envelope { width: 240px; }
  .tabs-envelope__list { display: flex; justify-content: center; gap: 10px; }
  .tabs-envelope__tab {
    display: grid;
    place-items: center;
    width: 52px;
    height: 42px;
    padding: 0;
    border: 0;
    background: light-dark(#50535b, #c6c8cd);
    color: light-dark(#ebedf0, #232529);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    -webkit-mask: radial-gradient(circle, transparent 2px, #000 2.4px) -3px -3px / 6px 6px, linear-gradient(#000 0 0) 4px 4px / calc(100% - 8px) calc(100% - 8px) no-repeat;
    mask: radial-gradient(circle, transparent 2px, #000 2.4px) -3px -3px / 6px 6px, linear-gradient(#000 0 0) 4px 4px / calc(100% - 8px) calc(100% - 8px) no-repeat;
    transform: rotate(var(--tabs-envelope-tilt));
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1), background-color 0.2s;
  }
  .tabs-envelope__tab:hover { transform: rotate(0deg) translateY(-2px); }
  .tabs-envelope__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); transform: rotate(0deg) scale(1.1); }
  .tabs-envelope__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .tabs-envelope__scene { position: relative; height: 138px; margin-top: 10px; }
  .tabs-envelope__flap { position: absolute; left: 8px; right: 8px; top: 20px; height: 40px; background: light-dark(#dbdde1, #2e3035); clip-path: polygon(0 100%, 50% 0, 100% 100%); }
  .tabs-envelope__back { position: absolute; left: 8px; right: 8px; bottom: 0; height: 80px; border-radius: 0 0 6px 6px; background: light-dark(#ebedf0, #232529); }
  .tabs-envelope__letter { position: absolute; left: 22px; right: 22px; top: 6px; height: 112px; padding: 12px 14px; border-radius: 3px; background: light-dark(#42454c, #e5e6e9); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.09), rgba(0, 0, 0, 0.3)); color: light-dark(#ebedf0, #232529); font-family: Georgia, 'Times New Roman', serif; font-size: 12.5px; line-height: 1.45; }
  .tabs-envelope[data-armed] .tabs-envelope__letter { animation: tabs-envelope-rise 0.6s cubic-bezier(0.3, 1.35, 0.5, 1); }
  .tabs-envelope__from { display: block; margin-bottom: 4px; color: light-dark(#cbced3, #393c41); font-size: 10.5px; font-style: italic; }
  .tabs-envelope__pocket { position: absolute; left: 8px; right: 8px; bottom: 0; height: 80px; border-radius: 0 0 6px 6px; background: linear-gradient(light-dark(#cbced3, #393c41), light-dark(#dbdde1, #2e3035)); clip-path: polygon(0 26%, 50% 62%, 100% 26%, 100% 100%, 0 100%); box-shadow: 0 10px 20px -10px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); pointer-events: none; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-envelope__tab { transition: none; }
    .tabs-envelope__letter { animation: none !important; }
  }
`;

export function EnvelopeTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setArmed(true);
    setSel(i);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = LETTERS.length;
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
      <div className="tabs-envelope" data-armed={armed ? '' : undefined}>
        <div className="tabs-envelope__list" role="tablist" aria-label="Letters" onKeyDown={onKeyDown}>
          {LETTERS.map((l, i) => (
            <button
              key={l.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-envelope__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              style={{ '--tabs-envelope-tilt': `${l.tilt}deg` } as React.CSSProperties}
              onClick={() => select(i)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="tabs-envelope__scene">
          <span className="tabs-envelope__flap" aria-hidden="true" />
          <span className="tabs-envelope__back" aria-hidden="true" />
          {LETTERS.map((l, i) => (
            <div key={l.label} className="tabs-envelope__letter" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              <span className="tabs-envelope__from">From {l.label}</span>
              {l.body}
            </div>
          ))}
          <span className="tabs-envelope__pocket" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
