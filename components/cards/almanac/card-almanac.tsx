"use client";

import { useState } from 'react';

const DAYS = [
  { day: 'Thursday', date: 29, note: 'Ship the small thing.' },
  { day: 'Friday', date: 30, note: 'Tidy the desk, then leave early.' },
  { day: 'Saturday', date: 31, note: 'Nothing planned. Keep it that way.' },
  { day: 'Sunday', date: 1, note: 'A long walk before the week.' },
];

const css = `
  /* The torn page lifts from its right edge, twists and drops away. */
  @keyframes card-almanac-tear {
    0% { transform: none; opacity: 1; }
    25% { transform: rotate(-6deg) translateY(-4px); }
    100% { transform: translate(-60px, 120px) rotate(-38deg); opacity: 0; }
  }
  .card-almanac {
    position: relative;
    width: 168px;
    height: 196px;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    cursor: pointer;
  }
  .card-almanac:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 12px; }
  .card-almanac__block { position: absolute; inset: 18px 0 0; border-radius: 6px 6px 12px 12px; background: light-dark(#ebedf0, #232529); box-shadow: 0 2px 0 light-dark(#dbdde1, #2e3035), 0 4px 0 light-dark(#ebedf0, #232529), 0 6px 0 light-dark(#dbdde1, #2e3035), 0 16px 26px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .card-almanac__page {
    position: absolute;
    inset: 18px 0 6px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 2px;
    padding: 14px;
    border-radius: 4px 4px 10px 10px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    transform-origin: 90% 0;
  }
  .card-almanac__page::before { content: ''; position: absolute; top: 6px; left: 8px; right: 8px; border-top: 1.5px dotted light-dark(#6d7179, #7d8087); }
  .card-almanac__month { color: light-dark(#5f626a, #a7abb2); font-size: 10px; letter-spacing: 0.24em; margin-right: -0.24em; text-transform: uppercase; }
  .card-almanac__date { font-size: 58px; font-weight: 600; line-height: 1; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
  .card-almanac__day { color: light-dark(#42454c, #e5e6e9); font-size: 13px; font-weight: 500; }
  .card-almanac__note { margin-top: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 10.5px; font-style: italic; text-align: center; line-height: 1.35; }
  .card-almanac__page[data-gone] { animation: card-almanac-tear 0.8s cubic-bezier(0.4, 0, 0.7, 0.6) both; pointer-events: none; }
  .card-almanac__bind { position: absolute; top: 8px; left: 26px; right: 26px; height: 18px; border-radius: 4px; background: light-dark(#cbced3, #393c41); box-shadow: inset 0 -2px 0 light-dark(#6d7179, #7d8087); }
  @media (prefers-reduced-motion: reduce) {
    .card-almanac__page[data-gone] { animation: none; display: none; }
  }
`;

function Page({ d, gone }: { d: (typeof DAYS)[number]; gone?: boolean }) {
  return (
    <span className="card-almanac__page" data-gone={gone || undefined} aria-hidden="true">
      <span className="card-almanac__month">{d.date < 15 ? 'November' : 'October'}</span>{' '}
      <span className="card-almanac__date">{d.date}</span>{' '}
      <span className="card-almanac__day">{d.day}</span>{' '}
      <span className="card-almanac__note">{d.note}</span>
    </span>
  );
}

export function AlmanacCard() {
  const [i, setI] = useState(0);
  const cur = DAYS[i % DAYS.length]!;
  const prev = i > 0 ? DAYS[(i - 1) % DAYS.length]! : null;
  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="card-almanac"
        aria-label={`${cur.date < 15 ? 'November' : 'October'} ${cur.date}, ${cur.day}. ${cur.note} Tear off this page`}
        onClick={() => setI((n) => n + 1)}
      >
        <span className="card-almanac__block" aria-hidden="true" />
        <Page d={cur} />
        {prev && <Page key={i} d={prev} gone />}
        <span className="card-almanac__bind" aria-hidden="true" />
      </button>
    </>
  );
}
