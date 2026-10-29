"use client";

import { useState } from 'react';

const css = `
  @keyframes field-mood-blink { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.1); } }
  @keyframes field-mood-word { from { opacity: 0; transform: translateY(6px); } }
  .field-mood { display: grid; justify-items: center; width: 230px; }
  .field-mood__face { width: 76px; height: 76px; margin-bottom: 4px; }
  .field-mood__head { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#cbced3, #393c41); stroke-width: 1.5; }
  .field-mood__eye { fill: light-dark(#373a40, #f1f2f3); transform-box: fill-box; transform-origin: center; animation: field-mood-blink 4.5s infinite; }
  .field-mood__brow, .field-mood__mouth { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3; stroke-linecap: round; }
  .field-mood__cheek { fill: light-dark(#6d7179, #7d8087); }
  .field-mood__word { height: 22px; color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-weight: 600; animation: field-mood-word 0.25s ease-out; }
  .field-mood__label { margin-bottom: 10px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .field-mood__range { width: 100%; height: 22px; margin: 0; background: none; -webkit-appearance: none; appearance: none; cursor: pointer; }
  .field-mood__range::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: linear-gradient(90deg, light-dark(#dbdde1, #2e3035), light-dark(#50535b, #c6c8cd)); }
  .field-mood__range::-moz-range-track { height: 6px; border-radius: 3px; background: linear-gradient(90deg, light-dark(#dbdde1, #2e3035), light-dark(#50535b, #c6c8cd)); }
  .field-mood__range::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 4px light-dark(#f3f4f7, #1a1c1f), 0 2px 6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); }
  .field-mood__range::-moz-range-thumb { width: 22px; height: 22px; border: 0; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 4px light-dark(#f3f4f7, #1a1c1f), 0 2px 6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); }
  .field-mood__range:focus-visible { outline: none; }
  .field-mood__range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px light-dark(#f3f4f7, #1a1c1f), 0 0 0 6px light-dark(#5f626a, #a7abb2); }
  .field-mood__range:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 4px light-dark(#f3f4f7, #1a1c1f), 0 0 0 6px light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) { .field-mood__eye, .field-mood__word { animation: none; } }
`;

const WORDS = ['Awful', 'Bad', 'Okay', 'Good', 'Great'];

export function MoodInput() {
  const [v, setV] = useState(70);
  const t = (v - 50) / 50; // -1 sad … 1 happy
  const word = WORDS[Math.min(4, Math.floor(v / 20))];
  // The mouth bends, the brows tilt and the eyes open wider as the mood lifts.
  const mouth = `M26 ${52 - t * 2} Q38 ${52 + t * 11} 50 ${52 - t * 2}`;
  const brow = (x: number, dir: number) => `M${x - 6} ${24 - t * dir * 3} L${x + 6} ${24 + t * dir * 3}`;
  const eyeRy = 3.4 + Math.max(0, t) * 1.2;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-mood">
        <svg className="field-mood__face" viewBox="0 0 76 76" aria-hidden="true">
          <circle className="field-mood__head" cx="38" cy="38" r="35" />
          <path className="field-mood__brow" d={brow(27, -1)} />
          <path className="field-mood__brow" d={brow(49, 1)} />
          <ellipse className="field-mood__eye" cx="27" cy="34" rx="3.4" ry={eyeRy} />
          <ellipse className="field-mood__eye" cx="49" cy="34" rx="3.4" ry={eyeRy} style={{ animationDelay: '0.05s' }} />
          <circle className="field-mood__cheek" cx="19" cy="45" r="3.5" opacity={Math.max(0, t) * 0.8} />
          <circle className="field-mood__cheek" cx="57" cy="45" r="3.5" opacity={Math.max(0, t) * 0.8} />
          <path className="field-mood__mouth" d={mouth} />
        </svg>
        <span key={word} className="field-mood__word" aria-hidden="true">
          {word}
        </span>
        <label className="field-mood__label" htmlFor="field-mood-range">
          How was your session?
        </label>
        <input id="field-mood-range" className="field-mood__range" type="range" min={0} max={100} value={v} aria-valuetext={word} onChange={(e) => setV(Number(e.target.value))} />
      </div>
    </>
  );
}
