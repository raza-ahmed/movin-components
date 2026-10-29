"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Inbox', body: 'Twelve new messages, three of them flagged for today.' },
  { label: 'Sent', body: 'Your last message went out to the design team at 9:14.' },
  { label: 'Drafts', body: 'Two drafts saved, the newest from this morning.' },
];

const css = `
  .tabs-ink { width: 260px; }
  .tabs-ink__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .tabs-ink__tab {
    position: relative;
    overflow: hidden;
    padding: 9px 0;
    border: 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#50535b, #c6c8cd);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    isolation: isolate;
    transition: color 0.3s;
  }
  .tabs-ink__tab::before {
    content: '';
    position: absolute;
    left: var(--tabs-ink-x, 50%);
    top: var(--tabs-ink-y, 50%);
    z-index: -1;
    width: 240%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .tabs-ink__tab[aria-selected='true'] { color: light-dark(#fbfcfd, #121417); }
  .tabs-ink__tab[aria-selected='true']::before { transform: translate(-50%, -50%) scale(1); }
  .tabs-ink__tab:hover { box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087); }
  .tabs-ink__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-ink__panel { padding: 14px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-ink__tab::before { transition: none; }
  }
`;

export function InkTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    tabs.current[next]?.style.removeProperty('--tabs-ink-x');
    tabs.current[next]?.style.removeProperty('--tabs-ink-y');
    setSel(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-ink">
        <div className="tabs-ink__list" role="tablist" aria-label="Mail" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-ink__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onPointerDown={(e) => {
                // The ink starts where you pressed.
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--tabs-ink-x', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--tabs-ink-y', `${e.clientY - r.top}px`);
              }}
              onClick={() => setSel(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-ink__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
