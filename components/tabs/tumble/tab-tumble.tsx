"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Hourly', body: 'Clear until four, then cloud building from the west.' },
  { label: 'Daily', body: 'Dry all week, with a chance of rain on Saturday.' },
  { label: 'Radar', body: 'A band of showers 80 km out, moving east.' },
];

const PAD = 4;
const GAP = 2;

const css = `
  .tabs-tumble { width: 260px; }
  .tabs-tumble__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); height: 42px; padding: ${PAD}px; border-radius: 13px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .tabs-tumble__pill {
    position: absolute;
    top: ${PAD}px;
    bottom: ${PAD}px;
    left: calc(${PAD}px + var(--tabs-tumble-at) * (100% - ${PAD * 2}px) / 3 + ${GAP}px);
    width: calc((100% - ${PAD * 2}px) / 3 - ${GAP * 2}px);
    border-radius: 9px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 2px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.45)), 0 4px 10px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.3));
  }
  .tabs-tumble__tab { position: relative; border: 0; border-radius: 9px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.2s; }
  .tabs-tumble__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-tumble__tab--under { color: light-dark(#fbfcfd, #121417); }
  .tabs-tumble__tab:focus-visible { outline: none; }
  .tabs-tumble__list:has(:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-tumble__panel { padding: 14px 6px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function TumbleTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  // Where the pill lies right now; it reaches sel one flip at a time.
  const [at, setAt] = useState(0);
  // The label the pill is resting under, if any: none while it is turning over.
  const [under, setUnder] = useState<number | null>(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pill = useRef<HTMLSpanElement>(null);
  const run = useRef({ target: 0, at: 0, busy: false, alive: true });

  useEffect(() => {
    const r = run.current;
    r.alive = true;
    return () => {
      r.alive = false;
    };
  }, []);

  const tumble = async () => {
    const r = run.current;
    if (r.busy) return;
    r.busy = true;
    const el = pill.current!;
    setUnder(null);
    while (r.alive && r.at !== r.target) {
      const dir = Math.sign(r.target - r.at);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        r.at = r.target;
        setAt(r.at);
        break;
      }
      // Hinged on the edge it is heading for, it turns over onto the next slot like a domino.
      el.style.transformOrigin = dir > 0 ? `calc(100% + ${GAP}px) 50%` : `-${GAP}px 50%`;
      const steps = Math.abs(r.target - r.at);
      const flip = el.animate(
        [
          { transform: 'perspective(260px) rotateY(0deg)', filter: 'brightness(1)' },
          { transform: `perspective(260px) rotateY(${dir * -90}deg)`, filter: 'brightness(0.62)', offset: 0.5 },
          { transform: `perspective(260px) rotateY(${dir * -180}deg)`, filter: 'brightness(1)' },
        ],
        { duration: steps > 1 ? 230 : 320, easing: steps > 1 ? 'cubic-bezier(0.5, 0, 0.6, 1)' : 'cubic-bezier(0.45, 0, 0.3, 1)', fill: 'forwards' },
      );
      await flip.finished;
      // Landed: move the pill onto the neighbouring slot, the right way round, in the same frame the flip lets go.
      r.at += dir;
      el.style.setProperty('--tabs-tumble-at', String(r.at));
      flip.cancel();
      setAt(r.at);
    }
    r.busy = false;
    setUnder(r.at);
  };

  const select = (i: number) => {
    setSel(i);
    run.current.target = i;
    tumble();
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
      <div className="tabs-tumble">
        <div className="tabs-tumble__list" role="tablist" aria-label="Forecast" onKeyDown={onKeyDown}>
          <span ref={pill} className="tabs-tumble__pill" style={{ '--tabs-tumble-at': at } as React.CSSProperties} aria-hidden="true" />
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className={`tabs-tumble__tab${under === i ? ' tabs-tumble__tab--under' : ''}`}
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
          <div key={t.label} className="tabs-tumble__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
