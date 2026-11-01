"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Origins', title: 'Chapter one', body: 'A winter studio, a borrowed press and a stack of offcuts.' },
  { label: 'Method', title: 'Chapter two', body: 'Six colours, printed by hand, one pass at a time.' },
  { label: 'Materials', title: 'Chapter three', body: 'Cotton rag paper and inks mixed on the day.' },
  { label: 'Credits', title: 'Chapter four', body: 'Everyone who lent a hand, a room or an opinion.' },
];

const css = `
  .tabs-contents { display: flex; width: 260px; }
  .tabs-contents__list { display: flex; flex-direction: column; width: 122px; flex: none; padding-right: 14px; box-shadow: inset -1px 0 0 light-dark(#ebedf0, #232529); }
  .tabs-contents__tab {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 30px;
    padding: 0 4px 0 0;
    border: 0;
    border-radius: 4px;
    background: none;
    color: light-dark(#5f626a, #a7abb2);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: color 0.3s;
  }
  .tabs-contents__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-contents__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-contents__tab:focus-visible { outline: 1px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-contents__num { width: 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-style: italic; font-weight: 400; font-variant-numeric: lining-nums tabular-nums; color: light-dark(#6d7179, #7d8087); transition: color 0.3s; }
  .tabs-contents__tab[aria-selected='true'] .tabs-contents__num { color: light-dark(#373a40, #f1f2f3); }
  /* The leader draws out to the chosen chapter and pushes its name along. */
  .tabs-contents__leader { width: 8px; height: 1px; flex: none; background: light-dark(#cbced3, #393c41); transition: width 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.3s; }
  .tabs-contents__tab[aria-selected='true'] .tabs-contents__leader { width: 22px; background: light-dark(#373a40, #f1f2f3); }
  .tabs-contents__panel { flex: 1; min-width: 0; padding: 4px 0 0 16px; }
  .tabs-contents__panel > div { animation: tabs-contents-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1); }
  @keyframes tabs-contents-in {
    from { opacity: 0; transform: translateY(6px); filter: blur(3px); }
  }
  .tabs-contents__title { margin: 0 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-style: italic; font-weight: 400; color: light-dark(#373a40, #f1f2f3); }
  .tabs-contents__body { margin: 0; color: light-dark(#50535b, #c6c8cd); font-size: 12px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-contents__leader { transition: none; }
    .tabs-contents__panel > div { animation: none; }
  }
`;

export function ContentsTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowDown: (sel + 1) % n, ArrowRight: (sel + 1) % n, ArrowUp: (sel + n - 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
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
      <div className="tabs-contents">
        <div className="tabs-contents__list" role="tablist" aria-label="Contents" aria-orientation="vertical" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-contents__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span className="tabs-contents__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="tabs-contents__leader" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-contents__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {sel === i && (
              <div>
                <p className="tabs-contents__title">{t.title}</p>
                <p className="tabs-contents__body">{t.body}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
