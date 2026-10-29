"use client";

import { useId } from 'react';

const css = `
  .radio-altitude { --radio-altitude-p: 0; --radio-altitude-k: 0; display: grid; justify-items: center; gap: 12px; }
  .radio-altitude:has(.radio-altitude__input[value='camp']:checked) { --radio-altitude-p: 0.55; --radio-altitude-k: 1; }
  .radio-altitude:has(.radio-altitude__input[value='summit']:checked) { --radio-altitude-p: 1; --radio-altitude-k: 2; }
  .radio-altitude__map { position: relative; width: 200px; height: 100px; }
  .radio-altitude__map svg { position: absolute; inset: 0; width: 200px; height: 100px; }
  .radio-altitude__range { fill: light-dark(#ebedf0, #232529); }
  .radio-altitude__peak { fill: light-dark(#dbdde1, #2e3035); }
  .radio-altitude__snow { fill: light-dark(#50535b, #c6c8cd); }
  .radio-altitude__trail { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.4; stroke-dasharray: 2 3; stroke-linecap: round; }
  .radio-altitude__walked {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: calc(1 - var(--radio-altitude-p));
    transition: stroke-dashoffset 1.1s cubic-bezier(0.45, 0, 0.3, 1);
  }
  .radio-altitude__climber {
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 25%, transparent);
    offset-path: path('M20 92L60 80L44 66L86 54L70 40L104 28L120 12');
    offset-rotate: 0deg;
    offset-distance: calc(var(--radio-altitude-p) * 100%);
    transition: offset-distance 1.1s cubic-bezier(0.45, 0, 0.3, 1);
  }
  .radio-altitude__readout { position: absolute; right: 0; top: 0; height: 16px; overflow: hidden; }
  .radio-altitude__strip { display: grid; transform: translateY(calc(var(--radio-altitude-k) * -16px)); transition: transform 0.5s cubic-bezier(0.3, 1.3, 0.5, 1) 0.4s; }
  .radio-altitude__strip span { height: 16px; color: light-dark(#42454c, #e5e6e9); font-size: 11px; font-weight: 600; line-height: 16px; text-align: right; font-variant-numeric: tabular-nums; }
  .radio-altitude__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-altitude__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-altitude__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-altitude__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-altitude__opt:has(.radio-altitude__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-altitude__opt:has(.radio-altitude__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-altitude * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const TRAIL = 'M20 92L60 80L44 66L86 54L70 40L104 28L120 12';
const STOPS = [
  { value: 'base', label: 'Base', alt: '1,200 m' },
  { value: 'camp', label: 'Camp', alt: '4,100 m' },
  { value: 'summit', label: 'Summit', alt: '5,364 m' },
];

export function AltitudeRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-altitude">
        <span className="radio-altitude__map" aria-hidden="true">
          <svg viewBox="0 0 200 100">
            <path className="radio-altitude__range" d="M0 100L36 58L62 76L150 30L200 70V100Z" />
            <path className="radio-altitude__peak" d="M4 100L120 8L196 100Z" />
            <path className="radio-altitude__snow" d="M106 19L120 8L134 19L127 17L120 22L113 17Z" />
            <path className="radio-altitude__trail" d={TRAIL} />
            <path className="radio-altitude__walked" pathLength={1} d={TRAIL} />
          </svg>
          <span className="radio-altitude__climber" />
          <span className="radio-altitude__readout">
            <span className="radio-altitude__strip">
              {STOPS.map((s) => (
                <span key={s.value}>{s.alt}</span>
              ))}
            </span>
          </span>
        </span>
        <div className="radio-altitude__opts" role="radiogroup" aria-label="Waypoint">
          {STOPS.map((s, i) => (
            <label key={s.value} className="radio-altitude__opt">
              <input className="radio-altitude__input" type="radio" name={name} value={s.value} defaultChecked={i === 0} />
              {s.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
