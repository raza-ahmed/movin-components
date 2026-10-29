"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Morning', title: 'Sunrise run', body: '5 km along the river, fog still on the water.' },
  { label: 'Lunch', title: 'Noodle bar', body: 'The spicy one, again. No regrets.' },
  { label: 'Evening', title: 'Rooftop', body: 'Friends, a slow sunset and one more song.' },
];

const css = `
  @keyframes tabs-stories-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes tabs-stories-in { from { opacity: 0; transform: scale(1.03); } }
  .tabs-stories { position: relative; width: 210px; height: 190px; overflow: hidden; border-radius: 16px; background: linear-gradient(170deg, light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529) 70%); box-shadow: 0 14px 28px -16px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-stories__list { position: absolute; left: 10px; right: 38px; top: 10px; display: flex; gap: 4px; }
  .tabs-stories__tab { position: relative; flex: 1; height: 3px; padding: 0; overflow: visible; border: 0; border-radius: 2px; background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent); cursor: pointer; }
  .tabs-stories__tab::before { content: ''; position: absolute; inset: -8px 0; }
  .tabs-stories__fill { position: absolute; inset: 0; border-radius: 2px; background: light-dark(#373a40, #f1f2f3); transform: scaleX(var(--tabs-stories-done)); transform-origin: 0 50%; }
  .tabs-stories__tab[aria-selected='true'] .tabs-stories__fill { animation: tabs-stories-fill 4s linear forwards; }
  .tabs-stories:hover .tabs-stories__fill, .tabs-stories:focus-within .tabs-stories__fill, .tabs-stories[data-paused] .tabs-stories__fill { animation-play-state: paused; }
  .tabs-stories__tab:focus-visible { outline: 2px solid light-dark(#373a40, #f1f2f3); outline-offset: 4px; }
  .tabs-stories__pause { position: absolute; right: 8px; top: 3px; display: grid; place-items: center; width: 24px; height: 18px; padding: 0; border: 0; border-radius: 5px; background: none; color: light-dark(#373a40, #f1f2f3); cursor: pointer; }
  .tabs-stories__pause:focus-visible { outline: 2px solid light-dark(#373a40, #f1f2f3); }
  .tabs-stories__pause svg { width: 12px; height: 12px; fill: currentColor; }
  .tabs-stories__panel { position: absolute; left: 0; right: 0; bottom: 0; padding: 16px; background: linear-gradient(transparent, color-mix(in oklab, light-dark(#fbfcfd, #121417) 55%, transparent)); }
  .tabs-stories[data-armed] .tabs-stories__panel { animation: tabs-stories-in 0.4s ease-out; }
  .tabs-stories__title { display: block; margin-bottom: 4px; color: light-dark(#373a40, #f1f2f3); font-size: 16px; font-weight: 600; }
  .tabs-stories__body { color: light-dark(#42454c, #e5e6e9); font-size: 12px; line-height: 1.45; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-stories__tab[aria-selected='true'] .tabs-stories__fill { animation: none; transform: scaleX(1); }
    .tabs-stories__panel { animation: none !important; }
  }
`;

export function StoriesTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  const [paused, setPaused] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    setArmed(true);
    setSel(i);
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
      <div className="tabs-stories" data-armed={armed ? '' : undefined} data-paused={paused ? '' : undefined}>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-stories__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <span className="tabs-stories__title">{t.title}</span>
            <span className="tabs-stories__body">{t.body}</span>
          </div>
        ))}
        <div className="tabs-stories__list" role="tablist" aria-label="Stories" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-stories__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-label={t.label}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              {/* The bar fills while the story plays; when it is full the next story starts. */}
              <span
                className="tabs-stories__fill"
                style={{ '--tabs-stories-done': i < sel ? 1 : 0 } as React.CSSProperties}
                onAnimationEnd={() => select((sel + 1) % TABS.length)}
              />
            </button>
          ))}
        </div>
        <button className="tabs-stories__pause" type="button" aria-label={paused ? 'Play stories' : 'Pause stories'} onClick={() => setPaused((p) => !p)}>
          <svg viewBox="0 0 12 12" aria-hidden="true">
            {paused ? <path d="M3 1.5v9l7.5-4.5Z" /> : <path d="M2.5 1.5h2.5v9H2.5ZM7 1.5h2.5v9H7Z" />}
          </svg>
        </button>
      </div>
    </>
  );
}
