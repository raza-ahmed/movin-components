"use client";

import { useId } from 'react';

const OPTIONS = [{"value": "a5", "label": "A5"}, {"value": "a4", "label": "A4"}, {"value": "a3", "label": "A3"}];

const css = `
  .radio-paper { --i: 1; display: grid; justify-items: center; gap: 12px; width: 260px; }
  .radio-paper:has(.radio-paper__opt:nth-child(1) input:checked) { --i: 0; }
  .radio-paper:has(.radio-paper__opt:nth-child(2) input:checked) { --i: 1; }
  .radio-paper:has(.radio-paper__opt:nth-child(3) input:checked) { --i: 2; }
  .radio-paper__desk { position: relative; width: 200px; height: 112px; }
  .radio-paper__ghost, .radio-paper__sheet { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); border-radius: 2px; }
  .radio-paper__ghost { border: 1px dashed light-dark(#cbced3, #393c41); }
  .radio-paper__sheet {
    width: var(--w);
    height: var(--h);
    padding: 8px 7px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087), 0 10px 18px -10px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    transition: width 0.55s cubic-bezier(0.3, 1.3, 0.5, 1), height 0.55s cubic-bezier(0.3, 1.3, 0.5, 1);
    overflow: hidden;
  }
  .radio-paper__sheet::before { content: ''; position: absolute; inset: 9px 7px; background: repeating-linear-gradient(light-dark(#6d7179, #7d8087) 0 1.5px, transparent 1.5px 6px); opacity: 0.6; }
  .radio-paper__sheet::after { content: ''; position: absolute; right: 0; top: 0; width: 9px; height: 9px; background: linear-gradient(225deg, light-dark(#f3f4f7, #1a1c1f) 50%, light-dark(#cbced3, #393c41) 50%); }
  .radio-paper:has(.radio-paper__opt:nth-child(1) input:checked) { --w: 37px; --h: 52px; }
  .radio-paper:has(.radio-paper__opt:nth-child(2) input:checked) { --w: 52px; --h: 74px; }
  .radio-paper:has(.radio-paper__opt:nth-child(3) input:checked) { --w: 74px; --h: 104px; }
  .radio-paper__read { display: grid; color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .radio-paper__read > * { grid-area: 1 / 1; text-align: center; opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.3s; }
  .radio-paper:has(.radio-paper__opt:nth-child(1) input:checked) .radio-paper__read > :nth-child(1) { opacity: 1; transform: none; }
  .radio-paper:has(.radio-paper__opt:nth-child(2) input:checked) .radio-paper__read > :nth-child(2) { opacity: 1; transform: none; }
  .radio-paper:has(.radio-paper__opt:nth-child(3) input:checked) .radio-paper__read > :nth-child(3) { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .radio-paper__sheet { transition: none; }
  }
  .radio-paper__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-paper__opt { position: relative; flex: 1; padding: 7px 10px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-paper__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-paper__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-paper__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-paper__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
`;

export function PaperRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-paper">
        <div className="radio-paper__desk" aria-hidden="true">
          <span className="radio-paper__ghost" style={{ width: 37, height: 52 }} />
          <span className="radio-paper__ghost" style={{ width: 52, height: 74 }} />
          <span className="radio-paper__ghost" style={{ width: 74, height: 104 }} />
          <span className="radio-paper__sheet" />
        </div>
        <span className="radio-paper__read" aria-hidden="true">
          <span>148 × 210 mm</span>
          <span>210 × 297 mm</span>
          <span>297 × 420 mm</span>
        </span>
        <div className="radio-paper__opts" role="radiogroup" aria-label="Paper size">
          {OPTIONS.map((o, i) => (
            <label key={o.value} className="radio-paper__opt">
              <input className="radio-paper__input" type="radio" name={name} value={o.value} defaultChecked={i === 1} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
