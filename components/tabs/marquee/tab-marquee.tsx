"use client";

import * as React from "react";
import { useId, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  { label: 'Matinee', body: '2:30 pm. Stalls from $38, with a talk from the cast after.' },
  { label: 'Evening', body: '7:45 pm. Two hours and ten minutes, with one interval.' },
  { label: 'Late', body: '10:30 pm. A stripped-back cabaret set in the bar.' },
];
const MOVE = '0.55s cubic-bezier(0.3, 1.15, 0.45, 1)';

const css = `
  .tabs-marquee { width: 270px; }
  .tabs-marquee__list { position: relative; display: flex; justify-content: center; gap: 8px; padding: 6px 0; }
  .tabs-marquee__tab { position: relative; z-index: 1; border: 0; padding: 9px 16px; border-radius: 10px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-marquee__tab:hover, .tabs-marquee__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-marquee__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 4px; }
  .tabs-marquee__frame {
    position: absolute;
    overflow: visible;
    pointer-events: none;
    visibility: hidden;
    transition: left ${MOVE}, top ${MOVE}, width ${MOVE}, height ${MOVE};
  }
  .tabs-marquee__bulbs, .tabs-marquee__lit { fill: none; stroke-width: 3; stroke-linecap: round; }
  .tabs-marquee__bulbs { stroke: light-dark(#cbced3, #393c41); stroke-dasharray: 0 7; }
  /* Every third bulb is lit, and the lit pattern runs round the frame. */
  .tabs-marquee__lit {
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-dasharray: 0 21;
    filter: drop-shadow(0 0 2px light-dark(#373a40, #f1f2f3));
    animation: tabs-marquee-chase 0.9s linear infinite;
  }
  @keyframes tabs-marquee-chase {
    to { stroke-dashoffset: -21; }
  }
  .tabs-marquee__panel { padding: 12px 4px 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-marquee__frame { transition: none; }
    .tabs-marquee__lit { animation: none; }
  }
`;

export function MarqueeTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const frame = useRef<SVGSVGElement>(null);

  // The frame takes the active tab's box; the transition carries the lights across.
  useLayoutEffect(() => {
    const place = () => {
      const t = tabs.current[sel]!;
      const f = frame.current!;
      Object.assign(f.style, { left: `${t.offsetLeft}px`, top: `${t.offsetTop}px`, width: `${t.offsetWidth}px`, height: `${t.offsetHeight}px`, visibility: 'visible' });
    };
    place();
    document.fonts?.ready.then(place);
  }, [sel]);

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
      <div className="tabs-marquee">
        <div className="tabs-marquee__list" role="tablist" aria-label="Showtimes" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-marquee__tab"
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
          <svg className="tabs-marquee__frame" ref={frame} aria-hidden="true">
            <rect className="tabs-marquee__bulbs" width="100%" height="100%" rx={10} />
            <rect className="tabs-marquee__lit" width="100%" height="100%" rx={10} />
          </svg>
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-marquee__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
