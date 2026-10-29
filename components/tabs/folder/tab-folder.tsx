"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Docs', files: ['Brief.pdf', 'Contract.docx', 'Notes.md'] },
  { label: 'Images', files: ['Hero.png', 'Logo.svg', 'Team.jpg'] },
  { label: 'Archive', files: ['2024.zip', 'Old site.zip'] },
];

const css = `
  @keyframes tabs-folder-in { from { opacity: 0; transform: translateY(8px); } }
  .tabs-folder { width: 260px; }
  .tabs-folder__list { display: flex; gap: 2px; padding-left: 8px; }
  .tabs-folder__tab {
    position: relative;
    width: 76px;
    height: 30px;
    border: 0;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#5f626a, #a7abb2);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
    transform: translateY(4px);
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1), background-color 0.25s, color 0.25s;
  }
  .tabs-folder__tab:hover { color: light-dark(#42454c, #e5e6e9); transform: translateY(2px); }
  .tabs-folder__tab[aria-selected='true'] { z-index: 1; background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); transform: translateY(1px); }
  .tabs-folder__tab:focus-visible { outline: none; color: light-dark(#373a40, #f1f2f3); text-decoration: underline; text-underline-offset: 3px; }
  .tabs-folder__body { position: relative; height: 104px; padding: 12px 14px; border-radius: 4px 12px 12px 12px; background: light-dark(#ebedf0, #232529); box-shadow: 0 12px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-folder[data-armed] .tabs-folder__panel { animation: tabs-folder-in 0.35s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .tabs-folder__file { display: flex; align-items: center; gap: 8px; padding: 4px 0; color: light-dark(#42454c, #e5e6e9); font-size: 12.5px; }
  .tabs-folder__file::before { content: ''; width: 10px; height: 12px; border-radius: 2px; background: light-dark(#6d7179, #7d8087); }
  @media (prefers-reduced-motion: reduce) {
    .tabs-folder__tab { transition: none; }
    .tabs-folder__panel { animation: none !important; }
  }
`;

export function FolderTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    setArmed(true);
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
      <div className="tabs-folder" data-armed={armed ? '' : undefined}>
        <div className="tabs-folder__list" role="tablist" aria-label="Files" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-folder__tab"
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
        <div className="tabs-folder__body">
          {TABS.map((t, i) => (
            <div key={t.label} className="tabs-folder__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              {t.files.map((f) => (
                <div key={f} className="tabs-folder__file">
                  {f}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
