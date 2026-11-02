"use client";

import { useId } from 'react';

const OPTIONS = [
  { value: 'drip', label: 'Drip', note: 'A drop every second or so' },
  { value: 'trickle', label: 'Trickle', note: 'A thin, steady thread' },
  { value: 'full', label: 'Full', note: 'Wide open, with splashes' },
];
const at = (n: number) => `.radio-tap:has(.radio-tap__opt:nth-child(${n}) input:checked)`;

const css = `
  .radio-tap { display: grid; justify-items: center; gap: 14px; width: 260px; }
  .radio-tap__sink { display: block; width: 200px; height: 124px; overflow: visible; }
  .radio-tap__metal { fill: light-dark(#6d7179, #7d8087); }
  .radio-tap__wall { fill: light-dark(#dbdde1, #2e3035); }
  .radio-tap__basin { fill: light-dark(#ebedf0, #232529); }
  .radio-tap__water { fill: light-dark(#50535b, #c6c8cd); stroke: light-dark(#50535b, #c6c8cd); }
  .radio-tap__shine { fill: none; stroke: light-dark(#373a40, #f1f2f3); }
  .radio-tap__ring { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.2; transform-box: fill-box; transform-origin: center; opacity: 0; }
  /* The handle turns further for each setting. */
  .radio-tap__lever { transform-box: view-box; transform-origin: 56px 9px; transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1); }
  ${at(2)} .radio-tap__lever { transform: rotate(-28deg); }
  ${at(3)} .radio-tap__lever { transform: rotate(-60deg); }
  .radio-tap__flow { opacity: 0; transition: opacity 0.3s; }
  ${at(1)} .radio-tap__flow--drip, ${at(2)} .radio-tap__flow--trickle, ${at(3)} .radio-tap__flow--full { opacity: 1; }
  /* Drip: a drop swells at the spout, lets go, falls, and rings the water where it lands. */
  .radio-tap__drop { transform-box: fill-box; transform-origin: 50% 0; animation: radio-tap-drop 1.4s infinite; }
  @keyframes radio-tap-drop {
    0% { transform: translateY(0) scale(0.2); animation-timing-function: ease-out; }
    40% { transform: translateY(0) scale(1); animation-timing-function: cubic-bezier(0.5, 0, 1, 0.6); }
    72% { transform: translateY(58px) scale(0.9, 1.15); opacity: 1; }
    73%, 100% { transform: translateY(58px); opacity: 0; }
  }
  .radio-tap__flow--drip .radio-tap__ring { animation: radio-tap-ring 1.4s ease-out infinite; }
  @keyframes radio-tap-ring {
    0%, 72% { opacity: 0; transform: scale(0.2); }
    74% { opacity: 1; }
    100% { opacity: 0; transform: scale(1.4); }
  }
  /* Trickle and full: the stream's dashes run downward, and the surface keeps rippling. */
  .radio-tap__stream { fill: none; stroke-linecap: round; animation: radio-tap-run 0.35s linear infinite; }
  @keyframes radio-tap-run {
    to { stroke-dashoffset: -18; }
  }
  .radio-tap__flow--trickle .radio-tap__ring { animation: radio-tap-ripple 0.9s ease-out infinite; }
  .radio-tap__flow--full .radio-tap__ring { animation: radio-tap-ripple 0.6s ease-out infinite; }
  .radio-tap__flow--full .radio-tap__ring + .radio-tap__ring { animation-delay: 0.3s; }
  @keyframes radio-tap-ripple {
    from { opacity: 0.9; transform: scale(0.3); }
    to { opacity: 0; transform: scale(1.3); }
  }
  .radio-tap__splash { fill: light-dark(#50535b, #c6c8cd); animation: radio-tap-splash 0.5s ease-out infinite; }
  .radio-tap__splash:nth-of-type(2) { --dx: 12px; animation-delay: 0.12s; }
  .radio-tap__splash:nth-of-type(3) { --dx: -10px; animation-delay: 0.24s; }
  .radio-tap__splash:nth-of-type(4) { --dx: 16px; animation-delay: 0.36s; }
  @keyframes radio-tap-splash {
    from { transform: translate(0, 0); opacity: 1; }
    50% { transform: translate(calc(var(--dx, -14px) * 0.6), -10px); }
    to { transform: translate(var(--dx, -14px), 2px); opacity: 0; }
  }
  .radio-tap__read { display: grid; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .radio-tap__read > * { grid-area: 1 / 1; text-align: center; opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.3s; }
  ${at(1)} .radio-tap__read > :nth-child(1), ${at(2)} .radio-tap__read > :nth-child(2), ${at(3)} .radio-tap__read > :nth-child(3) { opacity: 1; transform: none; }
  .radio-tap__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-tap__opt { position: relative; flex: 1; padding: 7px 12px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-tap__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-tap__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-tap__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-tap__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) {
    .radio-tap * { animation: none !important; transition: none !important; }
    .radio-tap__ring { opacity: 0.6; }
  }
`;

