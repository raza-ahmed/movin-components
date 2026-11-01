"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Jazz', mhz: 89.1, now: 'Alice Coltrane, Journey in Satchidananda' },
  { label: 'News', mhz: 94.7, now: 'The evening bulletin, live from the newsroom' },
  { label: 'Lo-fi', mhz: 100.3, now: 'Tape hiss and rain: beats to read to' },
  { label: 'Talk', mhz: 105.9, now: 'Late call-in: what are you building this week?' },
];
const W = 272;
const PAD = 14;
const LO = 87.5;
const HI = 108;
const x = (mhz: number) => PAD + ((mhz - LO) / (HI - LO)) * (W - 2 * PAD);
const SWEEP = '0.95s cubic-bezier(0.5, 0, 0.15, 1.08)';

const css = `
  .tabs-tuner { width: ${W}px; }
  .tabs-tuner__dial {
    position: relative;
    height: 62px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 1px 3px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45)), inset 0 0 0 1px light-dark(#ebedf0, #232529);
  }
  .tabs-tuner__scale { position: absolute; left: 0; top: 0; width: ${W}px; height: 34px; }
  .tabs-tuner__tick { stroke: light-dark(#cbced3, #393c41); stroke-width: 1; }
  .tabs-tuner__tick--major { stroke: light-dark(#6d7179, #7d8087); }
  .tabs-tuner__mhz { fill: light-dark(#6d7179, #7d8087); font-size: 8px; font-variant-numeric: tabular-nums; text-anchor: middle; }
  .tabs-tuner__tab { position: absolute; top: 36px; translate: -50% 0; border: 0; padding: 3px 4px; background: none; font: inherit; font-size: 12px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-tuner__tab:hover, .tabs-tuner__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-tuner__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 0; border-radius: 4px; }
  .tabs-tuner__needle {
    position: absolute;
    top: 6px;
    height: 30px;
    width: 2px;
    margin-left: -1px;
    border-radius: 1px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent);
    transition: left ${SWEEP};
    pointer-events: none;
  }
  .tabs-tuner__panel { position: relative; padding: 14px 2px 0; min-height: calc(3.1em + 14px); overflow: hidden; }
  .tabs-tuner__on { font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .tabs-tuner__song { margin-top: 2px; color: light-dark(#42454c, #e5e6e9); font-size: 13px; line-height: 1.5; }
  /* Off station the words are smeared and jumpy; they lock in as the needle arrives. */
  .tabs-tuner__tuned { animation: tabs-tuner-in 1s both; }
  @keyframes tabs-tuner-in {
    0% { filter: blur(4px); opacity: 0.35; transform: translateX(-2px); }
    20% { filter: blur(3px); opacity: 0.5; transform: translateX(2px); }
    40% { filter: blur(3px); opacity: 0.45; transform: translateX(-1px); }
    60% { filter: blur(2px); opacity: 0.6; transform: translateX(1px); }
    80% { filter: blur(0.5px); opacity: 0.9; transform: none; }
    100% { filter: none; opacity: 1; transform: none; }
  }
  .tabs-tuner__static {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
    mask-image: radial-gradient(closest-side, #000 55%, transparent);
    animation: tabs-tuner-static 1s both;
  }
  @keyframes tabs-tuner-static {
    0%, 50% { opacity: 0.2; }
    100% { opacity: 0; }
  }
  .tabs-tuner__noise { animation: tabs-tuner-hiss 0.24s steps(4) infinite; }
  @keyframes tabs-tuner-hiss {
    to { transform: translate(-40px, 12px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-tuner__needle { transition: none; }
    .tabs-tuner__tuned, .tabs-tuner__static, .tabs-tuner__noise { animation: none; }
  }
`;

const TICKS = Array.from({ length: Math.round(HI - LO) * 2 + 1 }, (_, i) => LO + i / 2);

export function TunerTabs() {
  const id = useId();
  const noise = `${id.replace(/[^\w-]/g, '')}-noise`;
  const [sel, setSel] = useState(1);
  const [tuned, setTuned] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pick = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setTuned(true);
  };
  const n = TABS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    pick(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-tuner">
        <div className="tabs-tuner__dial" role="tablist" aria-label="Stations" onKeyDown={onKeyDown}>
          <svg className="tabs-tuner__scale" aria-hidden="true">
            {TICKS.map((f) => {
              const major = f % 4 === 0;
              return <line key={f} className={`tabs-tuner__tick${major ? ' tabs-tuner__tick--major' : ''}`} x1={x(f)} x2={x(f)} y1={major ? 16 : f % 1 ? 25 : 21} y2={30} />;
            })}
            {[88, 92, 96, 100, 104, 108].map((f) => (
              <text key={f} className="tabs-tuner__mhz" x={x(f)} y={11}>
                {f}
              </text>
            ))}
          </svg>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-tuner__tab"
              style={{ left: x(t.mhz) }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => pick(i)}
            >
              {t.label}
            </button>
          ))}
          <span className="tabs-tuner__needle" style={{ left: x(TABS[sel].mhz) }} aria-hidden="true" />
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-tuner__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {/* Remounted on every switch, so the tuning-in plays again. */}
            <div key={sel} className={tuned ? 'tabs-tuner__tuned' : undefined}>
              <div className="tabs-tuner__on">Now playing on {t.mhz.toFixed(1)}</div>
              <div className="tabs-tuner__song">{t.now}</div>
            </div>
            {tuned && sel === i && (
              <svg key={`s${sel}`} className="tabs-tuner__static" aria-hidden="true">
                <filter id={noise}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="4" />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect className="tabs-tuner__noise" x="-40" y="-20" width="400" height="120" filter={`url(#${noise})`} />
              </svg>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
