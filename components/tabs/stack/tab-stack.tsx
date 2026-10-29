"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Personal', name: 'Personal', last: '4242', kind: 'Debit' },
  { label: 'Work', name: 'Studio Ltd', last: '8810', kind: 'Credit' },
  { label: 'Travel', name: 'Travel', last: '0937', kind: 'Multi-currency' },
];

const css = `
  .tabs-stack { width: 250px; }
  .tabs-stack__list { display: flex; justify-content: center; gap: 4px; margin-bottom: 30px; }
  .tabs-stack__tab { padding: 5px 12px; border: 0; border-radius: 999px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
  .tabs-stack__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-stack__tab[aria-selected='true'] { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  .tabs-stack__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-stack__deck { position: relative; height: 128px; }
  .tabs-stack__card {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529));
    box-shadow: inset 0 1px 0 light-dark(#6d7179, #7d8087), 0 12px 24px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    z-index: calc(10 - var(--tabs-stack-k));
    opacity: calc(1 - var(--tabs-stack-k) * 0.25);
    transform: translateY(calc(var(--tabs-stack-k) * -12px)) scale(calc(1 - var(--tabs-stack-k) * 0.06));
    transform-origin: 50% 0;
    transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.3s;
  }
  .tabs-stack__top { display: flex; justify-content: space-between; color: light-dark(#42454c, #e5e6e9); font-size: 12px; font-weight: 600; }
  .tabs-stack__chip { width: 26px; height: 19px; border-radius: 4px; background: linear-gradient(135deg, light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087)); }
  .tabs-stack__num { color: light-dark(#373a40, #f1f2f3); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 14px; letter-spacing: 0.12em; }
  .tabs-stack__kind { color: light-dark(#50535b, #c6c8cd); font-size: 11px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-stack__card { transition: none; }
  }
`;

export function StackTabs() {
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
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-stack">
        <div className="tabs-stack__list" role="tablist" aria-label="Cards" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-stack__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="tabs-stack__deck">
          {TABS.map((t, i) => (
            <div
              key={t.label}
              className="tabs-stack__card"
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              aria-hidden={sel !== i}
              inert={sel !== i}
              style={{ '--tabs-stack-k': (i - sel + TABS.length) % TABS.length } as React.CSSProperties}
            >
              <span className="tabs-stack__top">
                {t.name}
                <span className="tabs-stack__chip" aria-hidden="true" />
              </span>
              <span className="tabs-stack__num">•••• {t.last}</span>
              <span className="tabs-stack__kind">{t.kind}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
