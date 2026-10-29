"use client";

import { useEffect, useState } from 'react';

const css = `
  @keyframes field-flapboard-flap { from { transform: rotateX(80deg); filter: brightness(1.6); } }
  .field-flapboard { width: 250px; }
  .field-flapboard__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-flapboard__input {
    width: 100%;
    height: 38px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 9px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 14px; font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: box-shadow 0.2s;
  }
  .field-flapboard__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-flapboard__board { display: flex; gap: 2px; margin-top: 10px; padding: 6px; border-radius: 8px; background: light-dark(#fbfcfd, #121417); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .field-flapboard__cell {
    position: relative;
    flex: 1;
    height: 28px;
    border-radius: 3px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#373a40, #f1f2f3);
    font: 600 16px/28px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-align: center;
    perspective: 80px;
    overflow: hidden;
  }
  /* The split across the middle of every flap. */
  .field-flapboard__cell::after { content: ''; position: absolute; left: 0; right: 0; top: 13.5px; height: 1px; background: light-dark(#fbfcfd, #121417); }
  .field-flapboard__ch { display: block; transform-origin: 50% 50%; animation: field-flapboard-flap 0.09s ease-out; }
  .field-flapboard__meta { display: flex; justify-content: space-between; margin-top: 6px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
  @media (prefers-reduced-motion: reduce) { .field-flapboard__ch { animation: none; } }
`;

const ALPHA = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.';
const CELLS = 12;
const pad = (s: string) => s.toUpperCase().replace(/[^A-Z0-9 .-]/g, ' ').padEnd(CELLS, ' ').slice(0, CELLS);

export function FlapboardInput() {
  const [value, setValue] = useState('Lisbon');
  const [shown, setShown] = useState(() => pad(''));

  // Every tick, each cell that isn't there yet flips one letter further round the drum.
  useEffect(() => {
    const target = pad(value);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(target);
    const id = window.setInterval(() => {
      setShown((cur) => {
        if (cur === target) return cur;
        return [...cur]
          .map((c, i) => (c === target[i] ? c : ALPHA[(ALPHA.indexOf(c) + 1) % ALPHA.length]))
          .join('');
      });
    }, 45);
    return () => clearInterval(id);
  }, [value]);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-flapboard">
        <label className="field-flapboard__label" htmlFor="field-flapboard-input">
          Destination
        </label>
        <input
          id="field-flapboard-input"
          className="field-flapboard__input"
          value={value}
          maxLength={CELLS}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="field-flapboard__board" aria-hidden="true">
          {[...shown].map((c, i) => (
            <span key={i} className="field-flapboard__cell">
              <span key={c} className="field-flapboard__ch">
                {c === ' ' ? ' ' : c}
              </span>
            </span>
          ))}
        </div>
        <div className="field-flapboard__meta" aria-hidden="true">
          <span>Gate 14</span>
          <span>{shown === pad(value) ? 'On time' : 'Updating'}</span>
        </div>
      </div>
    </>
  );
}
