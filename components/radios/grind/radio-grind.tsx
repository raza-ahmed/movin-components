"use client";

import * as React from "react";
import { useId, useState } from 'react';

const css = `
  @keyframes radio-grind-crank-a { from { transform: rotate(0deg); } to { transform: rotate(720deg); } }
  @keyframes radio-grind-crank-b { from { transform: rotate(0deg); } to { transform: rotate(720deg); } }
  @keyframes radio-grind-pour { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(26px); } }
  @keyframes radio-grind-settle-a { 0% { transform: translateY(-3px); } 100% { transform: none; } }
  @keyframes radio-grind-settle-b { 0% { transform: translateY(-3px); } 100% { transform: none; } }
  .radio-grind { --radio-grind-s: 2px; display: flex; align-items: center; gap: 18px; }
  .radio-grind:has(.radio-grind__input[value='medium']:checked) { --radio-grind-s: 3.6px; }
  .radio-grind:has(.radio-grind__input[value='coarse']:checked) { --radio-grind-s: 5.4px; }
  .radio-grind__mill { position: relative; width: 64px; height: 104px; }
  .radio-grind__hopper { position: absolute; left: 7px; top: 8px; width: 50px; height: 16px; clip-path: polygon(0 0, 100% 0, 82% 100%, 18% 100%); background: light-dark(#cbced3, #393c41); }
  .radio-grind__head { position: absolute; left: 12px; top: 24px; width: 40px; height: 24px; border-radius: 4px; background: linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#cbced3, #393c41)); box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .radio-grind__crank { position: absolute; left: 44px; top: 32px; width: 0; height: 0; }
  .radio-grind__crank::before { content: ''; position: absolute; left: -1.5px; top: -14px; width: 3px; height: 15px; border-radius: 2px; background: light-dark(#50535b, #c6c8cd); }
  .radio-grind__crank::after { content: ''; position: absolute; left: -3.5px; top: -18px; width: 7px; height: 7px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); }
  .radio-grind[data-flip='a'] .radio-grind__crank { animation: radio-grind-crank-a 0.9s cubic-bezier(0.4, 0, 0.3, 1); }
  .radio-grind[data-flip='b'] .radio-grind__crank { animation: radio-grind-crank-b 0.9s cubic-bezier(0.4, 0, 0.3, 1); }
  .radio-grind__chute { position: absolute; left: 28px; top: 48px; width: 8px; height: 6px; background: light-dark(#dbdde1, #2e3035); }
  .radio-grind__drop { position: absolute; left: 30px; top: 54px; width: 3px; height: 3px; border-radius: 50%; background: light-dark(#5f626a, #a7abb2); opacity: 0; }
  .radio-grind[data-flip] .radio-grind__drop { animation: radio-grind-pour 0.35s linear var(--d) 2; }
  .radio-grind__cup {
    position: absolute;
    left: 9px;
    bottom: 0;
    width: 46px;
    height: 30px;
    overflow: hidden;
    border: 2px solid light-dark(#6d7179, #7d8087);
    border-top: 0;
    border-radius: 0 0 9px 9px;
  }
  .radio-grind__pile { position: absolute; inset: 0; }
  .radio-grind[data-flip='a'] .radio-grind__pile { animation: radio-grind-settle-a 0.4s ease-out 0.5s backwards; }
  .radio-grind[data-flip='b'] .radio-grind__pile { animation: radio-grind-settle-b 0.4s ease-out 0.5s backwards; }
  .radio-grind__bit {
    position: absolute;
    width: var(--radio-grind-s);
    height: var(--radio-grind-s);
    margin: calc(var(--radio-grind-s) / -2) 0 0 calc(var(--radio-grind-s) / -2);
    border-radius: 35%;
    background: light-dark(#5f626a, #a7abb2);
    transform: rotate(var(--r));
    transition: width 0.4s ease calc(var(--i) * 12ms), height 0.4s ease calc(var(--i) * 12ms), margin 0.4s ease calc(var(--i) * 12ms);
  }
  .radio-grind__bit:nth-child(3n) { background: light-dark(#6d7179, #7d8087); }
  .radio-grind__bit:nth-child(4n) { background: light-dark(#50535b, #c6c8cd); }
  .radio-grind__opts { display: grid; gap: 2px; }
  .radio-grind__opt {
    position: relative;
    padding: 4px 10px;
    border-radius: 6px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-grind__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-grind__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-grind__opt:has(.radio-grind__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .radio-grind__opt:has(.radio-grind__input:checked) { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .radio-grind * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// A mound of grounds in the cup: fixed positions, so the server and the browser agree.
const BITS = Array.from({ length: 34 }, (_, i) => {
  const x = 4 + ((i * 13.7) % 38);
  const h = 15 * (1 - ((x - 23) / 22) ** 2);
  const y = 30 - ((i * 7.3) % 1) * h;
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), r: (i * 37) % 90 };
});
const GRINDS = [
  { value: 'fine', label: 'Fine' },
  { value: 'medium', label: 'Medium' },
  { value: 'coarse', label: 'Coarse' },
];

export function GrindRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-grind" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-grind__mill" aria-hidden="true">
          <span className="radio-grind__hopper" />
          <span className="radio-grind__head" />
          <span className="radio-grind__crank" />
          <span className="radio-grind__chute" />
          {[0, 0.12, 0.24].map((d) => (
            <span key={d} className="radio-grind__drop" style={{ '--d': `${d}s` } as React.CSSProperties} />
          ))}
          <span className="radio-grind__cup">
            <span className="radio-grind__pile">
              {BITS.map((b, i) => (
                <span key={i} className="radio-grind__bit" style={{ left: b.x, top: b.y, '--r': `${b.r}deg`, '--i': i } as React.CSSProperties} />
              ))}
            </span>
          </span>
        </span>
        <div className="radio-grind__opts" role="radiogroup" aria-label="Grind">
          {GRINDS.map((g, i) => (
            <label key={g.value} className="radio-grind__opt">
              <input className="radio-grind__input" type="radio" name={name} value={g.value} defaultChecked={i === 0} />
              {g.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
