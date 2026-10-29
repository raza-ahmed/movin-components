"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'North', title: 'PROJECT NORTH', body: 'Mapping the coast with low-flying drones.' },
  { label: 'Harbor', title: 'PROJECT HARBOR', body: 'A quieter engine for the night ferries.' },
  { label: 'Summit', title: 'PROJECT SUMMIT', body: 'Weather stations on the three high peaks.' },
];
const GLYPHS = '#%&*+=<>/\\[]{}?!0123456789ABCDEFXYZ';
const FRAMES = 22;

const css = `
  @keyframes tabs-decode-body { from { opacity: 0; } }
  .tabs-decode { width: 250px; }
  .tabs-decode__list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 12px; }
  .tabs-decode__tab { padding: 6px 0; border: 0; border-radius: 6px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); color: light-dark(#5f626a, #a7abb2); font: inherit; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: color 0.2s, box-shadow 0.2s; }
  .tabs-decode__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-decode__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 0 0 1px light-dark(#50535b, #c6c8cd); }
  .tabs-decode__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-decode__panel { min-height: 72px; padding: 0 4px; }
  .tabs-decode__title { display: block; margin-bottom: 6px; color: light-dark(#373a40, #f1f2f3); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 15px; font-weight: 600; letter-spacing: 0.06em; white-space: pre; }
  .tabs-decode__body { display: block; color: light-dark(#50535b, #c6c8cd); font-size: 12.5px; line-height: 1.5; }
  .tabs-decode[data-armed] .tabs-decode__body { animation: tabs-decode-body 0.5s ease-out 0.25s backwards; }
  .tabs-decode__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-decode__body { animation: none !important; }
  }
`;

// Frame f of the decode: each letter cycles through symbols, then locks in, left to right.
const scramble = (text: string, f: number) =>
  text
    .split('')
    .map((c, i) => (c === ' ' || f >= FRAMES || f > i * 1.3 + 4 ? c : GLYPHS[(i * 7 + f * 13) % GLYPHS.length]))
    .join('');

export function DecodeTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [frame, setFrame] = useState(FRAMES);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (frame >= FRAMES) return;
    const t = setTimeout(() => setFrame((f) => f + 1), 35);
    return () => clearTimeout(t);
  }, [frame]);

  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setFrame(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? FRAMES : 0);
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
      <div className="tabs-decode" data-armed={frame < FRAMES ? '' : undefined}>
        <div className="tabs-decode__list" role="tablist" aria-label="Projects" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-decode__tab"
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
          <div key={t.label} className="tabs-decode__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <span className="tabs-decode__sr">{t.title}</span>
            <span className="tabs-decode__title" aria-hidden="true">
              {sel === i ? scramble(t.title, frame) : t.title}
            </span>
            <span className="tabs-decode__body">{t.body}</span>
          </div>
        ))}
      </div>
    </>
  );
}
