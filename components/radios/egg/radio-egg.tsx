"use client";

import { useId } from 'react';

const OPTIONS = [
  { value: 'soft', label: 'Soft', note: '6 min, runny yolk' },
  { value: 'jammy', label: 'Jammy', note: '8 min, set at the edge' },
  { value: 'hard', label: 'Hard', note: '10 min, firm all through' },
];
const at = (n: number) => `.radio-egg:has(.radio-egg__opt:nth-child(${n}) input:checked)`;

const css = `
  .radio-egg { display: grid; justify-items: center; gap: 14px; width: 260px; }
  .radio-egg__plate svg { display: block; width: 200px; height: 112px; overflow: visible; }
  .radio-egg__dish { fill: light-dark(#ebedf0, #232529); }
  .radio-egg__white { fill: light-dark(#42454c, #e5e6e9); }
  .radio-egg__yolk, .radio-egg__core, .radio-egg__gloss { transform-box: fill-box; transform-origin: center; transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1), fill 0.5s, opacity 0.4s; }
  .radio-egg__yolk { fill: light-dark(#6d7179, #7d8087); stroke: light-dark(#cbced3, #393c41); stroke-width: 0; stroke-dasharray: 2 2.5; }
  .radio-egg__core { fill: light-dark(#6d7179, #7d8087); opacity: 0; }
  .radio-egg__gloss { fill: light-dark(#50535b, #c6c8cd); opacity: 0.8; }
  .radio-egg__drip { fill: light-dark(#6d7179, #7d8087); transform-box: fill-box; transform-origin: 50% 0; transform: scaleY(0); transition: transform 0.25s; }
  /* Soft: a big glossy yolk that runs. Jammy: set round the edge, soft in the middle. Hard: smaller, pale and crumbly. */
  ${at(1)} .radio-egg__yolk { transform: scale(1.12); }
  ${at(1)} .radio-egg__drip { transform: none; transition: transform 1.1s cubic-bezier(0.4, 0, 0.5, 1) 0.25s; }
  ${at(2)} .radio-egg__yolk { fill: light-dark(#5f626a, #a7abb2); }
  ${at(2)} .radio-egg__core { opacity: 1; transform: scale(0.62); }
  ${at(2)} .radio-egg__gloss { opacity: 0.35; transform: scale(0.6); }
  ${at(3)} .radio-egg__yolk { fill: light-dark(#50535b, #c6c8cd); stroke-width: 2; transform: scale(0.86); }
  ${at(3)} .radio-egg__gloss { opacity: 0; transform: scale(0.3); }
  .radio-egg__read { display: grid; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .radio-egg__read > * { grid-area: 1 / 1; text-align: center; opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.3s; }
  ${at(1)} .radio-egg__read > :nth-child(1), ${at(2)} .radio-egg__read > :nth-child(2), ${at(3)} .radio-egg__read > :nth-child(3) { opacity: 1; transform: none; }
  .radio-egg__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-egg__opt { position: relative; flex: 1; padding: 7px 12px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-egg__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-egg__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-egg__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-egg__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) {
    .radio-egg * { transition: none !important; }
  }
`;

export function EggRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-egg">
        <div className="radio-egg__plate" aria-hidden="true">
          <svg viewBox="0 0 200 112">
            <ellipse className="radio-egg__dish" cx={100} cy={70} rx={92} ry={38} />
            <path className="radio-egg__white" d="M100 22C134 22 156 40 156 60C156 82 130 96 100 96C70 96 44 82 44 60C44 40 66 22 100 22Z" />
            <path className="radio-egg__drip" d="M95 74C96 84 102 90 108 96C111 99 113 104 116 105C120 106 121 101 118 97C113 90 110 82 109 74Z" />
            <circle className="radio-egg__yolk" cx={100} cy={60} r={21} />
            <circle className="radio-egg__core" cx={100} cy={60} r={21} />
            <ellipse className="radio-egg__gloss" cx={93} cy={53} rx={6} ry={4} />
          </svg>
        </div>
        <span className="radio-egg__read" aria-hidden="true">
          {OPTIONS.map((o) => (
            <span key={o.value}>{o.note}</span>
          ))}
        </span>
        <div className="radio-egg__opts" role="radiogroup" aria-label="Boiled egg">
          {OPTIONS.map((o, i) => (
            <label key={o.value} className="radio-egg__opt">
              <input className="radio-egg__input" type="radio" name={name} value={o.value} defaultChecked={i === 0} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
