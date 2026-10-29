"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  @keyframes radio-burner-flicker {
    0%, 100% { transform: scaleY(1) skewX(0deg); }
    30% { transform: scaleY(0.86) skewX(4deg); }
    60% { transform: scaleY(1.06) skewX(-3deg); }
  }
  .radio-burner { --radio-burner-h: 0.35; --radio-burner-k: -70deg; display: grid; justify-items: center; gap: 14px; }
  .radio-burner:has(.radio-burner__input[value='medium']:checked) { --radio-burner-h: 0.65; --radio-burner-k: 0deg; }
  .radio-burner:has(.radio-burner__input[value='high']:checked) { --radio-burner-h: 1; --radio-burner-k: 70deg; }
  .radio-burner__stove { display: flex; align-items: flex-end; gap: 22px; }
  .radio-burner__ring { position: relative; width: 130px; height: 62px; }
  .radio-burner__glow {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    background: radial-gradient(50% 70% at 50% 100%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 22%, transparent), transparent);
    opacity: calc(0.3 + var(--radio-burner-h) * 0.7);
    transition: opacity 0.5s;
  }
  .radio-burner__base { position: absolute; left: 4px; right: 4px; bottom: 0; height: 10px; border-radius: 5px; background: linear-gradient(light-dark(#5f626a, #a7abb2), light-dark(#cbced3, #393c41)); }
  .radio-burner__flames { position: absolute; left: 10px; right: 10px; bottom: 9px; display: flex; justify-content: space-between; align-items: flex-end; }
  .radio-burner__flame {
    width: 10px;
    height: 46px;
    transform-origin: 50% 100%;
    transform: scaleY(var(--radio-burner-h));
    transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) calc(var(--i) * 25ms);
  }
  .radio-burner__flame::before {
    content: '';
    display: block;
    width: 10px;
    height: 46px;
    border-radius: 50% 50% 45% 45% / 75% 75% 25% 25%;
    background: linear-gradient(to top, light-dark(#5f626a, #a7abb2), light-dark(#373a40, #f1f2f3) 35%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent));
    transform-origin: 50% 100%;
    animation: radio-burner-flicker 0.5s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.13s);
  }
  .radio-burner__knob {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 32%, light-dark(#50535b, #c6c8cd), light-dark(#cbced3, #393c41));
    box-shadow: 0 3px 6px color-mix(in oklab, light-dark(#fbfcfd, #121417) 60%, transparent);
    transform: rotate(var(--radio-burner-k));
    transition: transform 0.45s cubic-bezier(0.3, 1.4, 0.5, 1);
  }
  .radio-burner__knob::after { content: ''; position: absolute; left: 16.5px; top: 4px; width: 3px; height: 12px; border-radius: 2px; background: light-dark(#f3f4f7, #1a1c1f); }
  .radio-burner__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-burner__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-burner__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-burner__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-burner__opt:has(.radio-burner__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-burner__opt:has(.radio-burner__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-burner *, .radio-burner *::before { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const HEATS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function BurnerRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-burner">
        <span className="radio-burner__stove" aria-hidden="true">
          <span className="radio-burner__ring">
            <span className="radio-burner__glow" />
            <span className="radio-burner__flames">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className="radio-burner__flame" style={{ '--i': i } as React.CSSProperties} />
              ))}
            </span>
            <span className="radio-burner__base" />
          </span>
          <span className="radio-burner__knob" />
        </span>
        <div className="radio-burner__opts" role="radiogroup" aria-label="Flame">
          {HEATS.map((h, i) => (
            <label key={h.value} className="radio-burner__opt">
              <input className="radio-burner__input" type="radio" name={name} value={h.value} defaultChecked={i === 0} />
              {h.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
