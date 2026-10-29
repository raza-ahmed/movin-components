"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Draft', body: 'Dear Sam, the garden is finally in bloom. Come see it.' },
  { label: 'Reply', body: 'Sam wrote back: Saturday works. I will bring the cake.' },
  { label: 'P.S.', body: 'P.S. Bring the old camera if you still have it.' },
];

const css = `
  @keyframes tabs-typewriter-blink { 50% { opacity: 0; } }
  .tabs-typewriter { width: 250px; }
  .tabs-typewriter__list { display: flex; gap: 14px; padding: 0 4px 8px; border-bottom: 1px solid light-dark(#ebedf0, #232529); }
  .tabs-typewriter__tab { padding: 4px 0; border: 0; border-radius: 4px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; cursor: pointer; transition: color 0.2s; }
  .tabs-typewriter__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-typewriter__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 5px; }
  .tabs-typewriter__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-typewriter__panel { min-height: 76px; padding: 12px 4px 0; color: light-dark(#42454c, #e5e6e9); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; line-height: 1.6; }
  .tabs-typewriter__caret { display: inline-block; width: 7px; height: 14px; margin-left: 1px; vertical-align: -2px; background: light-dark(#373a40, #f1f2f3); animation: tabs-typewriter-blink 1s steps(1) infinite; }
  .tabs-typewriter__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-typewriter__caret { animation: none; }
  }
`;

export function TypewriterTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [typed, setTyped] = useState(TABS[0].body.length);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const full = TABS[sel].body.length;

  useEffect(() => {
    if (typed >= full) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 24);
    return () => clearTimeout(t);
  }, [typed, full]);

  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setTyped(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? TABS[i].body.length : 0);
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
      <div className="tabs-typewriter">
        <div className="tabs-typewriter__list" role="tablist" aria-label="Letter" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-typewriter__tab"
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
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-typewriter__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {/* Screen readers get the whole sentence at once; the typing is for the eyes only. */}
            <span className="tabs-typewriter__sr">{t.body}</span>
            <span aria-hidden="true">
              {t.body.slice(0, sel === i ? typed : 0)}
              <span className="tabs-typewriter__caret" />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
