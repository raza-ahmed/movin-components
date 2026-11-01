"use client";

import { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = 4;
const BEFORE = 4;
const TICK = 'M5 12.5l4.5 4.5L19 7.5';

const css = `
  .card-streak { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-streak__head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
  .card-streak__flame { width: 26px; height: 26px; color: light-dark(#50535b, #c6c8cd); transform-origin: 50% 90%; transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1), color 0.3s; }
  .card-streak--done .card-streak__flame { color: light-dark(#373a40, #f1f2f3); transform: scale(1.18); animation: card-streak-flare 0.6s ease-out; }
  @keyframes card-streak-flare {
    30% { transform: scale(1.35) rotate(-6deg); }
    60% { transform: scale(1.1) rotate(4deg); }
  }
  .card-streak__count { display: inline-grid; overflow: hidden; height: 20px; font-size: 15px; font-weight: 700; line-height: 20px; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; }
  .card-streak__num { animation: card-streak-roll 0.45s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .card-streak__num--down { animation-name: card-streak-roll-down; }
  @keyframes card-streak-roll { from { transform: translateY(100%); } }
  @keyframes card-streak-roll-down { from { transform: translateY(-100%); } }
  .card-streak__label { font-size: 12px; color: light-dark(#50535b, #c6c8cd); }
  .card-streak__best { margin-left: auto; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-streak__week { display: flex; justify-content: space-between; margin: 0; padding: 0; list-style: none; }
  .card-streak__day { display: grid; justify-items: center; gap: 5px; font-size: 10px; color: light-dark(#5f626a, #a7abb2); }
  .card-streak__dot { position: relative; display: grid; place-items: center; box-sizing: border-box; width: 26px; height: 26px; padding: 0; border: 0; border-radius: 50%; background: light-dark(#ebedf0, #232529); color: light-dark(#fbfcfd, #121417); }
  .card-streak__dot svg { position: relative; width: 13px; height: 13px; }
  .card-streak__dot--done { background: light-dark(#373a40, #f1f2f3); }
  .card-streak__dot--today { border: 2px solid light-dark(#50535b, #c6c8cd); background: none; cursor: pointer; }
  .card-streak__dot--today:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-streak__dot--today::before { content: ''; position: absolute; inset: -6px; border: 1.5px solid light-dark(#5f626a, #a7abb2); border-radius: 50%; animation: card-streak-pulse 1.8s ease-out infinite; }
  @keyframes card-streak-pulse {
    from { opacity: 0.8; transform: scale(0.75); }
    to { opacity: 0; transform: scale(1.15); }
  }
  /* Checking in fills today from the centre with a little overshoot, then draws the tick. */
  .card-streak__fill { position: absolute; inset: -2px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); transform: scale(0); transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .card-streak--done .card-streak__fill { transform: scale(1); }
  .card-streak--done .card-streak__dot--today::before { animation: none; opacity: 0; }
  .card-streak__dot--today svg path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.25s ease-out; }
  .card-streak--done .card-streak__dot--today svg path { stroke-dashoffset: 0; transition-delay: 0.2s; }
  .card-streak__day--today { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  @media (prefers-reduced-motion: reduce) {
    .card-streak__flame, .card-streak__fill, .card-streak__dot--today svg path { transition: none; }
    .card-streak--done .card-streak__flame, .card-streak__num, .card-streak__dot--today::before { animation: none; }
  }
`;

export function StreakCard() {
  const [done, setDone] = useState(false);
  const n = BEFORE + (done ? 1 : 0);
  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-streak${done ? ' card-streak--done' : ''}`}>
        <div className="card-streak__head">
          <svg className="card-streak__flame" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2c1 3.5 5 5.5 5 11a5 5 0 0 1-10 0c0-2.4 1.2-4 2.5-5.2.2 1.8 1 3 2.3 3.4C11 9 11 5.5 12 2z" />
          </svg>
          <span className="card-streak__count">
            <span key={n} className={`card-streak__num${done ? '' : ' card-streak__num--down'}`}>
              {n}
            </span>
          </span>
          <span className="card-streak__label">day streak</span>
          <span className="card-streak__best">Best 12</span>
        </div>
        <ol className="card-streak__week">
          {DAYS.map((d, i) => (
            <li key={d} className={`card-streak__day${i === TODAY ? ' card-streak__day--today' : ''}`}>
              {i === TODAY ? (
                <button type="button" className="card-streak__dot card-streak__dot--today" aria-pressed={done} aria-label={`Check in for ${d}`} onClick={() => setDone((x) => !x)}>
                  <span className="card-streak__fill" aria-hidden="true" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={TICK} pathLength={1} />
                  </svg>
                </button>
              ) : (
                <span className={`card-streak__dot${i < TODAY ? ' card-streak__dot--done' : ''}`} role="img" aria-label={`${d}: ${i < TODAY ? 'done' : 'not yet'}`}>
                  {i < TODAY && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={TICK} />
                    </svg>
                  )}
                </span>
              )}
              {d[0]}
            </li>
          ))}
        </ol>
      </article>
    </>
  );
}
