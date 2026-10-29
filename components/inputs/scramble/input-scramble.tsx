"use client";

import { useState } from 'react';

const css = `
  @keyframes field-scramble-dot { from { transform: scale(0.2); } 60% { transform: scale(1.3); } }
  @keyframes field-scramble-shake { 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
  .field-scramble { width: 170px; }
  .field-scramble__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .field-scramble__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-scramble__dots { display: flex; gap: 7px; }
  .field-scramble__dots[data-done] { animation: field-scramble-shake 0.4s ease-in-out; }
  .field-scramble__dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px light-dark(#6d7179, #7d8087); }
  .field-scramble__dot[data-on] { background: light-dark(#373a40, #f1f2f3); box-shadow: none; animation: field-scramble-dot 0.25s ease-out; }
  .field-scramble__pad { user-select: none; -webkit-user-select: none; position: relative; height: 172px; }
  .field-scramble__key {
    position: absolute;
    left: 0;
    top: 0;
    width: 52px;
    height: 38px;
    border: 0;
    border-radius: 9px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 -2px 0 light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 16px; font-weight: 600;
    cursor: pointer;
    /* Keys glide to their new slots after every press. */
    transition: transform 0.38s cubic-bezier(0.34, 1.3, 0.64, 1), background-color 0.15s;
  }
  .field-scramble__key:active { background: light-dark(#cbced3, #393c41); }
  .field-scramble__key:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .field-scramble__key[data-fn] { background: none; box-shadow: none; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-scramble__status { min-height: 16px; margin-top: 4px; color: light-dark(#50535b, #c6c8cd); font-size: 11px; text-align: center; }
  @media (prefers-reduced-motion: reduce) { .field-scramble__key { transition: background-color 0.15s; } .field-scramble__dots[data-done], .field-scramble__dot[data-on] { animation: none; } }
  .field-scramble__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-scramble__top > :first-child { margin: 0; }
  .field-scramble__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-scramble__info svg { width: 14px; height: 14px; }
  .field-scramble__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-scramble__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-scramble__info::after {
    content: attr(data-tip);
    position: absolute;
    left: -6px;
    bottom: calc(100% + 6px);
    z-index: 5;
    padding: 4px 8px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-family: inherit; font-size: 11px; font-weight: 500; line-height: 1.3;
    width: max-content;
    max-width: 150px;
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
  }
  .field-scramble__info:hover::after, .field-scramble__info:focus-visible::after { opacity: 1; transform: none; }
`;

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const DIGIT_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10];
const slot = (i: number) => `translate(${(i % 3) * 59}px, ${Math.floor(i / 3) * 44}px)`;
const shuffle = () => {
  const a = [...DIGITS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function ScrambleInput() {
  // order[k] is the digit shown in the k-th digit slot. Starts in phone order.
  const [order, setOrder] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
  const [pin, setPin] = useState('');
  const done = pin.length === 4;

  const press = (d: string) => {
    if (done) return;
    const next = pin + d;
    setPin(next);
    // Reshuffle so the finger pattern gives nothing away.
    setOrder(shuffle());
    if (next.length === 4) window.setTimeout(() => setPin(''), 1600);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-scramble" role="group" aria-labelledby="field-scramble-label">
        <div className="field-scramble__head">
          <div className="field-scramble__top">
            <span id="field-scramble-label" className="field-scramble__label">
              PIN
            </span>
            <button type="button" className="field-scramble__info" aria-label="Keys shuffle after each press" data-tip="Keys shuffle after each press">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
          </div>
          <span className="field-scramble__dots" data-done={done || undefined} aria-label={`${pin.length} of 4 digits entered`} role="img">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="field-scramble__dot" data-on={i < pin.length || undefined} />
            ))}
          </span>
        </div>
        <div className="field-scramble__pad">
          {DIGITS.map((d) => (
            <button key={d} type="button" className="field-scramble__key" style={{ transform: slot(DIGIT_SLOTS[order.indexOf(d)]) }} onClick={() => press(d)}>
              {d}
            </button>
          ))}
          <button type="button" className="field-scramble__key" data-fn style={{ transform: slot(9) }} onClick={() => setPin('')}>
            Clear
          </button>
          <button type="button" className="field-scramble__key" data-fn aria-label="Delete" style={{ transform: slot(11) }} onClick={() => setPin((p) => p.slice(0, -1))}>
            ⌫
          </button>
        </div>
        <div className="field-scramble__status" aria-live="polite">
          {done ? 'PIN entered' : ''}
        </div>
      </div>
    </>
  );
}
