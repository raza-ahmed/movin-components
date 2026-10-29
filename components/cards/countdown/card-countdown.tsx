"use client";

import { useEffect, useState } from 'react';

const css = `
  .card-countdown {
    width: 246px;
    padding: 14px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-countdown__head { display: flex; justify-content: space-between; align-items: center; }
  .card-countdown__head b { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-countdown__head span { color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .card-countdown__ring { width: 22px; height: 22px; transform: rotate(-90deg); }
  .card-countdown__ring circle { fill: none; stroke-width: 3; }
  .card-countdown__ring circle:first-child { stroke: light-dark(#ebedf0, #232529); }
  .card-countdown__ring circle:last-child { stroke: light-dark(#373a40, #f1f2f3); stroke-linecap: round; stroke-dasharray: 1; transition: stroke-dashoffset 0.9s linear; }
  .card-countdown__units { display: flex; gap: 6px; margin-top: 14px; }
  .card-countdown__unit { flex: 1; display: grid; justify-items: center; gap: 4px; }
  .card-countdown__unit small { color: light-dark(#5f626a, #a7abb2); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; }
  .card-countdown__digits { display: flex; gap: 2px; }
  .card-countdown__reel {
    position: relative;
    width: 20px;
    height: 32px;
    overflow: hidden;
    border-radius: 6px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-countdown__strip { display: flex; flex-direction: column; transition: transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1); }
  .card-countdown__strip span { display: grid; place-items: center; height: 32px; color: light-dark(#373a40, #f1f2f3); font-size: 17px; font-weight: 600; font-variant-numeric: tabular-nums; }
  @media (prefers-reduced-motion: reduce) { .card-countdown__strip, .card-countdown__ring circle:last-child { transition: none; } }
`;

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const START = 3 * 86400 + 14 * 3600 + 7 * 60 + 52; // 3d 14h 07m 52s

function Reel({ d }: { d: number }) {
  return (
    <span className="card-countdown__reel">
      <span className="card-countdown__strip" style={{ transform: `translateY(${-d * 32}px)` }}>
        {DIGITS.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

export function CountdownCard() {
  const [left, setLeft] = useState(START);
  useEffect(() => {
    const id = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : START)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    ['Days', Math.floor(left / 86400)],
    ['Hrs', Math.floor(left / 3600) % 24],
    ['Min', Math.floor(left / 60) % 60],
    ['Sec', left % 60],
  ] as const;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-countdown" role="timer" aria-label={`Launch in ${units.map(([k, v]) => `${v} ${k}`).join(', ')}`}>
        <div className="card-countdown__head">
          <div>
            <b>Launch day</b>
            <br />
            <span>Fri 30 Oct · 09:00</span>
          </div>
          <svg className="card-countdown__ring" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx={11} cy={11} r={8} />
            <circle cx={11} cy={11} r={8} pathLength={1} style={{ strokeDashoffset: 1 - (left % 60) / 60 }} />
          </svg>
        </div>
        <div className="card-countdown__units" aria-hidden="true">
          {units.map(([k, v]) => (
            <div key={k} className="card-countdown__unit">
              <span className="card-countdown__digits">
                <Reel d={Math.floor(v / 10)} />
                <Reel d={v % 10} />
              </span>
              <small>{k}</small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
