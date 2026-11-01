"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Atelier', body: 'Where each piece is cut, fitted and finished by hand.' },
  { label: 'Journal', body: 'Notes from the studio, published every other Sunday.' },
  { label: 'Archive', body: 'Every collection since the first, in one place.' },
];

const css = `
  .tabs-rise { width: 260px; }
  .tabs-rise__list { position: relative; display: flex; justify-content: space-between; padding: 0 6px 12px; }
  .tabs-rise__tab { padding: 6px 4px; border: 0; border-radius: 4px; background: none; font: inherit; font-size: 12px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; }
  .tabs-rise__tab:focus-visible { outline: 1px solid light-dark(#5f626a, #a7abb2); outline-offset: 4px; }
  /* Each letter is a column of three: muted, lit, muted. The window shows one row at a time. */
  .tabs-rise__word { display: flex; height: 1.4em; line-height: 1.4em; overflow: hidden; }
  .tabs-rise__ch {
    display: flex;
    flex-direction: column;
    transform: translateY(calc(var(--tabs-rise-row) * -1.4em));
    transition: transform 0.6s cubic-bezier(0.7, 0, 0.2, 1) calc(var(--tabs-rise-n) * 28ms);
  }
  .tabs-rise__ch > span:nth-child(odd) { color: light-dark(#5f626a, #a7abb2); }
  .tabs-rise__ch > span:nth-child(2) { color: light-dark(#373a40, #f1f2f3); }
  .tabs-rise__tab:hover .tabs-rise__ch > span:nth-child(odd) { color: light-dark(#42454c, #e5e6e9); }
  .tabs-rise__tab[data-row='0'] .tabs-rise__ch { --tabs-rise-row: 0; }
  .tabs-rise__tab[data-row='1'] .tabs-rise__ch { --tabs-rise-row: 1; }
  .tabs-rise__tab[data-row='2'] .tabs-rise__ch { --tabs-rise-row: 2; }
  /* Back to the first row without being seen: the lowest row and the first are the same muted letter. */
  .tabs-rise__tab[data-row='0'][data-reset] .tabs-rise__ch { transition: none; }
  .tabs-rise__rule { position: absolute; bottom: 0; height: 1px; background: light-dark(#373a40, #f1f2f3); transition: left 0.6s cubic-bezier(0.7, 0, 0.2, 1), width 0.6s cubic-bezier(0.7, 0, 0.2, 1); }
  .tabs-rise__panel { padding: 16px 10px 0; min-height: calc(3.1em + 16px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-rise__ch, .tabs-rise__rule { transition: none; }
  }
`;

export function RiseTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  // The tab just left keeps rolling upward to its last row, then resets out of sight.
  const [leaving, setLeaving] = useState<number | null>(null);
  const [rule, setRule] = useState({ left: 0, width: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const measure = () => {
      const t = tabs.current[sel];
      if (t) setRule({ left: t.offsetLeft + 4, width: t.offsetWidth - 8 - 0.16 * 12 });
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [sel]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const select = (i: number) => {
    if (i === sel) return;
    clearTimeout(timer.current);
    setLeaving(sel);
    setSel(i);
    timer.current = setTimeout(() => setLeaving(null), 600 + 28 * TABS[sel].label.length + 50);
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
      <div className="tabs-rise">
        <div className="tabs-rise__list" role="tablist" aria-label="Studio" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-rise__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              aria-label={t.label}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
              data-row={sel === i ? 1 : leaving === i ? 2 : 0}
              data-reset={leaving !== i && sel !== i ? '' : undefined}
            >
              <span className="tabs-rise__word" aria-hidden="true">
                {[...t.label].map((c, n) => (
                  <span key={n} className="tabs-rise__ch" style={{ '--tabs-rise-n': n } as React.CSSProperties}>
                    <span>{c}</span>
                    <span>{c}</span>
                    <span>{c}</span>
                  </span>
                ))}
              </span>
            </button>
          ))}
          <span className="tabs-rise__rule" style={rule} aria-hidden="true" />
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-rise__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
