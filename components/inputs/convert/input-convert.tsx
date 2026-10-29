"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes field-convert-in { from { opacity: 0; transform: translateY(6px); } }
  .field-convert { width: 250px; }
  .field-convert__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-convert__input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 15px;
    transition: box-shadow 0.2s;
  }
  .field-convert__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-convert__rows { display: grid; gap: 4px; min-height: 84px; margin-top: 8px; }
  .field-convert__row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 5px 10px;
    border-radius: 7px;
    background: light-dark(#f3f4f7, #1a1c1f);
    animation: field-convert-in 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) both;
  }
  .field-convert__row b { color: light-dark(#373a40, #f1f2f3); font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
  .field-convert__row span { color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  @media (prefers-reduced-motion: reduce) { .field-convert__row { animation: none; } }
  .field-convert__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-convert__top > :first-child { margin: 0; }
  .field-convert__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-convert__info svg { width: 14px; height: 14px; }
  .field-convert__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-convert__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-convert__info::after {
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
  .field-convert__info:hover::after, .field-convert__info:focus-visible::after { opacity: 1; transform: none; }
`;

type Unit = { group: 'length' | 'mass' | 'temp'; name: string; toBase: (v: number) => number; fromBase: (v: number) => number };
const lin = (group: Unit['group'], name: string, k: number): Unit => ({ group, name, toBase: (v) => v * k, fromBase: (v) => v / k });
const UNITS: Record<string, Unit> = {
  km: lin('length', 'kilometres', 1000),
  m: lin('length', 'metres', 1),
  mi: lin('length', 'miles', 1609.344),
  ft: lin('length', 'feet', 0.3048),
  kg: lin('mass', 'kilograms', 1),
  g: lin('mass', 'grams', 0.001),
  lb: lin('mass', 'pounds', 0.45359237),
  c: { group: 'temp', name: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
  f: { group: 'temp', name: 'Fahrenheit', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
};
const SYMBOL: Record<string, string> = { c: '°C', f: '°F' };

/** A number that eases to its new value instead of jumping. */
function useTween(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(target);
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      const k = 1 - (1 - t) ** 3;
      const x = a + (target - a) * k;
      from.current = x;
      setV(x);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function Row({ value, unit, i }: { value: number; unit: string; i: number }) {
  const v = useTween(value);
  return (
    <div className="field-convert__row" style={{ animationDelay: `${i * 50}ms` }}>
      <b>
        {v.toLocaleString('en-GB', { maximumFractionDigits: Math.abs(v) < 10 ? 2 : 1 })} {SYMBOL[unit] ?? unit}
      </b>
      <span>{UNITS[unit].name}</span>
    </div>
  );
}

export function ConvertInput() {
  const [value, setValue] = useState('5 km');
  const m = /^\s*(-?\d[\d,]*\.?\d*)\s*°?\s*(km|mi|m|ft|kg|g|lb|c|f)\s*$/i.exec(value);
  const unit = m?.[2].toLowerCase();
  const n = m ? parseFloat(m[1].replace(/,/g, '')) : NaN;
  const others = unit ? Object.keys(UNITS).filter((u) => u !== unit && UNITS[u].group === UNITS[unit].group) : [];

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-convert">
        <div className="field-convert__top">
          <label className="field-convert__label" htmlFor="field-convert-input">
            Convert
          </label>
          <button type="button" className="field-convert__info" aria-label="Try 12 mi, 70 kg or 21 °C" data-tip="Try 12 mi, 70 kg or 21 °C">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
        </div>
        <input
          id="field-convert-input"
          className="field-convert__input"
          value={value}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="field-convert__rows" aria-live="polite">
          {unit && Number.isFinite(n) ? (
            others.map((u, i) => <Row key={`${UNITS[unit].group}-${u}`} i={i} unit={u} value={UNITS[u].fromBase(UNITS[unit].toBase(n))} />)
          ) : (
            null
          )}
        </div>
      </div>
    </>
  );
}
