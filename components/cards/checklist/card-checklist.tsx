"use client";

import { useState } from 'react';

const TASKS = ['Write the brief', 'Pick the type', 'Proof the copy', 'Book the shoot'];

const css = `
  .card-checklist { box-sizing: border-box; width: 240px; padding: 14px 16px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-checklist__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .card-checklist__title { margin: 0; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-checklist__title--done { animation: card-checklist-pop 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); }
  @keyframes card-checklist-pop {
    from { transform: scale(0.85); opacity: 0; }
  }
  .card-checklist__ring { position: relative; width: 34px; height: 34px; }
  .card-checklist__ring svg { width: 34px; height: 34px; transform: rotate(-90deg); }
  .card-checklist__track { fill: none; stroke: light-dark(#dbdde1, #2e3035); stroke-width: 3; }
  .card-checklist__arc { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; transition: stroke-dashoffset 0.5s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .card-checklist__ring span { position: absolute; inset: 0; display: grid; place-items: center; font-size: 9.5px; font-weight: 700; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; }
  .card-checklist__list { display: grid; gap: 2px; margin: 0; padding: 0; list-style: none; }
  .card-checklist__item { position: relative; display: flex; align-items: center; gap: 10px; height: 30px; font-size: 12px; color: light-dark(#42454c, #e5e6e9); cursor: pointer; }
  .card-checklist__input { position: absolute; left: 0; top: 7px; width: 16px; height: 16px; margin: 0; opacity: 0; cursor: pointer; }
  .card-checklist__box { flex: none; display: grid; place-items: center; width: 16px; height: 16px; box-sizing: border-box; border: 1.5px solid light-dark(#6d7179, #7d8087); border-radius: 5px; color: light-dark(#fbfcfd, #121417); transition: background-color 0.2s, border-color 0.2s; }
  .card-checklist__box svg { width: 11px; height: 11px; }
  .card-checklist__box path { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.25s ease-out; }
  .card-checklist__input:checked + .card-checklist__box { background: light-dark(#373a40, #f1f2f3); border-color: light-dark(#373a40, #f1f2f3); }
  .card-checklist__input:checked + .card-checklist__box path { stroke-dashoffset: 0; transition-delay: 0.08s; }
  .card-checklist__input:focus-visible + .card-checklist__box { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-checklist__text { position: relative; transition: color 0.3s; }
  .card-checklist__text::after { content: ''; position: absolute; left: -2px; right: -2px; top: 52%; height: 1.5px; background: light-dark(#5f626a, #a7abb2); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease-out; }
  .card-checklist__input:checked ~ .card-checklist__text { color: light-dark(#5f626a, #a7abb2); }
  .card-checklist__input:checked ~ .card-checklist__text::after { transform: scaleX(1); }
  @media (prefers-reduced-motion: reduce) {
    .card-checklist__arc, .card-checklist__box path, .card-checklist__text::after { transition: none; }
    .card-checklist__title--done { animation: none; }
  }
`;

export function ChecklistCard() {
  const [done, setDone] = useState([true, true, false, false]);
  const n = done.filter(Boolean).length;
  const all = n === TASKS.length;
  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-checklist">
        <div className="card-checklist__head">
          <p key={String(all)} className={`card-checklist__title${all ? ' card-checklist__title--done' : ''}`}>
            {all ? 'All set for launch' : 'Launch prep'}
          </p>
          <div className="card-checklist__ring" role="img" aria-label={`${n} of ${TASKS.length} done`}>
            <svg viewBox="0 0 34 34" aria-hidden="true">
              <circle className="card-checklist__track" cx={17} cy={17} r={14} />
              <circle className="card-checklist__arc" cx={17} cy={17} r={14} pathLength={1} style={{ strokeDashoffset: 1 - n / TASKS.length }} />
            </svg>
            <span aria-hidden="true">
              {n}/{TASKS.length}
            </span>
          </div>
        </div>
        <ul className="card-checklist__list">
          {TASKS.map((t, i) => (
            <li key={t}>
              <label className="card-checklist__item">
                <input className="card-checklist__input" type="checkbox" checked={done[i]} onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))} />
                <span className="card-checklist__box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
                  </svg>
                </span>
                <span className="card-checklist__text">{t}</span>
              </label>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
