"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const VIEWS = [
  { label: 'North', body: 'The hills, and on a clear day the wind farm beyond them.' },
  { label: 'East', body: 'The river bend where the herons stand at first light.' },
  { label: 'South', body: 'Rooftops down to the harbour and the ferry coming in.' },
  { label: 'West', body: 'Open fields, and the best of the sunsets in August.' },
];

const css = `
  .tabs-fog { width: 240px; }
  .tabs-fog__list { display: grid; grid-template-columns: repeat(${VIEWS.length}, 1fr); }
  .tabs-fog__tab { display: grid; justify-items: center; gap: 6px; padding: 0; border: 0; background: none; font: inherit; font-size: 12px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-fog__tab:hover, .tabs-fog__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-fog__tab:focus-visible { outline: none; }
  .tabs-fog__tab:focus-visible .tabs-fog__pane { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .tabs-fog__pane { position: relative; width: 52px; height: 52px; border-radius: 6px; overflow: hidden; box-shadow: inset 0 0 0 2px light-dark(#dbdde1, #2e3035); }
  .tabs-fog__pane svg { display: block; width: 100%; height: 100%; }
  .tabs-fog__sky { fill: light-dark(#ebedf0, #232529); }
  .tabs-fog__a { fill: light-dark(#6d7179, #7d8087); }
  .tabs-fog__b { fill: light-dark(#50535b, #c6c8cd); }
  /* Condensation: a hazy layer that blurs the view behind it, with a scatter of droplets. */
  .tabs-fog__mist {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 40%, light-dark(#42454c, #e5e6e9) 0.7px, transparent 1.3px) 0 0 / 9px 11px,
      radial-gradient(circle at 70% 20%, light-dark(#50535b, #c6c8cd) 0.6px, transparent 1.2px) 3px 5px / 13px 9px,
      color-mix(in srgb, light-dark(#5f626a, #a7abb2) 38%, transparent);
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    clip-path: inset(0);
    animation: tabs-fog-mist 1.6s ease-in;
  }
  @keyframes tabs-fog-mist {
    from { opacity: 0; }
  }
  /* The chosen pane is wiped clear in the direction you moved; the one you left mists back over. */
  .tabs-fog__tab[aria-selected='true'] .tabs-fog__mist { clip-path: inset(0 0 0 100%); animation: none; transition: clip-path 0.5s cubic-bezier(0.5, 0, 0.3, 1); }
  .tabs-fog[data-dir='left'] .tabs-fog__tab[aria-selected='true'] .tabs-fog__mist { clip-path: inset(0 100% 0 0); }
  .tabs-fog__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-fog__mist, .tabs-fog__tab[aria-selected='true'] .tabs-fog__mist { animation: none; transition: none; }
  }
`;

function View({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <rect className="tabs-fog__sky" width={52} height={52} />
      {i === 0 && <path className="tabs-fog__a" d="M0 40L16 24L28 34L40 20L52 32V52H0Z" />}
      {i === 1 && (
        <>
          <circle className="tabs-fog__b" cx={36} cy={16} r={6} />
          <path className="tabs-fog__a" d="M0 36Q26 28 52 38V52H0Z" />
        </>
      )}
      {i === 2 && <path className="tabs-fog__a" d="M4 52V30L12 24L20 30V52Z M24 52V22H36V52Z M40 52V34H50V52Z" />}
      {i === 3 && (
        <>
          <circle className="tabs-fog__b" cx={26} cy={34} r={9} />
          <rect className="tabs-fog__a" y={36} width={52} height={16} />
        </>
      )}
    </svg>
  );
}

export function FogTabs() {
  const id = useId();
  const [s, setS] = useState({ sel: 0, dir: 'right' });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (i: number) => setS((o) => (i === o.sel ? o : { sel: i, dir: i > o.sel ? 'right' : 'left' }));
  const n = VIEWS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (s.sel + 1) % n, ArrowLeft: (s.sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    pick(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-fog" data-dir={s.dir}>
        <div className="tabs-fog__list" role="tablist" aria-label="Views" onKeyDown={onKeyDown}>
          {VIEWS.map((v, i) => (
            <button
              key={v.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-fog__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={s.sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={s.sel === i ? 0 : -1}
              onClick={() => pick(i)}
            >
              <span className="tabs-fog__pane" aria-hidden="true">
                <View i={i} />
                <span className="tabs-fog__mist" />
              </span>
              {v.label}
            </button>
          ))}
        </div>
        {VIEWS.map((v, i) => (
          <div key={v.label} className="tabs-fog__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={s.sel !== i}>
            {v.body}
          </div>
        ))}
      </div>
    </>
  );
}
