"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Spring', body: 'Washed linens and unlined jackets in chalk and sage.' },
  { label: 'Summer', body: 'Open weaves, raw silk and sandals made in Porto.' },
  { label: 'Autumn', body: 'Brushed wool, corduroy and a long camel coat.' },
];
const TIGHT = '0.06em';
const OPEN = '0.42em';
const EASE = '0.55s cubic-bezier(0.3, 1, 0.35, 1)';

const css = `
  .tabs-kern { width: 280px; }
  .tabs-kern__list { display: flex; justify-content: center; gap: 22px; }
  .tabs-kern__tab { border: 0; padding: 8px 0; background: none; font: inherit; font-size: 11px; font-weight: 600; text-transform: uppercase; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.4s; }
  .tabs-kern__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-kern__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-kern__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 4px; }
  /* Letter spacing also follows the last letter, so a negative margin takes that trailing space back. */
  .tabs-kern__word { position: relative; display: inline-block; letter-spacing: ${TIGHT}; margin-right: -${TIGHT}; transition: letter-spacing ${EASE}, margin-right ${EASE}; }
  .tabs-kern__word::after {
    content: '';
    position: absolute;
    left: 0;
    right: ${TIGHT};
    bottom: -5px;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transition: transform ${EASE}, right ${EASE};
  }
  .tabs-kern__tab[aria-selected='true'] .tabs-kern__word { letter-spacing: ${OPEN}; margin-right: -${OPEN}; }
  .tabs-kern__tab[aria-selected='true'] .tabs-kern__word::after { right: ${OPEN}; transform: scaleX(1); }
  .tabs-kern__panel { padding: 16px 8px 0; min-height: calc(3.1em + 16px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-kern__word, .tabs-kern__word::after { transition: none; }
  }
`;

export function KernTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = TABS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
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
      <div className="tabs-kern">
        <div className="tabs-kern__list" role="tablist" aria-label="Collections" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-kern__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span className="tabs-kern__word">{t.label}</span>
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-kern__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
