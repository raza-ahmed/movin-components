"use client";

import { useId } from 'react';

const OPTIONS = [
  { value: 'silent', label: 'Silent', note: 'No sound, no buzz' },
  { value: 'vibrate', label: 'Vibrate', note: 'Buzzes in short bursts' },
  { value: 'ring', label: 'Ring', note: 'Rings out loud' },
];
const at = (n: number) => `.radio-ringer:has(.radio-ringer__opt:nth-child(${n}) input:checked)`;

const css = `
  .radio-ringer { display: grid; justify-items: center; gap: 14px; width: 260px; }
  .radio-ringer__view { display: block; width: 200px; height: 112px; overflow: visible; }
  .radio-ringer__case { fill: light-dark(#dbdde1, #2e3035); }
  .radio-ringer__screen { fill: light-dark(#f3f4f7, #1a1c1f); transition: fill 0.4s; }
  .radio-ringer__bell { fill: light-dark(#42454c, #e5e6e9); transform-box: view-box; transform-origin: 100px 40px; transition: fill 0.4s; }
  .radio-ringer__slash { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.3s; }
  .radio-ringer__lines path, .radio-ringer__waves path { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2; stroke-linecap: round; }
  .radio-ringer__phone { transform-box: view-box; transform-origin: 100px 56px; }
  .radio-ringer__lines, .radio-ringer__waves path { opacity: 0; }
  .radio-ringer__waves path { transform-box: view-box; transform-origin: 100px 50px; }
  /* Silent: a slash draws across the bell and the screen dims. */
  ${at(1)} .radio-ringer__slash { stroke-dashoffset: 0; transition-duration: 0.45s; }
  ${at(1)} .radio-ringer__bell { fill: light-dark(#6d7179, #7d8087); }
  ${at(1)} .radio-ringer__screen { fill: light-dark(#fbfcfd, #121417); }
  /* Vibrate: the phone shudders in short bursts with motion lines either side. */
  ${at(2)} .radio-ringer__phone { animation: radio-ringer-buzz 1.6s infinite; }
  ${at(2)} .radio-ringer__lines { animation: radio-ringer-lines 1.6s infinite; }
  @keyframes radio-ringer-buzz {
    3%, 9%, 15%, 21% { transform: translateX(-2px) rotate(-2deg); }
    6%, 12%, 18%, 24% { transform: translateX(2px) rotate(2deg); }
    27%, 100% { transform: none; }
  }
  @keyframes radio-ringer-lines {
    2%, 24% { opacity: 1; }
    30%, 100% { opacity: 0; }
  }
  /* Ring: the bell swings and sound waves roll out from the phone. */
  ${at(3)} .radio-ringer__bell { animation: radio-ringer-swing 1.2s ease-in-out infinite; }
  @keyframes radio-ringer-swing {
    10% { transform: rotate(16deg); }
    20% { transform: rotate(-14deg); }
    30% { transform: rotate(10deg); }
    40% { transform: rotate(-6deg); }
    50%, 100% { transform: none; }
  }
  ${at(3)} .radio-ringer__waves path { animation: radio-ringer-wave 1.2s ease-out infinite; }
  ${at(3)} .radio-ringer__waves path:nth-child(even) { animation-delay: 0.3s; }
  @keyframes radio-ringer-wave {
    from { opacity: 0.9; transform: scale(0.8); }
    to { opacity: 0; transform: scale(1.25); }
  }
  .radio-ringer__read { display: grid; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .radio-ringer__read > * { grid-area: 1 / 1; text-align: center; opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.3s; }
  ${at(1)} .radio-ringer__read > :nth-child(1), ${at(2)} .radio-ringer__read > :nth-child(2), ${at(3)} .radio-ringer__read > :nth-child(3) { opacity: 1; transform: none; }
  .radio-ringer__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-ringer__opt { position: relative; flex: 1; padding: 7px 12px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-ringer__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-ringer__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-ringer__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-ringer__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) {
    .radio-ringer * { animation: none !important; transition: none !important; }
    ${at(2)} .radio-ringer__lines, ${at(3)} .radio-ringer__waves path { opacity: 1; }
  }
`;

export function RingerRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-ringer">
        <svg className="radio-ringer__view" viewBox="0 0 200 112" aria-hidden="true">
          <g className="radio-ringer__waves">
            <path d="M62 40Q54 56 62 72" />
            <path d="M52 32Q40 56 52 80" />
            <path d="M138 40Q146 56 138 72" />
            <path d="M148 32Q160 56 148 80" />
          </g>
          <g className="radio-ringer__lines">
            <path d="M64 46V66" />
            <path d="M58 50V62" />
            <path d="M136 46V66" />
            <path d="M142 50V62" />
          </g>
          <g className="radio-ringer__phone">
            <rect className="radio-ringer__case" x={74} y={8} width={52} height={96} rx={10} />
            <rect className="radio-ringer__screen" x={78} y={14} width={44} height={82} rx={6} />
            <path className="radio-ringer__bell" d="M100 40C94 40 91 45 91 50V57L88 61H112L109 57V50C109 45 106 40 100 40ZM97 63A3 3 0 0 0 103 63Z" />
            <path className="radio-ringer__slash" d="M89 39L111 66" pathLength={1} />
          </g>
        </svg>
        <span className="radio-ringer__read" aria-hidden="true">
          {OPTIONS.map((o) => (
            <span key={o.value}>{o.note}</span>
          ))}
        </span>
        <div className="radio-ringer__opts" role="radiogroup" aria-label="Ringer">
          {OPTIONS.map((o, i) => (
            <label key={o.value} className="radio-ringer__opt">
              <input className="radio-ringer__input" type="radio" name={name} value={o.value} defaultChecked={i === 2} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
