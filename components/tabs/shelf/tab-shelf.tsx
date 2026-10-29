"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const BOOKS = [
  { label: 'Dune', author: 'Frank Herbert', note: 'Bookmark at the desert crossing.', w: 30, h: 96, c: 'light-dark(#6d7179, #7d8087)' },
  { label: 'Emma', author: 'Jane Austen', note: 'Finished in May. Loved the ending.', w: 24, h: 84, c: 'light-dark(#50535b, #c6c8cd)' },
  { label: 'Beloved', author: 'Toni Morrison', note: 'Next up for the book club.', w: 34, h: 102, c: 'light-dark(#cbced3, #393c41)' },
  { label: 'Kindred', author: 'Octavia E. Butler', note: 'Borrowed from Lena, due Friday.', w: 28, h: 90, c: 'light-dark(#5f626a, #a7abb2)' },
  { label: 'Ulysses', author: 'James Joyce', note: 'Started three times. Maybe this year.', w: 38, h: 98, c: 'light-dark(#dbdde1, #2e3035)' },
];

const css = `
  .tabs-shelf { width: 250px; }
  .tabs-shelf__list { display: flex; align-items: flex-end; justify-content: center; gap: 3px; height: 116px; padding: 0 14px; border-bottom: 6px solid light-dark(#cbced3, #393c41); border-radius: 0 0 3px 3px; box-shadow: 0 8px 12px -8px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .tabs-shelf__tab {
    position: relative;
    display: grid;
    place-items: center;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: 3px 3px 1px 1px;
    background: var(--tabs-shelf-c);
    box-shadow: inset 2px 0 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 18%, transparent), inset -2px 0 0 light-dark(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.18));
    cursor: pointer;
    transform-origin: 0 100%;
    transition: transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 0.3s;
  }
  .tabs-shelf__tab::before, .tabs-shelf__tab::after { content: ''; position: absolute; left: 4px; right: 4px; height: 2px; background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent); }
  .tabs-shelf__tab::before { top: 10px; }
  .tabs-shelf__tab::after { bottom: 10px; }
  .tabs-shelf__title { color: light-dark(#373a40, #f1f2f3); font-size: 11px; font-weight: 600; letter-spacing: 0.04em; writing-mode: vertical-rl; transform: rotate(180deg); }
  .tabs-shelf__tab:hover { transform: translateY(-4px); }
  .tabs-shelf__tab[aria-selected='true'] { transform: translate(4px, -14px) rotate(-9deg); box-shadow: inset 2px 0 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 18%, transparent), 6px 10px 14px -6px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .tabs-shelf__tab:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 2px; }
  .tabs-shelf__panel { min-height: 56px; padding: 12px 4px 0; text-align: center; }
  .tabs-shelf__name { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; }
  .tabs-shelf__author { display: block; margin-bottom: 4px; color: light-dark(#5f626a, #a7abb2); font-size: 11.5px; }
  .tabs-shelf__note { color: light-dark(#50535b, #c6c8cd); font-size: 12.5px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-shelf__tab { transition: none; }
  }
`;

export function ShelfTabs() {
  const id = useId();
  const [sel, setSel] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = BOOKS.length;
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
      <div className="tabs-shelf">
        <div className="tabs-shelf__list" role="tablist" aria-label="Books" onKeyDown={onKeyDown}>
          {BOOKS.map((b, i) => (
            <button
              key={b.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-shelf__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              style={{ width: b.w, height: b.h, '--tabs-shelf-c': b.c } as React.CSSProperties}
              onClick={() => setSel(i)}
            >
              <span className="tabs-shelf__title">{b.label}</span>
            </button>
          ))}
        </div>
        {BOOKS.map((b, i) => (
          <div key={b.label} className="tabs-shelf__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <span className="tabs-shelf__name">{b.label}</span>
            <span className="tabs-shelf__author">{b.author}</span>
            <span className="tabs-shelf__note">{b.note}</span>
          </div>
        ))}
      </div>
    </>
  );
}
