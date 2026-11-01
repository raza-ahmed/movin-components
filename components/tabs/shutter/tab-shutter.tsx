"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  {
    label: 'Photo',
    body: 'Full resolution stills, with live focus peaking.',
    icon: (
      <>
        <path d="M5 9h3l1.5-2h5L16 9h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3" />
      </>
    ),
  },
  {
    label: 'Video',
    body: '4K at 24 or 60 frames, with the shutter at 180 degrees.',
    icon: (
      <>
        <path d="M4 8.5h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
        <path d="M15 11.5 20 9v8l-5-2.5" />
      </>
    ),
  },
  {
    label: 'Portrait',
    body: 'Soft background blur from f/1.4, adjustable after the shot.',
    icon: (
      <>
        <circle cx="12" cy="9.5" r="3.2" />
        <path d="M5.5 19c.8-3.4 3.3-5 6.5-5s5.7 1.6 6.5 5" />
      </>
    ),
  },
  { label: 'Pano', body: 'Sweep slowly from left to right; the level keeps you straight.', icon: <path d="M3 8c6 1.6 12 1.6 18 0v9c-6-1.6-12-1.6-18 0Z" /> },
];
const R = 20;
const C = 22;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** The blades as one shape: the disc with a turning hexagonal hole, plus the seams between the six blades. */
function iris(a: number) {
  const h = R * 1.3 * (1 - a);
  const rot = (a * Math.PI) / 3;
  const v = Array.from({ length: 6 }, (_, k) => [C + h * Math.cos(rot + (k * Math.PI) / 3), C + h * Math.sin(rot + (k * Math.PI) / 3)]);
  const hole = `M${v.map((p) => p.join(' ')).join('L')}Z`;
  const seams = v.map(([x, y], k) => {
    const [nx, ny] = v[(k + 1) % 6];
    const len = Math.hypot(nx - x, ny - y) || 1;
    return `M${x} ${y}L${x + ((nx - x) / len) * R * 2.2} ${y + ((ny - y) / len) * R * 2.2}`;
  });
  return { d: `M${C - R - 2} ${C}a${R + 2} ${R + 2} 0 1 0 ${2 * R + 4} 0a${R + 2} ${R + 2} 0 1 0 ${-2 * R - 4} 0Z${hole}`, seams: seams.join('') };
}

const css = `
  .tabs-shutter { width: 260px; }
  .tabs-shutter__list { display: flex; justify-content: center; gap: 14px; }
  .tabs-shutter__tab { position: relative; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 50%; background: none; cursor: pointer; }
  .tabs-shutter__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .tabs-shutter__svg { display: block; overflow: visible; }
  .tabs-shutter__rim { fill: none; stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1.5; }
  .tabs-shutter__blades { fill: light-dark(#373a40, #f1f2f3); fill-rule: evenodd; }
  .tabs-shutter__seams { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 0.8; }
  .tabs-shutter__icon { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.2s; }
  .tabs-shutter__tab:hover .tabs-shutter__icon { stroke: light-dark(#373a40, #f1f2f3); }
  .tabs-shutter__tab--closed .tabs-shutter__icon, .tabs-shutter__tab--closed:hover .tabs-shutter__icon { stroke: light-dark(#fbfcfd, #121417); }
  .tabs-shutter__name { margin-top: 10px; text-align: center; font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: light-dark(#373a40, #f1f2f3); }
  .tabs-shutter__panel { padding: 6px 4px 0; min-height: calc(3.1em + 6px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
`;

export function ShutterTabs() {
  const id = useId().replace(/[^\w-]/g, '');
  const [sel, setSel] = useState(0);
  const [amt, setAmt] = useState<number[]>(() => TABS.map((_, i) => (i === sel ? 1 : 0)));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const live = useRef(amt);
  live.current = amt;

  // The new tab's blades close and the old tab's open, over the same short beat.
  useEffect(() => {
    const from = live.current;
    const to = TABS.map((_, i) => (i === sel ? 1 : 0));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setAmt(to);
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 420);
      setAmt(from.map((a, i) => a + (to[i] - a) * ease(t)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
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
      <div className="tabs-shutter">
        <div className="tabs-shutter__list" role="tablist" aria-label="Camera mode" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => {
            const a = amt[i];
            const blades = a > 0.001 ? iris(a) : null;
            return (
              <button
                key={t.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className={`tabs-shutter__tab${a > 0.6 ? ' tabs-shutter__tab--closed' : ''}`}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-label={t.label}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => setSel(i)}
              >
                <svg className="tabs-shutter__svg" width={44} height={44} aria-hidden="true">
                  <clipPath id={`${id}-lens-${i}`}>
                    <circle cx={C} cy={C} r={R} />
                  </clipPath>
                  <circle className="tabs-shutter__rim" cx={C} cy={C} r={R} />
                  {blades && (
                    <g clipPath={`url(#${id}-lens-${i})`}>
                      <path className="tabs-shutter__blades" d={blades.d} />
                      <path className="tabs-shutter__seams" d={blades.seams} style={{ opacity: Math.min(1, (1 - a) * 4) }} />
                    </g>
                  )}
                  <g className="tabs-shutter__icon" transform={`translate(${C - 12} ${C - 12})`}>
                    {t.icon}
                  </g>
                </svg>
              </button>
            );
          })}
        </div>
        <p className="tabs-shutter__name" aria-hidden="true">
          {TABS[sel].label}
        </p>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-shutter__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
