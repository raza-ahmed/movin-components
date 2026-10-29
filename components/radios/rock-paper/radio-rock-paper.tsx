"use client";

import * as React from "react";
import { useId, useState } from 'react';

const css = `
  @keyframes radio-rock-paper-shake-a { 0%, 50%, 100% { transform: translateY(0) rotate(0deg); } 25%, 75% { transform: translateY(-10px) rotate(-8deg); } }
  @keyframes radio-rock-paper-shake-b { 0%, 50%, 100% { transform: translateY(0) rotate(0deg); } 25%, 75% { transform: translateY(-10px) rotate(-8deg); } }
  .radio-rock-paper { display: flex; align-items: center; gap: 20px; }
  .radio-rock-paper__stage { position: relative; width: 72px; height: 84px; }
  .radio-rock-paper__hand { position: absolute; inset: 0; transform-origin: 50% 100%; }
  .radio-rock-paper[data-flip='a'] .radio-rock-paper__hand { animation: radio-rock-paper-shake-a 0.5s ease-in-out; }
  .radio-rock-paper[data-flip='b'] .radio-rock-paper__hand { animation: radio-rock-paper-shake-b 0.5s ease-in-out; }
  .radio-rock-paper__palm {
    position: absolute;
    left: 16px;
    top: 40px;
    width: 38px;
    height: 34px;
    border-radius: 9px 9px 14px 14px;
    background: linear-gradient(light-dark(#42454c, #e5e6e9), light-dark(#5f626a, #a7abb2));
  }
  .radio-rock-paper__wrist { position: absolute; left: 22px; top: 70px; width: 26px; height: 14px; border-radius: 0 0 4px 4px; background: light-dark(#5f626a, #a7abb2); }
  .radio-rock-paper__finger {
    --radio-rock-paper-up: 0.28;
    --radio-rock-paper-tilt: 0deg;
    position: absolute;
    top: 12px;
    width: 8px;
    height: 32px;
    border-radius: 4px 4px 2px 2px;
    background: linear-gradient(90deg, light-dark(#50535b, #c6c8cd), light-dark(#42454c, #e5e6e9));
    box-shadow: inset -1px 0 0 light-dark(#6d7179, #7d8087);
    transform-origin: 50% 100%;
    transform: rotate(var(--radio-rock-paper-tilt)) scaleY(var(--radio-rock-paper-up));
    /* The throw lands as the shake ends. */
    transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1) calc(0.45s + var(--i) * 30ms);
  }
  .radio-rock-paper__thumb {
    position: absolute;
    left: 6px;
    top: 44px;
    width: 8px;
    height: 22px;
    border-radius: 4px;
    background: light-dark(#50535b, #c6c8cd);
    transform-origin: 100% 100%;
    transform: rotate(70deg);
    transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1) 0.45s;
  }
  .radio-rock-paper:has(.radio-rock-paper__input[value='paper']:checked) .radio-rock-paper__finger { --radio-rock-paper-up: 1; --radio-rock-paper-tilt: calc((var(--i) - 1.5) * 5deg); }
  .radio-rock-paper:has(.radio-rock-paper__input[value='paper']:checked) .radio-rock-paper__thumb { transform: rotate(-30deg); }
  .radio-rock-paper:has(.radio-rock-paper__input[value='scissors']:checked) .radio-rock-paper__finger:nth-child(-n + 2) { --radio-rock-paper-up: 1; --radio-rock-paper-tilt: calc((var(--i) - 0.5) * 22deg); }
  .radio-rock-paper__opts { display: grid; gap: 2px; }
  .radio-rock-paper__opt {
    position: relative;
    padding: 4px 10px;
    border-radius: 6px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-rock-paper__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-rock-paper__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-rock-paper__opt:has(.radio-rock-paper__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .radio-rock-paper__opt:has(.radio-rock-paper__input:checked) { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .radio-rock-paper * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const MOVES = [
  { value: 'rock', label: 'Rock' },
  { value: 'paper', label: 'Paper' },
  { value: 'scissors', label: 'Scissors' },
];

export function RockPaperRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-rock-paper" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-rock-paper__stage" aria-hidden="true">
          <span className="radio-rock-paper__hand">
            {/* Index, middle, ring, little: the first two stay up for scissors. */}
            <span className="radio-rock-paper__fingers">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="radio-rock-paper__finger" style={{ left: 18 + i * 9, '--i': i } as React.CSSProperties} />
              ))}
            </span>
            <span className="radio-rock-paper__wrist" />
            <span className="radio-rock-paper__palm" />
            <span className="radio-rock-paper__thumb" />
          </span>
        </span>
        <div className="radio-rock-paper__opts" role="radiogroup" aria-label="Your move">
          {MOVES.map((m, i) => (
            <label key={m.value} className="radio-rock-paper__opt">
              <input className="radio-rock-paper__input" type="radio" name={name} value={m.value} defaultChecked={i === 0} />
              {m.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
