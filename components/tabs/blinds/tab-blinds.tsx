"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Coast', art: 'linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#dbdde1, #2e3035) 58%, light-dark(#5f626a, #a7abb2) 58% 62%, light-dark(#ebedf0, #232529) 62%)', caption: 'Cliffs at low tide' },
  { label: 'Forest', art: 'repeating-linear-gradient(90deg, light-dark(#ebedf0, #232529) 0 14px, light-dark(#cbced3, #393c41) 14px 18px), light-dark(#dbdde1, #2e3035)', caption: 'Pines after rain' },
  { label: 'Desert', art: 'radial-gradient(circle at 70% 30%, light-dark(#42454c, #e5e6e9) 0 12px, transparent 13px), linear-gradient(light-dark(#6d7179, #7d8087) 60%, light-dark(#5f626a, #a7abb2) 60%)', caption: 'Dunes at noon' },
];
const SLATS = [0, 1, 2, 3, 4, 5];

const css = `
  @keyframes tabs-blinds-open-a { from { transform: scaleY(1); } to { transform: scaleY(0); } }
  @keyframes tabs-blinds-open-b { from { transform: scaleY(1); } to { transform: scaleY(0); } }
  .tabs-blinds { width: 250px; }
  .tabs-blinds__list { display: grid; grid-template-columns: repeat(3, 1fr); margin-bottom: 10px; border-bottom: 1px solid light-dark(#ebedf0, #232529); }
  .tabs-blinds__tab { padding: 8px 0 10px; border: 0; border-radius: 6px; background: none; box-shadow: inset 0 -2px 0 transparent; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s, box-shadow 0.25s; }
  .tabs-blinds__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-blinds__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 -2px 0 light-dark(#373a40, #f1f2f3); }
  .tabs-blinds__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-blinds__frame { position: relative; height: 112px; overflow: hidden; border-radius: 12px; }
  .tabs-blinds__panel { height: 100%; }
  .tabs-blinds__art { display: block; height: 100%; background: var(--tabs-blinds-art); }
  .tabs-blinds__caption { position: absolute; left: 10px; bottom: 8px; padding: 2px 7px; border-radius: 5px; background: color-mix(in oklab, light-dark(#fbfcfd, #121417) 65%, transparent); color: light-dark(#373a40, #f1f2f3); font-size: 11px; }
  .tabs-blinds__slats { position: absolute; inset: 0; display: grid; grid-template-rows: repeat(6, 1fr); pointer-events: none; }
  .tabs-blinds__slat { background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 -1px 0 light-dark(#dbdde1, #2e3035); transform: scaleY(0); transform-origin: 50% 0; }
  .tabs-blinds[data-flip='a'] .tabs-blinds__slat { animation: tabs-blinds-open-a 0.32s cubic-bezier(0.5, 0, 0.3, 1) backwards; animation-delay: calc(var(--k) * 45ms); }
  .tabs-blinds[data-flip='b'] .tabs-blinds__slat { animation: tabs-blinds-open-b 0.32s cubic-bezier(0.5, 0, 0.3, 1) backwards; animation-delay: calc(var(--k) * 45ms); }
  @media (prefers-reduced-motion: reduce) {
    .tabs-blinds__slat { animation: none !important; }
  }
`;

export function BlindsTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [flip, setFlip] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setFlip((f) => f + 1);
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
      <div className="tabs-blinds" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}>
        <div className="tabs-blinds__list" role="tablist" aria-label="Gallery" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-blinds__tab"
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
        <div className="tabs-blinds__frame">
          {TABS.map((t, i) => (
            <div key={t.label} className="tabs-blinds__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              <span className="tabs-blinds__art" style={{ '--tabs-blinds-art': t.art } as React.CSSProperties} />
              <span className="tabs-blinds__caption">{t.caption}</span>
            </div>
          ))}
          <span className="tabs-blinds__slats" aria-hidden="true">
            {SLATS.map((k) => (
              <span key={k} className="tabs-blinds__slat" style={{ '--k': k } as React.CSSProperties} />
            ))}
          </span>
        </div>
      </div>
    </>
  );
}
