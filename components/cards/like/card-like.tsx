"use client";

import * as React from "react";
import { useState } from 'react';

const BASE = 1204;
const HEART = 'M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.6 0 5.7 3.5 4.5 6.8-1.8 4.6-9.3 9.2-9.3 9.2z';

const css = `
  .card-like { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-like__photo { position: relative; width: 212px; height: 112px; border-radius: 10px; overflow: hidden; cursor: pointer; user-select: none; -webkit-user-select: none; }
  .card-like__photo svg.card-like__scene { display: block; width: 100%; height: 100%; }
  .card-like__sky { fill: light-dark(#ebedf0, #232529); }
  .card-like__far { fill: light-dark(#cbced3, #393c41); }
  .card-like__near { fill: light-dark(#6d7179, #7d8087); }
  .card-like__sun { fill: light-dark(#50535b, #c6c8cd); }
  .card-like__big { position: absolute; left: 50%; top: 50%; width: 54px; height: 54px; margin: -27px 0 0 -27px; color: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 4px 10px light-dark(rgba(0, 0, 0, 0.11), rgba(0, 0, 0, 0.35))); animation: card-like-pop 0.9s cubic-bezier(0.3, 1.5, 0.5, 1) forwards; }
  @keyframes card-like-pop {
    0% { transform: scale(0); opacity: 0; }
    25% { transform: scale(1.2); opacity: 1; }
    40% { transform: scale(0.95); }
    70% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.1) translateY(-12px); opacity: 0; }
  }
  .card-like__bar { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
  .card-like__btn { position: relative; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#42454c, #e5e6e9); cursor: pointer; }
  .card-like__btn:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 1px; }
  .card-like__btn svg { width: 20px; height: 20px; }
  .card-like__btn path { fill: transparent; stroke: currentColor; stroke-width: 1.8; transition: fill 0.2s; }
  .card-like__btn[aria-pressed='true'] { color: light-dark(#373a40, #f1f2f3); }
  .card-like__btn[aria-pressed='true'] path { fill: currentColor; }
  .card-like__btn[aria-pressed='true'] svg { animation: card-like-beat 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); }
  @keyframes card-like-beat {
    from { transform: scale(0.4); }
  }
  /* Six dots fly out from the heart when it fills. */
  .card-like__spark { position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); opacity: 0; }
  .card-like__btn[aria-pressed='true'] .card-like__spark { animation: card-like-spark 0.5s ease-out; }
  @keyframes card-like-spark {
    0% { opacity: 1; transform: rotate(var(--a)) translateY(-6px) scale(1); }
    100% { opacity: 0; transform: rotate(var(--a)) translateY(-18px) scale(0.4); }
  }
  .card-like__count { position: relative; display: inline-grid; overflow: hidden; height: 16px; font-size: 12px; font-weight: 600; line-height: 16px; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; }
  .card-like__num { animation: card-like-roll 0.35s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .card-like__num--down { animation-name: card-like-roll-down; }
  @keyframes card-like-roll { from { transform: translateY(100%); } }
  @keyframes card-like-roll-down { from { transform: translateY(-100%); } }
  .card-like__cap { margin: 2px 0 0; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .card-like__big { animation: card-like-fade 0.9s forwards; }
    @keyframes card-like-fade { 70% { opacity: 1; } 100% { opacity: 0; } }
    .card-like__btn[aria-pressed='true'] svg, .card-like__btn[aria-pressed='true'] .card-like__spark, .card-like__num { animation: none; }
  }
`;

export function LikeCard() {
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(0);
  const n = BASE + (liked ? 1 : 0);
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-like">
        {/* Double-click likes (never unlikes) and pops the big heart every time. */}
        <div
          className="card-like__photo"
          onDoubleClick={() => {
            setLiked(true);
            setPop((p) => p + 1);
          }}
          aria-hidden="true"
        >
          <svg className="card-like__scene" viewBox="0 0 212 112">
            <rect className="card-like__sky" width={212} height={112} />
            <circle className="card-like__sun" cx={150} cy={44} r={13} />
            <path className="card-like__far" d="M0 82 L36 58 L70 72 L112 46 L150 70 L186 54 L212 64 V112 H0 Z" />
            <path className="card-like__near" d="M0 96 Q56 76 108 92 T212 86 V112 H0 Z" />
          </svg>
          {pop > 0 && (
            <svg key={pop} className="card-like__big" viewBox="0 0 24 24">
              <path d={HEART} fill="currentColor" />
            </svg>
          )}
        </div>
        <div className="card-like__bar">
          <button type="button" className="card-like__btn" aria-pressed={liked} aria-label="Like" onClick={() => setLiked((l) => !l)}>
            <svg key={String(liked)} viewBox="0 0 24 24" aria-hidden="true">
              <path d={HEART} />
            </svg>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <span key={a} className="card-like__spark" style={{ '--a': `${a}deg` } as React.CSSProperties} aria-hidden="true" />
            ))}
          </button>
          <span className="card-like__count">
            <span key={n} className={`card-like__num${liked ? '' : ' card-like__num--down'}`}>
              {n.toLocaleString('en-US')} likes
            </span>
          </span>
        </div>
        <p className="card-like__cap">Ridge walk, 6am. Double-click the photo.</p>
      </article>
    </>
  );
}