export function TapRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-tap">
        <svg className="radio-tap__sink" viewBox="0 0 200 124" aria-hidden="true">
          <rect className="radio-tap__wall" x={8} y={10} width={14} height={30} rx={3} />
          <ellipse className="radio-tap__basin" cx={99} cy={112} rx={64} ry={7} />
          <g className="radio-tap__flow radio-tap__flow--drip">
            <path className="radio-tap__drop radio-tap__water" d="M99 42C102.5 47 104 50 104 52.5A5 5 0 0 1 94 52.5C94 50 95.5 47 99 42Z" />
            <ellipse className="radio-tap__ring" cx={99} cy={111} rx={14} ry={2.5} />
          </g>
          <g className="radio-tap__flow radio-tap__flow--trickle">
            <path className="radio-tap__stream radio-tap__water" d="M99 42C100 62 98 84 99 109" strokeWidth={2.2} strokeDasharray="12 6" />
            <ellipse className="radio-tap__ring" cx={99} cy={111} rx={16} ry={3} />
          </g>
          <g className="radio-tap__flow radio-tap__flow--full">
            <path className="radio-tap__water" d="M94 42H104C105 64 106 88 107 109H91C92 88 93 64 94 42Z" />
            <path className="radio-tap__stream radio-tap__shine" d="M97 46C97.5 66 97 88 96.5 106" strokeWidth={1.5} strokeDasharray="9 9" />
            <circle className="radio-tap__splash" cx={99} cy={108} r={2} />
            <circle className="radio-tap__splash" cx={99} cy={108} r={1.6} />
            <circle className="radio-tap__splash" cx={99} cy={108} r={1.8} />
            <circle className="radio-tap__splash" cx={99} cy={108} r={1.4} />
            <ellipse className="radio-tap__ring" cx={99} cy={111} rx={22} ry={4} />
            <ellipse className="radio-tap__ring" cx={99} cy={111} rx={22} ry={4} />
          </g>
          <path className="radio-tap__metal" d="M22 17H92Q104 17 104 29V42H94V31Q94 28 91 28H22Z" />
          <rect className="radio-tap__metal" x={54} y={9} width={4} height={9} />
          <rect className="radio-tap__metal radio-tap__lever" x={40} y={5} width={32} height={5} rx={2.5} />
        </svg>
        <span className="radio-tap__read" aria-hidden="true">
          {OPTIONS.map((o) => (
            <span key={o.value}>{o.note}</span>
          ))}
        </span>
        <div className="radio-tap__opts" role="radiogroup" aria-label="Water flow">
          {OPTIONS.map((o, i) => (
            <label key={o.value} className="radio-tap__opt">
              <input className="radio-tap__input" type="radio" name={name} value={o.value} defaultChecked={i === 0} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
