"use client";

import { useEffect, useId, useRef, useState } from 'react';

type Row = { id: number; name: string; size: string; pct: number };

const css = `
  .card-upload { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-upload__zone { position: relative; display: grid; place-items: center; height: 74px; border-radius: 12px; color: light-dark(#50535b, #c6c8cd); font-size: 11.5px; text-align: center; cursor: pointer; transition: background-color 0.2s; }
  .card-upload__zone:hover, .card-upload__zone--over { background: light-dark(#ebedf0, #232529); }
  .card-upload__zone:has(:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-upload__edge { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .card-upload__edge rect { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.5; stroke-dasharray: 6 4; }
  /* Marching ants while hovered or while a file is dragged over. */
  .card-upload__zone:hover .card-upload__edge rect, .card-upload__zone--over .card-upload__edge rect { stroke: light-dark(#42454c, #e5e6e9); animation: card-upload-march 0.6s linear infinite; }
  @keyframes card-upload-march {
    to { stroke-dashoffset: -10; }
  }
  .card-upload__zone svg.card-upload__icon { display: block; width: 20px; height: 20px; margin: 0 auto 4px; color: light-dark(#42454c, #e5e6e9); transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .card-upload__zone--over svg.card-upload__icon { transform: translateY(-3px) scale(1.15); }
  .card-upload__zone u { color: light-dark(#373a40, #f1f2f3); text-underline-offset: 2px; }
  .card-upload__input { position: absolute; width: 1px; height: 1px; opacity: 0; }
  .card-upload__rows { display: grid; gap: 8px; margin: 12px 0 0; padding: 0; list-style: none; }
  .card-upload__row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; column-gap: 8px; row-gap: 5px; font-size: 11px; animation: card-upload-in 0.35s cubic-bezier(0.3, 1.3, 0.5, 1); }
  @keyframes card-upload-in {
    from { opacity: 0; transform: translateY(-6px); }
  }
  .card-upload__doc { grid-row: span 2; width: 22px; height: 26px; border-radius: 4px; background: light-dark(#dbdde1, #2e3035); }
  .card-upload__name { overflow: hidden; color: light-dark(#373a40, #f1f2f3); white-space: nowrap; text-overflow: ellipsis; }
  .card-upload__meta { color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; }
  .card-upload__bar { grid-column: 2 / 4; height: 3px; border-radius: 2px; background: light-dark(#ebedf0, #232529); overflow: hidden; }
  .card-upload__bar span { display: block; height: 100%; background: light-dark(#373a40, #f1f2f3); transition: width 0.15s linear; }
  .card-upload__tick { width: 13px; height: 13px; color: light-dark(#373a40, #f1f2f3); }
  .card-upload__tick path { stroke-dasharray: 1; animation: card-upload-tick 0.35s ease-out backwards; }
  @keyframes card-upload-tick {
    from { stroke-dashoffset: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .card-upload__zone:hover .card-upload__edge rect, .card-upload__zone--over .card-upload__edge rect, .card-upload__row, .card-upload__tick path { animation: none; }
    .card-upload__icon { transition: none; }
  }
`;

const size = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

export function UploadCard() {
  const [rows, setRows] = useState<Row[]>([{ id: 0, name: 'brief.pdf', size: '1.2 MB', pct: 100 }]);
  const [over, setOver] = useState(false);
  const id = useId();
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // There is no server here: the progress is simulated, quick at first and slowing towards the end.
  const add = (f: File) => {
    const row = { id: Date.now(), name: f.name, size: size(f.size), pct: 0 };
    setRows((r) => [row, ...r].slice(0, 2));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setRows((r) => r.map((o) => (o.id === row.id ? { ...o, pct: 100 } : o)));
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 1600);
      const pct = Math.round(100 * (1 - (1 - t) ** 2.2));
      setRows((r) => r.map((o) => (o.id === row.id ? { ...o, pct } : o)));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-upload">
        <label
          className={`card-upload__zone${over ? ' card-upload__zone--over' : ''}`}
          htmlFor={id}
          onDragEnter={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            const f = e.dataTransfer.files[0];
            if (f) add(f);
          }}
        >
          <svg className="card-upload__edge" aria-hidden="true">
            <rect x={0.75} y={0.75} width={210.5} height={72.5} rx={11} />
          </svg>
          <span>
            <svg className="card-upload__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
            </svg>
            Drop a file or <u>browse</u>
          </span>
          <input
            id={id}
            className="card-upload__input"
            type="file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) add(f);
              e.target.value = '';
            }}
          />
        </label>
        <ul className="card-upload__rows" aria-live="polite">
          {rows.map((r) => (
            <li key={r.id} className="card-upload__row">
              <span className="card-upload__doc" aria-hidden="true" />
              <span className="card-upload__name">{r.name}</span>
              {r.pct < 100 ? (
                <span className="card-upload__meta">{r.pct}%</span>
              ) : (
                <svg className="card-upload__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Uploaded">
                  <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
                </svg>
              )}
              <span className="card-upload__bar" aria-hidden="true">
                <span style={{ width: `${r.pct}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
