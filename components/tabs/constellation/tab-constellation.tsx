"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const SKY = [
  {
    label: 'Orion',
    body: 'The hunter, with three stars in a row for his belt.',
    stars: [[62, 16], [152, 22], [96, 54], [110, 51], [124, 48], [158, 90]],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [4, 5], [2, 5]],
  },
  {
    label: 'Lyra',
    body: 'A small lyre hanging from Vega, one of the brightest stars.',
    stars: [[112, 12], [96, 42], [128, 38], [88, 82], [136, 78], [168, 26]],
    lines: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]],
  },
  {
    label: 'Cassiopeia',
    body: 'A queen on her throne, drawn as a crooked W.',
    stars: [[28, 34], [72, 66], [112, 36], [154, 70], [196, 30], [118, 92]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
];
const DUST = [[14, 80], [40, 12], [84, 30], [140, 8], [182, 58], [206, 94], [70, 98], [190, 14], [24, 58], [128, 70]];

const css = `
  @keyframes tabs-constellation-twinkle { 50% { opacity: 0.35; } }
  .tabs-constellation { width: 250px; }
  .tabs-constellation__list { display: flex; justify-content: center; gap: 4px; margin-bottom: 10px; }
  .tabs-constellation__tab { padding: 5px 10px; border: 0; border-radius: 999px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: color 0.2s, box-shadow 0.2s; }
  .tabs-constellation__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-constellation__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087); }
  .tabs-constellation__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-constellation__sky { position: relative; height: 104px; overflow: hidden; border-radius: 12px; background: radial-gradient(ellipse at 50% 120%, light-dark(#ebedf0, #232529), light-dark(#fbfcfd, #121417) 70%); }
  .tabs-constellation__sky svg { position: absolute; left: 15px; top: 0; width: 220px; height: 104px; overflow: visible; }
  .tabs-constellation__dust { fill: light-dark(#cbced3, #393c41); }
  .tabs-constellation__line { fill: none; stroke: color-mix(in oklab, light-dark(#42454c, #e5e6e9) 60%, transparent); stroke-width: 1; stroke-dasharray: 100; }
  .tabs-constellation[data-armed] .tabs-constellation__line { animation: tabs-constellation-draw 0.6s ease-out 0.55s backwards; }
  @keyframes tabs-constellation-draw { from { stroke-dashoffset: 100; } }
  .tabs-constellation__star { position: absolute; left: 15px; top: 0; width: 7px; height: 7px; margin: -3.5px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px light-dark(#42454c, #e5e6e9); transform: translate(var(--x), var(--y)); transition: transform 0.7s cubic-bezier(0.5, 0, 0.2, 1); animation: tabs-constellation-twinkle 2.4s ease-in-out infinite; }
  .tabs-constellation__panel { min-height: calc(3.1em + 10px); padding: 10px 4px 0; color: light-dark(#50535b, #c6c8cd); font-size: 12.5px; line-height: 1.55; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-constellation__star { transition: none; animation: none; }
    .tabs-constellation__line { animation: none !important; }
  }
`;

export function ConstellationTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setArmed(true);
    setSel(i);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = SKY.length;
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };
  const c = SKY[sel];
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-constellation" data-armed={armed ? '' : undefined}>
        <div className="tabs-constellation__list" role="tablist" aria-label="Constellations" onKeyDown={onKeyDown}>
          {SKY.map((s, i) => (
            <button
              key={s.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-constellation__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="tabs-constellation__sky" aria-hidden="true">
          <svg viewBox="0 0 220 104">
            {DUST.map(([x, y]) => (
              <circle key={`${x}-${y}`} className="tabs-constellation__dust" cx={x} cy={y} r="1" />
            ))}
            {/* Keyed by the constellation, so the lines remount and draw in fresh each time. */}
            <g key={sel}>
              {c.lines.map(([a, b]) => (
                <path key={`${a}-${b}`} className="tabs-constellation__line" pathLength={100} d={`M${c.stars[a][0]} ${c.stars[a][1]}L${c.stars[b][0]} ${c.stars[b][1]}`} />
              ))}
            </g>
          </svg>
          {c.stars.map(([x, y], k) => (
            <span key={k} className="tabs-constellation__star" style={{ '--x': `${x}px`, '--y': `${y}px`, animationDelay: `${k * -0.4}s` } as React.CSSProperties} />
          ))}
        </div>
        {SKY.map((s, i) => (
          <div key={s.label} className="tabs-constellation__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {s.body}
          </div>
        ))}
      </div>
    </>
  );
}
