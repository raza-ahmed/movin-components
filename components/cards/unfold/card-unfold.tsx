"use client";

import * as React from "react";
const css = `
  .card-unfold {
    position: relative;
    width: 252px;
    height: 150px;
    perspective: 900px;
    pointer-events: none;
  }
  .card-unfold:focus-visible { outline: none; }
  .card-unfold:focus-visible .card-unfold__mid { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 4px; }
  .card-unfold__mid, .card-unfold__flap { position: absolute; top: 0; width: 84px; height: 150px; pointer-events: auto; cursor: pointer; }
  .card-unfold__mid { left: 84px; z-index: 1; }
  .card-unfold__flap { z-index: 2; transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(0.6, 0, 0.2, 1); }
  /* Closed, both flaps lie folded over the middle panel; the right one on top carries the cover. */
  .card-unfold__flap--l { left: 0; transform-origin: 100% 50%; transform: rotateY(180deg); transition-delay: 0s; }
  .card-unfold__flap--r { left: 168px; z-index: 3; transform-origin: 0 50%; transform: rotateY(-180deg); transition-delay: 0.16s; }
  .card-unfold:hover .card-unfold__flap, .card-unfold:focus-visible .card-unfold__flap { transform: rotateY(0deg); }
  .card-unfold:hover .card-unfold__flap--r, .card-unfold:focus-visible .card-unfold__flap--r { transition-delay: 0s; }
  .card-unfold:hover .card-unfold__flap--l, .card-unfold:focus-visible .card-unfold__flap--l { transition-delay: 0.18s; }
  .card-unfold__face {
    position: absolute;
    inset: 0;
    padding: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    backface-visibility: hidden;
    overflow: hidden;
  }
  .card-unfold__face--out { transform: rotateY(180deg); background: light-dark(#ebedf0, #232529); }
  /* Paper shading: the inside is in shadow while folded and catches the light as it opens. */
  .card-unfold__face::after {
    content: '';
    position: absolute;
    inset: 0;
    background: light-dark(#fbfcfd, #121417);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.7s ease;
  }
  .card-unfold__flap .card-unfold__face:not(.card-unfold__face--out)::after { opacity: 0.7; }
  .card-unfold:hover .card-unfold__flap .card-unfold__face::after, .card-unfold:focus-visible .card-unfold__flap .card-unfold__face::after { opacity: 0; }
  .card-unfold__flap--l .card-unfold__face { border-radius: 12px 0 0 12px; box-shadow: inset -10px 0 12px -10px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent); }
  .card-unfold__flap--r .card-unfold__face { border-radius: 0 12px 12px 0; box-shadow: inset 10px 0 12px -10px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent); }
  .card-unfold__flap--l .card-unfold__face--out { border-radius: 0 12px 12px 0; }
  .card-unfold__flap--r .card-unfold__face--out { border-radius: 12px 0 0 12px; box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41); }
  .card-unfold__mid .card-unfold__face {
    padding: 0;
    background:
      linear-gradient(light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 100% 19px,
      linear-gradient(90deg, light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 21px 100%,
      light-dark(#f3f4f7, #1a1c1f);
  }
  .card-unfold__label { color: light-dark(#5f626a, #a7abb2); font-size: 9px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
  .card-unfold__stops { display: grid; gap: 9px; margin: 10px 0 0; padding: 0; list-style: none; }
  .card-unfold__stops li { display: flex; align-items: center; gap: 6px; color: light-dark(#42454c, #e5e6e9); font-size: 10px; line-height: 1.2; }
  .card-unfold__stops i { display: grid; place-items: center; flex: none; width: 15px; height: 15px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font-size: 8px; font-style: normal; font-weight: 600; }
  .card-unfold__route { position: absolute; inset: 0; width: 84px; height: 150px; }
  .card-unfold__route path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 0.3s ease, opacity 0s linear 0.3s; }
  .card-unfold__route circle { fill: light-dark(#373a40, #f1f2f3); stroke: light-dark(#f3f4f7, #1a1c1f); stroke-width: 2; transform-box: fill-box; transform-origin: center; transform: scale(0); transition: transform 0.2s ease; }
  .card-unfold:hover .card-unfold__route path, .card-unfold:focus-visible .card-unfold__route path { stroke-dashoffset: 0; opacity: 1; transition: stroke-dashoffset 1.1s cubic-bezier(0.45, 0, 0.3, 1) 0.75s, opacity 0s linear 0.75s; }
  .card-unfold:hover .card-unfold__route circle, .card-unfold:focus-visible .card-unfold__route circle { transform: scale(1); transition: transform 0.35s cubic-bezier(0.34, 1.8, 0.64, 1) var(--t); }
  .card-unfold__stat { margin-top: 8px; color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; }
  .card-unfold__stat small { display: block; margin-top: 3px; color: light-dark(#5f626a, #a7abb2); font-size: 9px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
  .card-unfold__elev { display: flex; align-items: end; gap: 2px; height: 22px; margin-top: 12px; }
  .card-unfold__elev span { flex: 1; border-radius: 1px; background: light-dark(#6d7179, #7d8087); }
  .card-unfold__cover { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
  .card-unfold__cover b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-weight: 600; line-height: 1.1; }
  .card-unfold__cover span { color: light-dark(#50535b, #c6c8cd); font-size: 10px; }
  .card-unfold__mark { width: 40px; height: 40px; color: light-dark(#50535b, #c6c8cd); }
  .card-unfold__crease { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 27px, color-mix(in oklab, light-dark(#fbfcfd, #121417) 30%, transparent) 27px 28px); }
  @media (prefers-reduced-motion: reduce) {
    .card-unfold__flap, .card-unfold__face::after, .card-unfold__route path, .card-unfold__route circle { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const STOPS = ['Ferry pier', 'Night market', 'Lighthouse'];
const ELEV = [3, 5, 4, 8, 12, 9, 14, 18, 13, 7, 5, 6];

export function UnfoldCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-unfold" tabIndex={0} role="group" aria-label="Night walk, harbour loop: 4.2 km, 68 minutes, 3 stops">
        <div className="card-unfold__mid" aria-hidden="true">
          <div className="card-unfold__face">
            <svg className="card-unfold__route" viewBox="0 0 84 150">
              <path d="M18 128 C 30 112, 14 96, 32 84 S 64 72, 52 52 S 58 26, 68 20" pathLength={1} />
              <circle cx="18" cy="128" r="4.5" style={{ '--t': '0.75s' } as React.CSSProperties} />
              <circle cx="40" cy="80" r="4.5" style={{ '--t': '1.2s' } as React.CSSProperties} />
              <circle cx="68" cy="20" r="4.5" style={{ '--t': '1.75s' } as React.CSSProperties} />
            </svg>
          </div>
        </div>
        <div className="card-unfold__flap card-unfold__flap--l" aria-hidden="true">
          <div className="card-unfold__face">
            <div className="card-unfold__label">Stops</div>
            <ol className="card-unfold__stops">
              {STOPS.map((s, i) => (
                <li key={s}>
                  <i>{i + 1}</i>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="card-unfold__face card-unfold__face--out">
            <span className="card-unfold__crease" />
          </div>
        </div>
        <div className="card-unfold__flap card-unfold__flap--r" aria-hidden="true">
          <div className="card-unfold__face">
            <div className="card-unfold__label">Route</div>
            <div className="card-unfold__stat">
              4.2 km<small>distance</small>
            </div>
            <div className="card-unfold__stat">
              68 min<small>on foot</small>
            </div>
            <div className="card-unfold__elev">
              {ELEV.map((h, i) => (
                <span key={i} style={{ height: `${(h / 18) * 100}%` }} />
              ))}
            </div>
          </div>
          <div className="card-unfold__face card-unfold__face--out">
            <div className="card-unfold__cover">
              <svg className="card-unfold__mark" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M4 9l10-4 12 4 10-4v26l-10 4-12-4-10 4z" />
                <path d="M14 5v26M26 9v26" />
              </svg>
              <div>
                <b>Night walk</b>
                <span>Harbour loop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
