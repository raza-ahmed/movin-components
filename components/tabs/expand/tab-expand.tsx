"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ICONS = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </>
  ),
  saved: <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />,
  profile: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" />
    </>
  ),
};

const TABS = [
  { label: 'Home', icon: ICONS.home, body: 'Your feed, with the newest work first.' },
  { label: 'Search', icon: ICONS.search, body: 'Find people, projects and tags.' },
  { label: 'Saved', icon: ICONS.saved, body: 'Twelve things you kept for later.' },
  { label: 'Profile', icon: ICONS.profile, body: 'Your work, your bio and your links.' },
];

const css = `
  .tabs-expand { width: 260px; display: flex; flex-direction: column; align-items: center; }
  .tabs-expand__list { display: flex; gap: 2px; padding: 5px; border-radius: 999px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .tabs-expand__tab {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 10px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: light-dark(#5f626a, #a7abb2);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }
  .tabs-expand__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-expand__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-expand__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-expand__icon { width: 20px; height: 20px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  /* The label opens from zero width: a one-column grid animating 0fr to 1fr. */
  .tabs-expand__label { display: grid; grid-template-columns: 0fr; opacity: 0; transition: grid-template-columns 0.4s cubic-bezier(0.3, 1.2, 0.5, 1), opacity 0.2s; }
  .tabs-expand__label > span { overflow: hidden; white-space: nowrap; }
  .tabs-expand__label > span > span { display: block; padding-left: 7px; padding-right: 2px; }
  .tabs-expand__tab[aria-selected='true'] .tabs-expand__label { grid-template-columns: 1fr; opacity: 1; transition-delay: 0s, 0.1s; }
  .tabs-expand__panel { align-self: stretch; padding: 14px 6px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-expand__tab, .tabs-expand__label { transition: none !important; }
  }
`;

export function ExpandTabs() {
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
      <div className="tabs-expand">
        <div className="tabs-expand__list" role="tablist" aria-label="Sections" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-expand__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              aria-label={t.label}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <svg className="tabs-expand__icon" viewBox="0 0 24 24" aria-hidden="true">
                {t.icon}
              </svg>
              <span className="tabs-expand__label" aria-hidden="true">
                <span>
                  <span>{t.label}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-expand__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
