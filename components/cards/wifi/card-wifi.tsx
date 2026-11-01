"use client";

import { useEffect, useRef, useState } from 'react';

const NETS = [
  { name: 'Studio', bars: 3, lock: true },
  { name: 'Home 5G', bars: 3, lock: true },
  { name: 'Cafe Guest', bars: 2, lock: false },
  { name: 'Printer 4F', bars: 1, lock: true },
];
const ROW = 38;

const css = `
  .card-wifi { box-sizing: border-box; width: 240px; padding: 12px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-wifi__head { display: flex; align-items: center; justify-content: space-between; margin: 0 4px 8px; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-wifi__head span { font-size: 11px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); }
  .card-wifi__list { position: relative; height: ${NETS.length * ROW}px; margin: 0; padding: 0; list-style: none; }
  .card-wifi__item { position: absolute; left: 0; right: 0; top: 0; transition: transform 0.5s cubic-bezier(0.3, 1.25, 0.5, 1); }
  .card-wifi__row { display: flex; align-items: center; gap: 10px; box-sizing: border-box; width: 100%; height: ${ROW - 4}px; padding: 0 8px; border: 0; border-radius: 9px; background: none; color: light-dark(#42454c, #e5e6e9); font: inherit; font-size: 12px; text-align: left; cursor: pointer; transition: background-color 0.2s; }
  .card-wifi__row:hover { background: light-dark(#ebedf0, #232529); }
  .card-wifi__row:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -1px; }
  .card-wifi__item--on .card-wifi__row { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); font-weight: 600; cursor: default; }
  .card-wifi__signal { flex: none; width: 18px; height: 14px; }
  .card-wifi__arc { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 2; stroke-linecap: round; }
  .card-wifi__arc--lit { stroke: light-dark(#373a40, #f1f2f3); }
  .card-wifi__dot { fill: light-dark(#373a40, #f1f2f3); }
  /* While it connects the arcs light in a wave from the dot outwards. */
  .card-wifi__item--busy .card-wifi__arc { stroke: light-dark(#373a40, #f1f2f3); animation: card-wifi-wave 0.9s ease-in-out infinite; }
  .card-wifi__item--busy .card-wifi__arc:nth-of-type(2) { animation-delay: 0.15s; }
  .card-wifi__item--busy .card-wifi__arc:nth-of-type(3) { animation-delay: 0.3s; }
  @keyframes card-wifi-wave {
    0%, 100% { opacity: 0.2; }
    40% { opacity: 1; }
  }
  .card-wifi__status { margin-left: auto; font-size: 10.5px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); }
  .card-wifi__status svg { display: block; width: 14px; height: 14px; color: light-dark(#373a40, #f1f2f3); }
  .card-wifi__lock { width: 11px; height: 11px; color: light-dark(#6d7179, #7d8087); }
  .card-wifi__tick path { stroke-dasharray: 1; animation: card-wifi-tick 0.35s ease-out backwards; }
  @keyframes card-wifi-tick {
    from { stroke-dashoffset: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .card-wifi__item { transition: none; }
    .card-wifi__item--busy .card-wifi__arc, .card-wifi__tick path { animation: none; }
  }
`;

function Signal({ bars }: { bars: number }) {
  return (
    <svg className="card-wifi__signal" viewBox="0 0 18 14" aria-hidden="true">
      <circle className="card-wifi__dot" cx={9} cy={12} r={1.5} />
      {[4, 7.5, 11].map((r, i) => (
        <path key={r} className={`card-wifi__arc${i < bars ? ' card-wifi__arc--lit' : ''}`} d={`M ${9 - r * 0.72} ${12 - r * 0.7} A ${r} ${r} 0 0 1 ${9 + r * 0.72} ${12 - r * 0.7}`} />
      ))}
    </svg>
  );
}

export function WifiCard() {
  const [order, setOrder] = useState(NETS.map((n) => n.name));
  const [busy, setBusy] = useState<string | null>(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const live = order[0];

  // Joining a network: it pulses while it connects, then ticks and moves to the top as the rest shift down.
  const join = (name: string) => {
    if (name === live || busy) return;
    setBusy(name);
    timer.current = window.setTimeout(() => {
      setBusy(null);
      setOrder((o) => [name, ...o.filter((n) => n !== name)]);
    }, 1300);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-wifi">
        <p className="card-wifi__head">
          Wi-Fi<span>On</span>
        </p>
        <ul className="card-wifi__list">
          {NETS.map((n) => {
            const at = order.indexOf(n.name);
            const on = n.name === live && !busy;
            const state = n.name === busy ? 'Connecting…' : n.name === live ? 'Connected' : '';
            return (
              <li key={n.name} className={`card-wifi__item${n.name === live ? ' card-wifi__item--on' : ''}${n.name === busy ? ' card-wifi__item--busy' : ''}`} style={{ transform: `translateY(${at * ROW}px)` }}>
                <button type="button" className="card-wifi__row" onClick={() => join(n.name)} aria-label={`${n.name}${state ? `, ${state}` : ''}${n.lock ? ', secured' : ''}`}>
                  <Signal bars={n.bars} />
                  {n.name}
                  <span className="card-wifi__status" aria-hidden="true">
                    {n.name === busy ? (
                      'Connecting…'
                    ) : on ? (
                      <svg className="card-wifi__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
                      </svg>
                    ) : n.lock ? (
                      <svg className="card-wifi__lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x={5} y={11} width={14} height={10} rx={2} />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </article>
    </>
  );
}
