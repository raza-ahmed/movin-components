"use client";

import { useId } from 'react';

const css = `
  .radio-level { --radio-level-t: 0deg; --radio-level-b: 0px; display: grid; justify-items: center; gap: 22px; }
  .radio-level:has(.radio-level__input[value='left']:checked) { --radio-level-t: 3.5deg; --radio-level-b: -24px; }
  .radio-level:has(.radio-level__input[value='right']:checked) { --radio-level-t: -3.5deg; --radio-level-b: 24px; }
  .radio-level__body {
    position: relative;
    width: 176px;
    height: 30px;
    border-radius: 6px;
    background: linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#cbced3, #393c41));
    box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 4px 8px -4px color-mix(in oklab, light-dark(#fbfcfd, #121417) 70%, transparent);
    transform: rotate(var(--radio-level-t));
    transition: transform 0.5s cubic-bezier(0.3, 1.3, 0.5, 1);
  }
  .radio-level__body::before, .radio-level__body::after {
    content: '';
    position: absolute;
    top: 11px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: light-dark(#dbdde1, #2e3035);
    box-shadow: inset 0 1px 0 light-dark(#ebedf0, #232529);
  }
  .radio-level__body::before { left: 10px; }
  .radio-level__body::after { right: 10px; }
  .radio-level__vial {
    position: absolute;
    left: 50%;
    top: 8px;
    width: 84px;
    height: 14px;
    margin-left: -42px;
    overflow: hidden;
    border-radius: 7px;
    background: linear-gradient(light-dark(#ebedf0, #232529), light-dark(#dbdde1, #2e3035));
    box-shadow: inset 0 0 0 1px light-dark(#f3f4f7, #1a1c1f);
  }
  .radio-level__mark { position: absolute; top: 0; bottom: 0; width: 1.5px; background: light-dark(#5f626a, #a7abb2); }
  .radio-level__bubble {
    position: absolute;
    left: 50%;
    top: 3px;
    width: 22px;
    height: 8px;
    margin-left: -11px;
    border-radius: 4px;
    background: linear-gradient(light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
    box-shadow: 0 0 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent);
    transform: translateX(var(--radio-level-b));
    /* The bubble lags the tilt and overshoots, like it is floating in liquid. */
    transition: transform 1s cubic-bezier(0.25, 1.5, 0.4, 1) 0.08s;
  }
  .radio-level__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-level__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-level__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-level__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-level__opt:has(.radio-level__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-level__opt:has(.radio-level__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-level * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const SIDES = [
  { value: 'left', label: 'Left' },
  { value: 'centre', label: 'Centre' },
  { value: 'right', label: 'Right' },
];

export function LevelRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-level">
        <span className="radio-level__body" aria-hidden="true">
          <span className="radio-level__vial">
            <span className="radio-level__mark" style={{ left: 28 }} />
            <span className="radio-level__mark" style={{ right: 28 }} />
            <span className="radio-level__bubble" />
          </span>
        </span>
        <div className="radio-level__opts" role="radiogroup" aria-label="Balance">
          {SIDES.map((s) => (
            <label key={s.value} className="radio-level__opt">
              <input className="radio-level__input" type="radio" name={name} value={s.value} defaultChecked={s.value === 'centre'} />
              {s.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
