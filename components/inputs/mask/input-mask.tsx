"use client";

import { useState } from 'react';

const css = `
  @keyframes field-mask-drop { from { opacity: 0; transform: translateY(-9px); } 60% { opacity: 1; transform: translateY(1px); } }
  @keyframes field-mask-draw { to { stroke-dashoffset: 0; } }
  .field-mask { width: 250px; }
  .field-mask__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-mask__box {
    position: relative;
    height: 44px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: box-shadow 0.2s;
  }
  .field-mask__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-mask__input, .field-mask__mirror { padding: 0 14px; font: 500 16px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 1px; }
  .field-mask__input { position: relative; z-index: 1; width: 100%; height: 100%; border: 0; outline: 0; background: none; color: transparent; caret-color: light-dark(#373a40, #f1f2f3); }
  .field-mask__mirror { position: absolute; inset: 0; display: flex; align-items: center; white-space: pre; pointer-events: none; }
  .field-mask__slot { display: inline-block; color: light-dark(#cbced3, #393c41); }
  .field-mask__fill { display: inline-block; color: light-dark(#373a40, #f1f2f3); }
  .field-mask__fill[data-digit] { animation: field-mask-drop 0.28s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .field-mask__ok { position: absolute; right: 12px; top: 13px; width: 18px; height: 18px; color: light-dark(#373a40, #f1f2f3); }
  .field-mask__ok path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: field-mask-draw 0.35s ease-out forwards; }
  @media (prefers-reduced-motion: reduce) { .field-mask__fill[data-digit], .field-mask__ok path { animation: none; stroke-dashoffset: 0; } }
`;

const TEMPLATE = '+1 (___) ___-____';
const SLOTS = [...TEMPLATE].flatMap((c, i) => (c === '_' ? [i] : []));

/** The template filled with the digits, cut after the last digit placed. */
const format = (digits: string) => {
  if (!digits) return '';
  const out = [...TEMPLATE];
  [...digits].forEach((d, i) => (out[SLOTS[i]] = d));
  return out.slice(0, SLOTS[digits.length - 1] + 1).join('');
};

export function MaskInput() {
  const [digits, setDigits] = useState('415');
  const shown = format(digits);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-mask">
        <label className="field-mask__label" htmlFor="field-mask-input">
          Phone
        </label>
        <div className="field-mask__box">
          <span className="field-mask__mirror" aria-hidden="true">
            {[...TEMPLATE].map((c, i) =>
              i < shown.length ? (
                <span key={`f${i}${shown[i]}`} className="field-mask__fill" data-digit={SLOTS.includes(i) || undefined}>
                  {shown[i]}
                </span>
              ) : (
                <span key={`s${i}`} className="field-mask__slot">
                  {c}
                </span>
              ),
            )}
          </span>
          <input
            id="field-mask-input"
            className="field-mask__input"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={shown}
            aria-describedby="field-mask-format"
            onChange={(e) => {
              const raw = e.target.value.startsWith('+1') ? e.target.value.slice(2) : e.target.value;
              let next = raw.replace(/\D/g, '').slice(0, SLOTS.length);
              // Backspace over a bracket or dash removes the digit before it.
              if (next === digits && e.target.value.length < shown.length) next = next.slice(0, -1);
              setDigits(next);
            }}
          />
          {digits.length === SLOTS.length && (
            <svg className="field-mask__ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
            </svg>
          )}
        </div>
        <span id="field-mask-format" hidden>
          US number, ten digits
        </span>
      </div>
    </>
  );
}
