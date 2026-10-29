"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes card-bank-card-wave { 0% { opacity: 0.2; } 30% { opacity: 1; } 100% { opacity: 0.2; } }
  .card-bank-card {
    position: relative;
    width: 240px;
    height: 150px;
    padding: 16px;
    border-radius: 14px;
    /* Brushed metal: fine horizontal grain over a soft diagonal sheen. */
    background:
      repeating-linear-gradient(0deg, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 3%, transparent) 0 1px, transparent 1px 3px),
      linear-gradient(125deg, light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529) 45%, light-dark(#dbdde1, #2e3035) 70%, light-dark(#f3f4f7, #1a1c1f));
    box-shadow: inset 0 1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 25%, transparent), 0 16px 30px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    color: light-dark(#373a40, #f1f2f3);
    cursor: pointer;
    transition: transform 0.5s cubic-bezier(0.34, 1.3, 0.64, 1);
  }
  .card-bank-card:hover, .card-bank-card:focus-visible { transform: translateY(-4px) rotate(-1.5deg); }
  .card-bank-card:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-bank-card__top { display: flex; justify-content: space-between; align-items: center; }
  .card-bank-card__brand { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; }
  .card-bank-card__nfc { width: 20px; height: 20px; color: light-dark(#42454c, #e5e6e9); }
  .card-bank-card__nfc path { opacity: 0.2; }
  .card-bank-card:hover .card-bank-card__nfc path { animation: card-bank-card-wave 1.2s ease-out infinite; }
  .card-bank-card:hover .card-bank-card__nfc path:nth-child(2) { animation-delay: 0.15s; }
  .card-bank-card:hover .card-bank-card__nfc path:nth-child(3) { animation-delay: 0.3s; }
  .card-bank-card__chip {
    width: 34px;
    height: 26px;
    margin-top: 14px;
    border-radius: 5px;
    background:
      linear-gradient(90deg, transparent 32%, light-dark(#6d7179, #7d8087) 32% 36%, transparent 36% 64%, light-dark(#6d7179, #7d8087) 64% 68%, transparent 68%),
      linear-gradient(transparent 46%, light-dark(#6d7179, #7d8087) 46% 54%, transparent 54%),
      linear-gradient(135deg, light-dark(#42454c, #e5e6e9), light-dark(#5f626a, #a7abb2));
  }
  .card-bank-card__number {
    margin-top: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 15px;
    letter-spacing: 0.08em;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 1px 0 light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4));
  }
  .card-bank-card__bottom { display: flex; justify-content: space-between; margin-top: 8px; color: light-dark(#50535b, #c6c8cd); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
  @media (prefers-reduced-motion: reduce) {
    .card-bank-card { transition: none; }
    .card-bank-card:hover .card-bank-card__nfc path { animation: none; opacity: 1; }
  }
`;

const REAL = '4532 9187 2201 4821';
const MASKED = '•••• •••• •••• 4821';

export function BankCardCard() {
  const [text, setText] = useState(MASKED);
  const timer = useRef(0);
  useEffect(() => () => clearInterval(timer.current), []);

  // Scramble toward the target: each digit cycles random numbers, then locks, left to right.
  const reveal = (to: string) => {
    clearInterval(timer.current);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setText(to);
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame += 1;
      const locked = Math.floor(frame / 1.4);
      setText(
        to
          .split('')
          .map((c, i) => (c === ' ' || i < locked || i >= 15 ? c : String(Math.floor(Math.random() * 10))))
          .join(''),
      );
      if (locked >= 15) clearInterval(timer.current);
    }, 35);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="card-bank-card"
        tabIndex={0}
        role="group"
        aria-label="Debit card ending 4821"
        onPointerEnter={() => reveal(REAL)}
        onPointerLeave={() => {
          clearInterval(timer.current);
          setText(MASKED);
        }}
        onFocus={() => reveal(REAL)}
        onBlur={() => setText(MASKED)}
      >
        <div className="card-bank-card__top">
          <span className="card-bank-card__brand">MOVIN</span>
          <svg className="card-bank-card__nfc" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M16 3.5a12 12 0 0 1 0 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="card-bank-card__chip" aria-hidden="true" />
        <div className="card-bank-card__number" aria-hidden="true">
          {text}
        </div>
        <div className="card-bank-card__bottom" aria-hidden="true">
          <span>A. Rivera</span>
          <span>09/29</span>
        </div>
      </div>
    </>
  );
}
