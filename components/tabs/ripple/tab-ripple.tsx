"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'All', body: 'Everything in the library, newest first: 248 sounds.' },
  { label: 'Ambient', body: 'Rooms, weather and city air, for under everything else.' },
  { label: 'Foley', body: 'Footsteps, cloth and paper, recorded close.' },
  { label: 'Interface', body: 'Clicks, ticks and soft confirmations for product work.' },
];

const css = `
  .tabs-ripple { position: relative; width: 280px; }
  .tabs-ripple__list { display: flex; gap: 18px; }
  .tabs-ripple__tab { position: relative; border: 0; padding: 8px 0; background: none; font: inherit; font-size: 14px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-ripple__tab:hover, .tabs-ripple__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-ripple__tab::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    height: 1.5px;
    border-radius: 1px;
    background: currentColor;
    transform: scaleX(0);
    transition: transform 0.4s cubic-bezier(0.3, 1.2, 0.5, 1);
  }
  .tabs-ripple__tab[aria-selected='true']::after { transform: scaleX(1); }
  .tabs-ripple__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 4px; }
  .tabs-ripple__letter { display: inline-block; white-space: pre; }
  .tabs-ripple__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .tabs-ripple__panel { padding: 14px 0 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-ripple__tab::after { transition: none; }
  }
`;

export function RippleTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Every letter bobs once, later and smaller the further it sits from where the ripple started.
  const ripple = (x: number) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = root.current!.getBoundingClientRect();
    root.current!.querySelectorAll<HTMLElement>('.tabs-ripple__letter').forEach((l) => {
      const r = l.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - box.left - x);
      const a = 7 * Math.exp(-d / 170);
      if (a < 0.5) return;
      l.animate([{ transform: 'none' }, { transform: `translateY(${-a}px)`, offset: 0.3 }, { transform: `translateY(${a * 0.28}px)`, offset: 0.65 }, { transform: 'none' }], {
        duration: 620,
        delay: d / 0.42,
        easing: 'ease-in-out',
      });
    });
  };
  const pick = (i: number, x?: number) => {
    setSel(i);
    const t = tabs.current[i]!;
    ripple(x ?? t.offsetLeft + t.offsetWidth / 2);
  };
  const n = TABS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
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
      <div className="tabs-ripple" ref={root}>
        <div className="tabs-ripple__list" role="tablist" aria-label="Sound library" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-ripple__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              // A pointer starts the ripple where it pressed; Enter and Space start it at the tab's centre.
              onClick={(e) => pick(i, e.detail ? e.clientX - root.current!.getBoundingClientRect().left : undefined)}
            >
              <span className="tabs-ripple__sr">{t.label}</span>
              <span aria-hidden="true">
                {[...t.label].map((c, k) => (
                  <span key={k} className="tabs-ripple__letter">
                    {c}
                  </span>
                ))}
              </span>
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-ripple__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
