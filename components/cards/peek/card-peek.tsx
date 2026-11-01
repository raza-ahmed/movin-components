"use client";

import { useEffect, useRef, useState } from 'react';

const FILES = [
  { name: 'Brief.pdf', kind: 'doc' },
  { name: 'Moodboard', kind: 'img' },
  { name: 'Notes.md', kind: 'doc' },
];
const HOLD = 450;

const css = `
  .card-peek { position: relative; box-sizing: border-box; width: 240px; height: 196px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-peek__body { transition: filter 0.25s, opacity 0.25s; }
  .card-peek--open .card-peek__body { filter: blur(3px); opacity: 0.5; }
  .card-peek__title { margin: 0; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-peek__hint { margin: 2px 0 14px; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-peek__grid { display: flex; gap: 10px; }
  .card-peek__tile { position: relative; display: grid; justify-items: center; gap: 8px; width: 64px; padding: 10px 0 8px; border: 0; border-radius: 10px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font: inherit; font-size: 10.5px; cursor: pointer; touch-action: none; user-select: none; -webkit-user-select: none; transition: transform 0.2s; -webkit-touch-callout: none; }
  .card-peek__tile:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-peek__tile--hold { transform: scale(0.94); }
  .card-peek__icon { width: 30px; height: 36px; border-radius: 4px; background: light-dark(#cbced3, #393c41); }
  .card-peek__icon--img { width: 36px; height: 30px; margin: 3px 0; background: light-dark(#6d7179, #7d8087); }
  /* While held, a ring fills round the tile; the peek opens when it closes. */
  .card-peek__ring { position: absolute; inset: -3px; width: calc(100% + 6px); height: calc(100% + 6px); overflow: visible; pointer-events: none; }
  .card-peek__ring rect { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-dasharray: 1; stroke-dashoffset: 1; }
  .card-peek__tile--hold .card-peek__ring rect { animation: card-peek-ring ${HOLD}ms linear forwards; }
  @keyframes card-peek-ring { to { stroke-dashoffset: 0; } }
  .card-peek__preview {
    position: absolute;
    left: 25px;
    top: 30px;
    z-index: 2;
    box-sizing: border-box;
    width: 190px;
    height: 136px;
    padding: 12px;
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: 0 18px 36px -12px var(--card-peek-shadow), inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    pointer-events: none;
    animation: card-peek-grow 0.35s cubic-bezier(0.3, 1.3, 0.5, 1);
  }
  .card-peek { --card-peek-shadow: light-dark(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.7)); }
  @keyframes card-peek-grow { from { transform: scale(0.3); opacity: 0; } }
  .card-peek__preview b { display: block; margin-bottom: 10px; font-size: 12px; color: light-dark(#373a40, #f1f2f3); }
  .card-peek__line { height: 6px; margin-bottom: 7px; border-radius: 3px; background: light-dark(#ebedf0, #232529); }
  .card-peek__pic { height: 84px; border-radius: 8px; background: linear-gradient(160deg, light-dark(#dbdde1, #2e3035), light-dark(#6d7179, #7d8087)); }
  @media (prefers-reduced-motion: reduce) {
    .card-peek__body { transition: none; }
    .card-peek__preview { animation: none; }
  }
`;

export function PeekCard() {
  const [peek, setPeek] = useState<number | null>(null);
  const [hold, setHold] = useState<number | null>(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const press = (i: number) => {
    setHold(i);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPeek(i), HOLD);
  };
  const release = () => {
    clearTimeout(timer.current);
    setHold(null);
    setPeek(null);
  };
  const f = peek === null ? null : FILES[peek];
  // The preview grows out of the tile it belongs to.
  const origin = peek === null ? '50% 50%' : `${14 + peek * 74 + 32 - 25}px ${72 + 36 - 30}px`;

  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-peek${f ? ' card-peek--open' : ''}`}>
        <div className="card-peek__body" aria-hidden={f !== null}>
          <p className="card-peek__title">Files</p>
          <p className="card-peek__hint">Press and hold to peek</p>
          <div className="card-peek__grid">
            {FILES.map((file, i) => (
              <button
                key={file.name}
                type="button"
                className={`card-peek__tile${hold === i ? ' card-peek__tile--hold' : ''}`}
                aria-label={`Peek at ${file.name}`}
                onPointerDown={() => press(i)}
                onPointerUp={release}
                onPointerLeave={release}
                onPointerCancel={release}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                    e.preventDefault();
                    setPeek(i);
                  }
                  if (e.key === 'Escape') release();
                }}
                onKeyUp={(e) => (e.key === ' ' || e.key === 'Enter') && release()}
              >
                <svg className="card-peek__ring" aria-hidden="true">
                  <rect x={1} y={1} width={68} height={72} rx={12} pathLength={1} />
                </svg>
                <span className={`card-peek__icon${file.kind === 'img' ? ' card-peek__icon--img' : ''}`} aria-hidden="true" />
                {file.name}
              </button>
            ))}
          </div>
        </div>
        {f && (
          <div className="card-peek__preview" style={{ transformOrigin: origin }} role="dialog" aria-label={`Preview of ${f.name}`}>
            <b>{f.name}</b>
            {f.kind === 'img' ? (
              <div className="card-peek__pic" />
            ) : (
              [92, 100, 78, 96, 64, 88].map((w, i) => <div key={i} className="card-peek__line" style={{ width: `${w}%` }} />)
            )}
          </div>
        )}
      </article>
    </>
  );
}
