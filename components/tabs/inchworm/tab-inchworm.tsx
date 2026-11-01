"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Overview', body: 'Revenue is up 12% on last month, led by annual plans.' },
  { label: 'Activity', body: 'Three people joined the team and two invoices were paid today.' },
  { label: 'Settings', body: 'Billing, team access and when we send you notifications.' },
];

const css = `
  .tabs-inchworm { width: 260px; }
  .tabs-inchworm__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); box-shadow: inset 0 -1px 0 light-dark(#ebedf0, #232529); }
  .tabs-inchworm__tab { padding: 10px 0 13px; border: 0; border-radius: 6px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.2s; }
  .tabs-inchworm__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-inchworm__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-inchworm__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-inchworm__worm {
    position: absolute;
    bottom: 0;
    height: 2px;
    border-radius: 1px;
    background: light-dark(#373a40, #f1f2f3);
    left: calc(var(--tabs-inchworm-i) / 3 * 100% + 16px);
    right: calc((2 - var(--tabs-inchworm-i)) / 3 * 100% + 16px);
    transition:
      left 0.32s cubic-bezier(0.6, 0, 0.2, 1) var(--tabs-inchworm-tail-l),
      right 0.32s cubic-bezier(0.6, 0, 0.2, 1) var(--tabs-inchworm-tail-r);
  }
  .tabs-inchworm__panel { padding: 14px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-inchworm__worm { transition: none; }
  }
`;

export function InchwormTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [dir, setDir] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setDir(Math.sign(i - sel));
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
      <div
        className="tabs-inchworm"
        style={
          {
            '--tabs-inchworm-i': sel,
            // The edge facing the new tab sets off first; the tail follows a beat later.
            '--tabs-inchworm-tail-l': dir > 0 ? '0.14s' : '0s',
            '--tabs-inchworm-tail-r': dir > 0 ? '0s' : '0.14s',
          } as React.CSSProperties
        }
      >
        <div className="tabs-inchworm__list" role="tablist" aria-label="Dashboard" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-inchworm__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              {t.label}
            </button>
          ))}
          <span className="tabs-inchworm__worm" aria-hidden="true" />
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-inchworm__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
