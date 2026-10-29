"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Mail', glyph: 'M4 7l8 6 8-6M4 6h16v12H4Z', body: 'Three unread, one from the studio.' },
  { label: 'Calendar', glyph: 'M5 6h14v13H5ZM5 10h14M9 4v4M15 4v4', body: 'Stand-up at 10, design review at 3.' },
  { label: 'Photos', glyph: 'M4 17l5-5 4 4 3-3 4 4M5 5h14v14H5Z', body: 'Forty new shots from the weekend.' },
  { label: 'Music', glyph: 'M9 17V6l10-2v11M9 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM19 15a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z', body: 'Your focus mix, 48 minutes left.' },
  { label: 'Notes', glyph: 'M6 4h12v16H6ZM9 9h6M9 13h6M9 17h3', body: 'Groceries, the talk outline and a poem.' },
];

const css = `
  .tabs-dock { display: grid; justify-items: center; gap: 12px; width: 270px; }
  .tabs-dock__screen { width: 100%; min-height: 54px; padding: 12px 14px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .tabs-dock__app { display: block; margin-bottom: 2px; color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .tabs-dock__body { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .tabs-dock__list { display: flex; align-items: flex-end; gap: 6px; height: 74px; padding: 8px 8px 12px; border-radius: 18px; background: color-mix(in oklab, light-dark(#ebedf0, #232529) 80%, transparent); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 12px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-dock__tab {
    position: relative;
    display: grid;
    place-items: center;
    width: calc(38px * var(--tabs-dock-s, 1));
    height: calc(38px * var(--tabs-dock-s, 1));
    padding: 0;
    border: 0;
    border-radius: 28%;
    background: linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#dbdde1, #2e3035));
    box-shadow: inset 0 1px 0 light-dark(#5f626a, #a7abb2), 0 4px 8px -4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    color: light-dark(#373a40, #f1f2f3);
    cursor: pointer;
    transition: width 0.12s ease-out, height 0.12s ease-out;
  }
  .tabs-dock__tab svg { width: 55%; height: 55%; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .tabs-dock__tab::after { content: ''; position: absolute; bottom: -8px; left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); opacity: 0; transition: opacity 0.2s; }
  .tabs-dock__tab[aria-selected='true']::after { opacity: 1; }
  .tabs-dock__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-dock__tab { transition: none; }
  }
`;

export function DockTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  // Magnify by distance from the pointer: the icon under it grows most, its neighbours a little.
  const magnify = (x: number | null) => {
    for (const el of tabs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const d = x === null ? Infinity : Math.abs(x - (r.left + r.width / 2));
      el.style.setProperty('--tabs-dock-s', (1 + 0.45 * Math.max(0, 1 - d / 90)).toFixed(3));
    }
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-dock">
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-dock__screen" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <span className="tabs-dock__app">{t.label}</span>
            <span className="tabs-dock__body">{t.body}</span>
          </div>
        ))}
        <div
          className="tabs-dock__list"
          role="tablist"
          aria-label="Apps"
          onKeyDown={onKeyDown}
          onPointerMove={(e) => e.pointerType === 'mouse' && magnify(e.clientX)}
          onPointerLeave={() => magnify(null)}
        >
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-dock__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-label={t.label}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={t.glyph} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
