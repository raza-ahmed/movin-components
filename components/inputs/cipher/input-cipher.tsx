"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .field-cipher { width: 250px; }
  .field-cipher__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-cipher__box {
    position: relative;
    display: flex;
    align-items: center;
    height: 42px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: box-shadow 0.2s;
  }
  .field-cipher__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .field-cipher__input, .field-cipher__mirror { padding: 0 12px; font: 500 15px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 2px; }
  .field-cipher__input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: none; color: transparent; caret-color: light-dark(#373a40, #f1f2f3); }
  .field-cipher__input::placeholder { color: light-dark(#5f626a, #a7abb2); letter-spacing: 0; font-family: system-ui, sans-serif; font-size: 14px; }
  .field-cipher__mirror {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 62px;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: light-dark(#373a40, #f1f2f3);
    white-space: pre;
    pointer-events: none;
  }
  .field-cipher__ch[data-busy] { color: light-dark(#50535b, #c6c8cd); }
  .field-cipher__toggle {
    margin-right: 6px;
    padding: 6px 9px;
    border: 0;
    border-radius: 7px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#42454c, #e5e6e9);
    font-family: inherit; font-size: 11px; font-weight: 600;
    cursor: pointer;
  }
  .field-cipher__toggle:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
`;

const GLYPHS = '#%&@$*+=?/<>{}[]';
const DUR = 360;
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export function CipherInput() {
  const [value, setValue] = useState('');
  const [reveal, setReveal] = useState(false);
  // When each character last started decoding; it scrambles for DUR ms from then.
  const born = useRef<number[]>([]);
  const [, setFrame] = useState(0);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = window.setInterval(() => {
      const now = performance.now();
      if (!still && born.current.some((t) => now - t < DUR)) setFrame((f) => f + 1);
    }, 45);
    return () => clearInterval(id);
  }, []);

  const change = (next: string) => {
    // Keep the timings of the characters that survived the edit; new ones start scrambling now.
    let p = 0;
    while (p < value.length && p < next.length && value[p] === next[p]) p++;
    let s = 0;
    while (s < value.length - p && s < next.length - p && value[value.length - 1 - s] === next[next.length - 1 - s]) s++;
    const now = performance.now();
    born.current = [...born.current.slice(0, p), ...Array(next.length - p - s).fill(now), ...born.current.slice(born.current.length - s)];
    setValue(next);
  };

  const flip = () => {
    const now = performance.now();
    born.current = born.current.map((_, i) => now + i * 30);
    setReveal(!reveal);
  };

  const now = performance.now();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-cipher">
        <label className="field-cipher__label" htmlFor="field-cipher-input">
          Password
        </label>
        <div className="field-cipher__box">
          <input
            id="field-cipher-input"
            className="field-cipher__input"
            type={reveal ? 'text' : 'password'}
            value={value}
            placeholder="Type a password"
            autoComplete="new-password"
            spellCheck={false}
            onChange={(e) => change(e.target.value)}
          />
          <span className="field-cipher__mirror" aria-hidden="true">
            {[...value].map((c, i) => {
              const age = now - (born.current[i] ?? 0);
              const busy = age >= 0 && age < DUR;
              return (
                <span key={i} className="field-cipher__ch" data-busy={busy || undefined}>
                  {busy ? glyph() : reveal && age >= DUR ? c : '•'}
                </span>
              );
            })}
          </span>
          <button type="button" className="field-cipher__toggle" aria-pressed={reveal} onClick={flip}>
            {reveal ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
    </>
  );
}
