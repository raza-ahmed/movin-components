"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const PLACES = [
  { label: 'Coast', body: 'Low cliffs and long beaches. Best walked at low tide, north to south.' },
  { label: 'Valley', body: 'Orchards and old mills along the river, with a pub at every bridge.' },
  { label: 'Peaks', body: 'A two-day ridge walk with a hut halfway and snow until June.' },
];
const W = 240;
const H = 120;
// How far each layer travels per place, as a share of the view's width: the far hills barely
// move, the near ground rushes past and the words lead.
const LAYERS = [
  { name: 'far', f: 0.35, base: [84, 74, 60], amp: [4, 10, 30], freq: 0.05 },
  { name: 'mid', f: 0.7, base: [96, 92, 86], amp: [5, 12, 18], freq: 0.09 },
  { name: 'near', f: 1.3, base: [110, 108, 106], amp: [4, 8, 6], freq: 0.21 },
];

// A ridge line whose height and roughness change from one place to the next along the layer.
function ridge(f: number, base: number[], amp: number[], freq: number) {
  const width = W + (PLACES.length - 1) * W * f;
  let d = `M0 ${H}`;
  for (let x = 0; x <= width; x += 6) {
    const r = Math.min(PLACES.length - 1, Math.max(0, (x - W / 2) / (W * f)));
    const i = Math.floor(r);
    const t = r - i;
    const j = Math.min(PLACES.length - 1, i + 1);
    const b = base[i] + (base[j] - base[i]) * t;
    const a = amp[i] + (amp[j] - amp[i]) * t;
    const y = b - a * Math.abs(Math.sin(x * freq)) - a * 0.4 * Math.sin(x * freq * 2.3);
    d += `L${x} ${y.toFixed(1)}`;
  }
  return { d: `${d}L${width} ${H}Z`, width };
}
const SHAPES = LAYERS.map((l) => ({ ...l, ...ridge(l.f, l.base, l.amp, l.freq) }));
const EASE = '0.9s cubic-bezier(0.65, 0, 0.35, 1)';
// The sun drifts a little against the land and climbs as the walk gets higher.
const SUN = ['translate(182px, 74px) scale(1.15)', 'translate(160px, 44px)', 'translate(140px, 26px) scale(0.65)'];

const css = `
  .tabs-parallax { width: ${W}px; }
  .tabs-parallax__view { position: relative; height: ${H}px; border-radius: 14px; overflow: hidden; background: light-dark(#dbdde1, #2e3035); }
  .tabs-parallax__layer { position: absolute; left: 0; top: 0; height: ${H}px; transition: transform ${EASE}; }
  .tabs-parallax__sky { position: absolute; left: 0; top: 0; }
  .tabs-parallax__sun { fill: light-dark(#50535b, #c6c8cd); transition: transform ${EASE}; }
  .tabs-parallax__far { fill: light-dark(#cbced3, #393c41); }
  .tabs-parallax__mid { fill: light-dark(#ebedf0, #232529); }
  .tabs-parallax__near { fill: light-dark(#fbfcfd, #121417); }
  .tabs-parallax__name { position: absolute; top: 14px; margin: 0; font-size: 20px; font-weight: 700; color: light-dark(#373a40, #f1f2f3); }
  .tabs-parallax__list { display: grid; grid-template-columns: repeat(${PLACES.length}, 1fr); margin-top: 6px; }
  .tabs-parallax__tab { border: 0; padding: 6px 0 8px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-parallax__tab:hover, .tabs-parallax__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-parallax__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-parallax__panel { padding: 4px 0 0; min-height: calc(3.1em + 4px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-parallax__layer, .tabs-parallax__sun { transition: none; }
  }
`;

export function ParallaxTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shift = (f: number) => ({ transform: `translateX(${-sel * W * f}px)` });
  const n = PLACES.length;
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
      <div className="tabs-parallax">
        <div className="tabs-parallax__view" aria-hidden="true">
          <svg className="tabs-parallax__sky" width={W} height={H}>
            <circle className="tabs-parallax__sun" cx={0} cy={0} r={14} style={{ transform: SUN[sel] }} />
          </svg>
          {SHAPES.map((s) => (
            <svg key={s.name} className="tabs-parallax__layer" style={shift(s.f)} width={s.width} height={H}>
              <path className={`tabs-parallax__${s.name}`} d={s.d} />
            </svg>
          ))}
          <div className="tabs-parallax__layer" style={shift(1)}>
            {PLACES.map((p, i) => (
              <p key={p.label} className="tabs-parallax__name" style={{ left: i * W + 16 }}>
                {p.label}
              </p>
            ))}
          </div>
        </div>
        <div className="tabs-parallax__list" role="tablist" aria-label="Walks" onKeyDown={onKeyDown}>
          {PLACES.map((p, i) => (
            <button
              key={p.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-parallax__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {PLACES.map((p, i) => (
          <div key={p.label} className="tabs-parallax__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {p.body}
          </div>
        ))}
      </div>
    </>
  );
}
