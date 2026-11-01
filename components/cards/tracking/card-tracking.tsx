"use client";

import * as React from "react";
import { useState } from 'react';

const STEPS = [
  { t: 'Ordered', when: 'Mon 9:14' },
  { t: 'Packed', when: 'Mon 16:02' },
  { t: 'Shipped', when: 'Tue 8:30' },
  { t: 'Delivered', when: 'Expected Thu' },
];

const css = `
  .card-tracking { box-sizing: border-box; width: 240px; padding: 14px 16px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-tracking__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
  .card-tracking__head b { font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-tracking__next { height: 22px; padding: 0 8px; border: 0; border-radius: 999px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font: inherit; font-size: 10.5px; font-weight: 600; cursor: pointer; }
  .card-tracking__next:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-tracking__list { margin: 0; padding: 0; list-style: none; }
  .card-tracking__step { position: relative; display: flex; gap: 12px; height: 34px; }
  .card-tracking__rail { position: relative; flex: none; width: 12px; }
  .card-tracking__dot { position: absolute; left: 0; top: 2px; box-sizing: border-box; width: 12px; height: 12px; border: 2px solid light-dark(#cbced3, #393c41); border-radius: 50%; background: light-dark(#f3f4f7, #1a1c1f); transition: background-color 0.3s 0.3s, border-color 0.3s 0.3s; }
  .card-tracking__step--done .card-tracking__dot { border-color: light-dark(#373a40, #f1f2f3); background: light-dark(#373a40, #f1f2f3); }
  /* The latest step pulses a ring outward. */
  .card-tracking__step--now .card-tracking__dot::after { content: ''; position: absolute; inset: -5px; border: 1.5px solid light-dark(#50535b, #c6c8cd); border-radius: 50%; animation: card-tracking-pulse 1.6s ease-out infinite; }
  @keyframes card-tracking-pulse {
    from { opacity: 0.9; transform: scale(0.6); }
    to { opacity: 0; transform: scale(1.4); }
  }
  .card-tracking__seg { position: absolute; left: 5px; top: 16px; width: 2px; height: 20px; background: light-dark(#dbdde1, #2e3035); }
  .card-tracking__seg span { display: block; height: 100%; background: light-dark(#373a40, #f1f2f3); transform: scaleY(0); transform-origin: top; transition: transform 0.35s ease-in-out; }
  .card-tracking__step--filled .card-tracking__seg span { transform: none; animation: card-tracking-fill 0.35s ease-in-out backwards; animation-delay: calc(var(--i) * 0.35s); }
  @keyframes card-tracking-fill { from { transform: scaleY(0); } }
  .card-tracking__t { display: block; font-size: 12px; font-weight: 600; color: light-dark(#5f626a, #a7abb2); transition: color 0.3s 0.3s; }
  .card-tracking__step--done .card-tracking__t { color: light-dark(#373a40, #f1f2f3); }
  .card-tracking__when { display: block; font-size: 10.5px; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .card-tracking__seg span, .card-tracking__dot, .card-tracking__t { transition: none; animation: none !important; }
    .card-tracking__step--now .card-tracking__dot::after { animation: none; opacity: 0.6; }
  }
`;

export function TrackingCard() {
  const [now, setNow] = useState(2);
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-tracking">
        <div className="card-tracking__head">
          <b>Order #4821</b>
          <button type="button" className="card-tracking__next" onClick={() => setNow((n) => (n + 1) % STEPS.length)}>
            {now === STEPS.length - 1 ? 'Start over' : 'Next update'}
          </button>
        </div>
        {/* On load the line fills down to the latest step one segment at a time; later updates fill the next one. */}
        <ol className="card-tracking__list" aria-live="polite">
          {STEPS.map((s, i) => (
            <li
              key={s.t}
              className={`card-tracking__step${i <= now ? ' card-tracking__step--done' : ''}${i === now ? ' card-tracking__step--now' : ''}${i < now ? ' card-tracking__step--filled' : ''}`}
              style={{ '--i': i } as React.CSSProperties}
              aria-current={i === now ? 'step' : undefined}
            >
              <span className="card-tracking__rail" aria-hidden="true">
                <span className="card-tracking__dot" />
                {i < STEPS.length - 1 && (
                  <span className="card-tracking__seg">
                    <span />
                  </span>
                )}
              </span>
              <span>
                <span className="card-tracking__t">{s.t}</span>
                <span className="card-tracking__when">{i <= now || i === STEPS.length - 1 ? s.when : 'Pending'}</span>
              </span>
            </li>
          ))}
        </ol>
      </article>
    </>
  );
}
