"use client";

import { useState } from 'react';

const CATS = [
  { name: 'Photos', gb: 74 },
  { name: 'Apps', gb: 52 },
  { name: 'Documents', gb: 31 },
  { name: 'Other', gb: 25 },
];
const TOTAL = 256;
const USED = CATS.reduce((n, c) => n + c.gb, 0);

const css = `
  .card-storage { box-sizing: border-box; width: 240px; padding: 14px 14px 10px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-storage__head { display: flex; align-items: baseline; justify-content: space-between; margin: 0 0 10px; }
  .card-storage__head b { font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-storage__read { font-size: 11px; color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; animation: card-storage-in 0.25s ease-out; }
  @keyframes card-storage-in {
    from { opacity: 0; transform: translateY(3px); }
  }
  .card-storage__bar { display: flex; gap: 2px; height: 12px; margin-bottom: 10px; }
  .card-storage__seg {
    height: 100%;
    border-radius: 3px;
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1), opacity 0.25s;
    animation: card-storage-grow 0.6s cubic-bezier(0.3, 1.1, 0.5, 1) backwards;
  }
  @keyframes card-storage-grow {
    from { transform: scaleX(0); }
  }
  .card-storage__seg--0 { background: light-dark(#373a40, #f1f2f3); }
  .card-storage__seg--1 { background: light-dark(#50535b, #c6c8cd); }
  .card-storage__seg--2 { background: light-dark(#6d7179, #7d8087); }
  .card-storage__seg--3 { background: light-dark(#cbced3, #393c41); }
  .card-storage__seg--free { flex: 1; background: light-dark(#ebedf0, #232529); animation: none; }
  .card-storage__seg--on { transform: scaleY(1.7); }
  .card-storage__seg--dim { opacity: 0.3; }
  .card-storage__legend { display: grid; margin: 0; padding: 0; list-style: none; }
  .card-storage__row { display: flex; align-items: center; gap: 8px; width: 100%; height: 26px; padding: 0 6px; border: 0; border-radius: 7px; background: none; color: light-dark(#42454c, #e5e6e9); font: inherit; font-size: 11.5px; text-align: left; cursor: default; transition: background-color 0.2s; }
  .card-storage__row--on { background: light-dark(#ebedf0, #232529); }
  .card-storage__row:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -1px; }
  .card-storage__dot { width: 8px; height: 8px; border-radius: 2px; }
  .card-storage__row span:last-child { margin-left: auto; color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; }
  @media (prefers-reduced-motion: reduce) {
    .card-storage__seg { transition: opacity 0.25s; animation: none; }
    .card-storage__read { animation: none; }
  }
`;

export function StorageCard() {
  const [on, setOn] = useState<number | null>(null);
  const read = on === null ? `${USED} of ${TOTAL} GB used` : `${CATS[on].name} · ${CATS[on].gb} GB`;
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-storage" onPointerLeave={() => setOn(null)}>
        <p className="card-storage__head">
          <b>Storage</b>
          <span key={read} className="card-storage__read">
            {read}
          </span>
        </p>
        {/* Each category's segment is its share of the disk; the one you point at swells and the rest dim. */}
        <div className="card-storage__bar" aria-hidden="true">
          {CATS.map((c, i) => (
            <span
              key={c.name}
              className={`card-storage__seg card-storage__seg--${i}${on === i ? ' card-storage__seg--on' : on !== null ? ' card-storage__seg--dim' : ''}`}
              style={{ width: `${(c.gb / TOTAL) * 100}%`, animationDelay: `${i * 110}ms` }}
              onPointerEnter={() => setOn(i)}
            />
          ))}
          <span className={`card-storage__seg card-storage__seg--free${on !== null ? ' card-storage__seg--dim' : ''}`} />
        </div>
        <ul className="card-storage__legend">
          {CATS.map((c, i) => (
            <li key={c.name}>
              <button type="button" className={`card-storage__row${on === i ? ' card-storage__row--on' : ''}`} onPointerEnter={() => setOn(i)} onFocus={() => setOn(i)} onBlur={() => setOn(null)}>
                <span className={`card-storage__dot card-storage__seg--${i}`} aria-hidden="true" />
                {c.name}
                <span>{c.gb} GB</span>
              </button>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
