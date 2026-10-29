"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  @keyframes radio-phase-twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
  .radio-phase { --radio-phase-x: 0px; --radio-phase-g: 0; display: grid; justify-items: center; gap: 14px; }
  .radio-phase:has(.radio-phase__input[value='crescent']:checked) { --radio-phase-x: -20px; --radio-phase-g: 0.3; }
  .radio-phase:has(.radio-phase__input[value='gibbous']:checked) { --radio-phase-x: -50px; --radio-phase-g: 0.65; }
  .radio-phase:has(.radio-phase__input[value='full']:checked) { --radio-phase-x: -80px; --radio-phase-g: 1; }
  .radio-phase__sky { position: relative; width: 180px; height: 92px; }
  .radio-phase__star { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); animation: radio-phase-twinkle 2.4s ease-in-out infinite; animation-delay: var(--d); }
  .radio-phase__halo {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 120px;
    height: 120px;
    margin: -60px;
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 26%, transparent), transparent);
    opacity: var(--radio-phase-g);
    transition: opacity 0.9s ease;
  }
  .radio-phase__moon {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 68px;
    height: 68px;
    margin: -34px;
    overflow: hidden;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
  }
  .radio-phase__crater { position: absolute; border-radius: 50%; background: color-mix(in oklab, light-dark(#5f626a, #a7abb2) 60%, transparent); }
  /* The night side: a disc the moon's size sliding off it. */
  .radio-phase__shadow {
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    background: light-dark(#ebedf0, #232529);
    box-shadow: 4px 0 6px color-mix(in oklab, light-dark(#ebedf0, #232529) 60%, transparent);
    opacity: 0.94;
    transform: translateX(var(--radio-phase-x));
    transition: transform 0.9s cubic-bezier(0.45, 0, 0.3, 1);
  }
  .radio-phase__opts { display: flex; gap: 3px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-phase__opt {
    position: relative;
    padding: 5px 9px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-phase__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-phase__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-phase__opt:has(.radio-phase__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-phase__opt:has(.radio-phase__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-phase * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

const STARS = [
  [12, 14, '0s'],
  [30, 70, '0.8s'],
  [150, 18, '1.4s'],
  [166, 64, '0.4s'],
  [24, 44, '1.9s'],
  [140, 84, '1.1s'],
];
const CRATERS = [
  [16, 20, 10],
  [40, 36, 14],
  [24, 46, 7],
  [46, 14, 6],
];
const PHASES = [
  { value: 'new', label: 'New' },
  { value: 'crescent', label: 'Crescent' },
  { value: 'gibbous', label: 'Gibbous' },
  { value: 'full', label: 'Full' },
];

export function PhaseRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-phase">
        <span className="radio-phase__sky" aria-hidden="true">
          {STARS.map(([x, y, d]) => (
            <span key={`${x}-${y}`} className="radio-phase__star" style={{ left: x, top: y, '--d': d } as React.CSSProperties} />
          ))}
          <span className="radio-phase__halo" />
          <span className="radio-phase__moon">
            {CRATERS.map(([x, y, s]) => (
              <span key={`${x}-${y}`} className="radio-phase__crater" style={{ left: x, top: y, width: s, height: s }} />
            ))}
            <span className="radio-phase__shadow" />
          </span>
        </span>
        <div className="radio-phase__opts" role="radiogroup" aria-label="Moon phase">
          {PHASES.map((p, i) => (
            <label key={p.value} className="radio-phase__opt">
              <input className="radio-phase__input" type="radio" name={name} value={p.value} defaultChecked={i === 1} />
              {p.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
