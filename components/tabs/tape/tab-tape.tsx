"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TAGS = [
  { label: 'Recipes', tilt: -6, body: 'Forty-two saved, most of them soups and something with lemons.' },
  { label: 'Travel', tilt: 4, body: 'Train times, two hostels and a list of bakeries in Porto.' },
  { label: 'Gifts', tilt: -3, body: 'Ideas for Ana, Jun and Tom, with sizes noted down.' },
];

const css = `
  .tabs-tape { width: 240px; }
  .tabs-tape__list { display: grid; grid-template-columns: repeat(${TAGS.length}, 1fr); gap: 8px; padding-top: 8px; }
  .tabs-tape__tab { position: relative; height: 40px; padding: 4px 0 0; border: 0; border-radius: 4px; background: light-dark(#ebedf0, #232529); color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: color 0.3s, background-color 0.3s; }
  .tabs-tape__tab:hover, .tabs-tape__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-tape__tab[aria-selected='true'] { background: light-dark(#dbdde1, #2e3035); }
  .tabs-tape__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  /* A strip of washi tape with torn ends; the stripes sit on a see-through ground. */
  .tabs-tape__strip {
    position: absolute;
    left: 50%;
    top: -7px;
    width: 46px;
    height: 13px;
    margin-left: -23px;
    clip-path: polygon(3% 0, 97% 0, 100% 25%, 97% 50%, 100% 75%, 97% 100%, 3% 100%, 0 75%, 3% 50%, 0 25%);
    transform: rotate(var(--tilt));
  }
  .tabs-tape__strip span { position: absolute; inset: 0; background: repeating-linear-gradient(135deg, color-mix(in srgb, light-dark(#42454c, #e5e6e9) 70%, transparent) 0 4px, color-mix(in srgb, light-dark(#5f626a, #a7abb2) 70%, transparent) 4px 8px); }
  /* Laid: it unrolls from one end and is pressed flat. Peeled: it lifts away from the other end. */
  .tabs-tape__strip--lay { animation: tabs-tape-press 0.5s ease-out 0.2s backwards; }
  .tabs-tape__strip--lay span { animation: tabs-tape-lay 0.38s ease-out 0.2s backwards; }
  @keyframes tabs-tape-press {
    from { transform: rotate(var(--tilt)) translateY(-3px) scale(1.08); }
  }
  @keyframes tabs-tape-lay {
    from { clip-path: inset(0 100% 0 0); }
    to { clip-path: inset(0); }
  }
  .tabs-tape__strip--peel { animation: tabs-tape-lift 0.4s ease-in forwards; }
  .tabs-tape__strip--peel span { animation: tabs-tape-peel 0.4s ease-in forwards; }
  @keyframes tabs-tape-lift {
    to { transform: rotate(calc(var(--tilt) - 14deg)) translate(6px, -8px); opacity: 0; }
  }
  @keyframes tabs-tape-peel {
    from { clip-path: inset(0); }
    to { clip-path: inset(0 0 0 100%); }
  }
  .tabs-tape__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-tape__strip--lay, .tabs-tape__strip--lay span { animation: none; }
    .tabs-tape__strip--peel { display: none; }
  }
`;

export function TapeTabs() {
  const id = useId();
  const [s, setS] = useState({ sel: 0, prev: -1, gen: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (i: number) => setS((o) => (i === o.sel ? o : { sel: i, prev: o.sel, gen: o.gen + 1 }));
  const n = TAGS.length;
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
      <div className="tabs-tape">
        <div className="tabs-tape__list" role="tablist" aria-label="Collections" onKeyDown={onKeyDown}>
          {TAGS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-tape__tab"
              style={{ '--tilt': `${t.tilt}deg` } as React.CSSProperties}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={s.sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={s.sel === i ? 0 : -1}
              onClick={() => pick(i)}
            >
              {(i === s.sel || i === s.prev) && (
                <span key={`${i}-${s.gen}`} className={`tabs-tape__strip${i === s.prev ? ' tabs-tape__strip--peel' : s.gen ? ' tabs-tape__strip--lay' : ''}`} aria-hidden="true">
                  <span />
                </span>
              )}
              {t.label}
            </button>
          ))}
        </div>
        {TAGS.map((t, i) => (
          <div key={t.label} className="tabs-tape__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={s.sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
