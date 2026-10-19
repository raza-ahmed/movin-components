"use client";

import { useId } from 'react';

const css = `
  .radio-sizes {
    --radio-sizes-s: 0.8;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .radio-sizes__stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    height: 104px;
  }

  /* Drawn at XL and scaled down from its hem, with a springy settle. */
  .radio-sizes__shirt {
    width: 80px;
    height: 72px;
    fill: #3a3a3a;
    stroke: #a7a7a7;
    stroke-width: 1.5;
    stroke-linejoin: round;
    transform: scale(var(--radio-sizes-s));
    transform-origin: 50% 100%;
    transition: transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1);
  }

  .radio-sizes__measure {
    color: #7c7c7c;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .radio-sizes__row {
    display: flex;
    gap: 6px;
  }

  .radio-sizes__option {
    position: relative;
    cursor: pointer;
  }

  .radio-sizes__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-sizes__pill {
    display: grid;
    place-items: center;
    min-width: 40px;
    height: 34px;
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid #3a3a3a;
    border-radius: 9px;
    background: #202020;
    color: #a7a7a7;
    font-size: 13px;
    font-weight: 600;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
  }

  .radio-sizes__option:hover .radio-sizes__pill {
    border-color: #7c7c7c;
  }

  .radio-sizes__option:active .radio-sizes__pill {
    transform: scale(0.94);
  }

  .radio-sizes__input:checked + .radio-sizes__pill {
    border-color: #ededed;
    background: #ededed;
    color: #111111;
  }

  .radio-sizes__input:focus-visible + .radio-sizes__pill {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  /* What each size means. */
  .radio-sizes:has(.radio-sizes__option:nth-child(1) .radio-sizes__input:checked) {
    --radio-sizes-s: 0.7;
  }

  .radio-sizes:has(.radio-sizes__option:nth-child(1) .radio-sizes__input:checked) .radio-sizes__measure::after {
    content: 'Chest 46 cm';
  }

  .radio-sizes:has(.radio-sizes__option:nth-child(2) .radio-sizes__input:checked) {
    --radio-sizes-s: 0.8;
  }

  .radio-sizes:has(.radio-sizes__option:nth-child(2) .radio-sizes__input:checked) .radio-sizes__measure::after {
    content: 'Chest 50 cm';
  }

  .radio-sizes:has(.radio-sizes__option:nth-child(3) .radio-sizes__input:checked) {
    --radio-sizes-s: 0.9;
  }

  .radio-sizes:has(.radio-sizes__option:nth-child(3) .radio-sizes__input:checked) .radio-sizes__measure::after {
    content: 'Chest 54 cm';
  }

  .radio-sizes:has(.radio-sizes__option:nth-child(4) .radio-sizes__input:checked) {
    --radio-sizes-s: 1;
  }

  .radio-sizes:has(.radio-sizes__option:nth-child(4) .radio-sizes__input:checked) .radio-sizes__measure::after {
    content: 'Chest 58 cm';
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-sizes__shirt,
    .radio-sizes__pill {
      transition: none;
    }
  }
`;

export function SizesRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-sizes">
        <div className="radio-sizes__stage" aria-hidden="true">
          <svg className="radio-sizes__shirt" viewBox="0 0 80 72"><path d="M28 4c3 5 7 7 12 7s9-2 12-7l18 8 8 18-14 5v35H16V35L2 30l8-18Z" /></svg>
          <span className="radio-sizes__measure" />
        </div>
        <div className="radio-sizes__row" role="radiogroup" aria-label="Size">
          <label className="radio-sizes__option">
            <input className="radio-sizes__input" type="radio" name={name} value="S" />
            <span className="radio-sizes__pill">S</span>
          </label>
          <label className="radio-sizes__option">
            <input className="radio-sizes__input" type="radio" name={name} value="M" defaultChecked />
            <span className="radio-sizes__pill">M</span>
          </label>
          <label className="radio-sizes__option">
            <input className="radio-sizes__input" type="radio" name={name} value="L" />
            <span className="radio-sizes__pill">L</span>
          </label>
          <label className="radio-sizes__option">
            <input className="radio-sizes__input" type="radio" name={name} value="XL" />
            <span className="radio-sizes__pill">XL</span>
          </label>
        </div>
      </div>
    </>
  );
}
