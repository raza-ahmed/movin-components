"use client";

import { useState } from 'react';

const css = `
  @keyframes field-calc-roll { from { transform: translateY(70%); opacity: 0; } }
  @keyframes field-calc-commit { 0% { background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 18%, light-dark(#f3f4f7, #1a1c1f)); } 100% { background: light-dark(#f3f4f7, #1a1c1f); } }
  @keyframes field-calc-was { from { opacity: 0; transform: translateY(-6px); } }
  .field-calc { width: 250px; }
  .field-calc__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-calc__box {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 44px;
    padding: 0 12px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: box-shadow 0.2s;
  }
  .field-calc__box[data-flash] { animation: field-calc-commit 0.6s ease-out; }
  .field-calc__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-calc__cur { color: light-dark(#5f626a, #a7abb2); font-size: 15px; }
  .field-calc__input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; color: light-dark(#373a40, #f1f2f3); font: 15px ui-monospace, SFMono-Regular, Menlo, monospace; }
  .field-calc__result { display: flex; overflow: hidden; color: light-dark(#42454c, #e5e6e9); font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
  .field-calc__result span { display: inline-block; animation: field-calc-roll 0.28s cubic-bezier(0.2, 0.8, 0.3, 1) both; }
  .field-calc__eq { color: light-dark(#5f626a, #a7abb2); margin-right: 4px; }
  .field-calc__foot { display: flex; justify-content: space-between; min-height: 16px; margin-top: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .field-calc__was { animation: field-calc-was 0.3s ease-out; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  @media (prefers-reduced-motion: reduce) {
    .field-calc__result span, .field-calc__box[data-flash], .field-calc__was { animation: none; }
  }
  .field-calc__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-calc__top > :first-child { margin: 0; }
  .field-calc__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-calc__info svg { width: 14px; height: 14px; }
  .field-calc__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-calc__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-calc__info::after {
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
  .field-calc__info:hover::after, .field-calc__info:focus-visible::after { opacity: 1; transform: none; }
`;

/** A tiny arithmetic parser: + - * / x ( ) and a trailing % on any number. Throws on anything else. */
function evaluate(src: string): number {
  const s = src.replace(/\s+/g, '').replace(/,/g, '').replace(/[x×]/g, '*').replace(/÷/g, '/');
  let i = 0;
  const num = () => {
    const m = /^\d*\.?\d+/.exec(s.slice(i));
    if (!m) throw new Error('number');
    i += m[0].length;
    let v = parseFloat(m[0]);
    if (s[i] === '%') {
      i++;
      v /= 100;
    }
    return v;
  };
  const factor = (): number => {
    if (s[i] === '-') {
      i++;
      return -factor();
    }
    if (s[i] === '(') {
      i++;
      const v = expr();
      if (s[i++] !== ')') throw new Error('paren');
      return v;
    }
    return num();
  };
  const term = () => {
    let v = factor();
    while (s[i] === '*' || s[i] === '/') {
      const op = s[i++];
      const r = factor();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  };
  const expr = (): number => {
    let v = term();
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++];
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  };
  const v = expr();
  if (i !== s.length || !Number.isFinite(v)) throw new Error('trailing');
  return v;
}

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

export function CalcInput() {
  const [value, setValue] = useState('1200 + 40.5');
  const [was, setWas] = useState('');
  const [flash, setFlash] = useState(0);

  let result: number | null = null;
  if (/[-+*/x×÷%(]/.test(value.replace(/^\s*-/, ''))) {
    try {
      result = evaluate(value);
    } catch {
      result = null;
    }
  }

  const commit = () => {
    if (result === null) return;
    setWas(value.trim());
    setValue(String(Math.round(result * 100) / 100));
    setFlash((f) => f + 1);
  };

  const shown = result === null ? '' : fmt(result);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-calc">
        <div className="field-calc__top">
          <label className="field-calc__label" htmlFor="field-calc-input">
            Budget
          </label>
          <button type="button" className="field-calc__info" aria-label="Type a sum; Enter uses the total" data-tip="Type a sum; Enter uses the total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
        </div>
        <div key={flash} className="field-calc__box" data-flash={flash || undefined}>
          <span className="field-calc__cur" aria-hidden="true">
            $
          </span>
          <input
            id="field-calc-input"
            className="field-calc__input"
            value={value}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            aria-describedby="field-calc-out"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
            autoFocus={flash > 0}
          />
          <span id="field-calc-out" className="field-calc__result" aria-live="polite">
            {shown && <span className="field-calc__eq">=</span>}
            {[...shown].map((c, i) => (
              <span key={`${i}${c}`} style={{ animationDelay: `${i * 18}ms` }}>
                {c}
              </span>
            ))}
          </span>
        </div>
        <div className="field-calc__foot">
          <span />
          {was && (
            <span key={was} className="field-calc__was">
              {was}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
