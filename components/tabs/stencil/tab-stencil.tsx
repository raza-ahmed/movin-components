"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Preview', body: 'The component running live, exactly as it ships.' },
  { label: 'Code', body: 'React and Tailwind, or plain HTML, CSS and JavaScript.' },
  { label: 'Prompt', body: 'A description to paste into your AI tool of choice.' },
];

const SLIDE = '0.5s cubic-bezier(0.3, 1.3, 0.5, 1)';

const css = `
  .tabs-stencil { width: 260px; }
  .tabs-stencil__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); height: 40px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .tabs-stencil__pill {
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: calc(var(--tabs-stencil-i) * 100% / 3 + 4px);
    width: calc(100% / 3 - 8px);
    border-radius: 8px;
    box-shadow: 0 1px 2px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), 0 4px 10px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.3));
    transition: left ${SLIDE};
  }
  .tabs-stencil__tab, .tabs-stencil__ink span { display: grid; place-items: center; font-size: 13px; font-weight: 500; }
  .tabs-stencil__tab { border: 0; border-radius: 12px; background: none; color: light-dark(#50535b, #c6c8cd); font-family: inherit; cursor: pointer; transition: color 0.2s; }
  .tabs-stencil__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-stencil__tab:focus-visible { outline: none; }
  .tabs-stencil__list:has(:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  /* The labels again, inverted on the pill colour, clipped to the pill: they split mid-letter as it slides. */
  .tabs-stencil__ink {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-radius: 12px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    pointer-events: none;
    clip-path: inset(4px calc((2 - var(--tabs-stencil-i)) * 100% / 3 + 4px) 4px calc(var(--tabs-stencil-i) * 100% / 3 + 4px) round 8px);
    transition: clip-path ${SLIDE};
  }
  .tabs-stencil__panel { padding: 14px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-stencil__pill, .tabs-stencil__ink { transition: none; }
  }
`;

export function StencilTabs() {
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
      <div className="tabs-stencil" style={{ '--tabs-stencil-i': sel } as React.CSSProperties}>
        <div className="tabs-stencil__list" role="tablist" aria-label="Component view" onKeyDown={onKeyDown}>
          <span className="tabs-stencil__pill" aria-hidden="true" />
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-stencil__tab"
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
          <span className="tabs-stencil__ink" aria-hidden="true">
            {TABS.map((t) => (
              <span key={t.label}>{t.label}</span>
            ))}
          </span>
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-stencil__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
