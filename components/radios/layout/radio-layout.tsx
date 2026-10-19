"use client";

import { useId, type CSSProperties } from 'react';

const css = `
  .radio-layout {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .radio-layout__preview {
    position: relative;
    width: 160px;
    height: 110px;
  }

  /* Tiles move one after another, each on a spring. */
  .radio-layout__tile {
    position: absolute;
    top: 0;
    left: 0;
    width: 76px;
    height: 51px;
    border-radius: 7px;
    background: #3a3a3a;
    transition-property: top, left, width, height;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.3, 1.25, 0.5, 1);
    transition-delay: calc(var(--radio-layout-i) * 50ms);
  }

  .radio-layout__tile:first-child {
    background: #7c7c7c;
  }

  .radio-layout__row {
    display: flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background: #202020;
  }

  .radio-layout__option {
    position: relative;
    display: grid;
    place-items: center;
    width: 36px;
    height: 30px;
    border-radius: 7px;
    color: #7c7c7c;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  .radio-layout__option:hover {
    color: #c9c9c9;
  }

  .radio-layout__option:has(.radio-layout__input:checked) {
    background: #ededed;
    color: #111111;
  }

  .radio-layout__option:has(.radio-layout__input:focus-visible) {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .radio-layout__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-layout__icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  /* Where every tile sits in each layout (a 160 x 110 preview). */
  .radio-layout:has(.radio-layout__input[value='grid']:checked) .radio-layout__tile:nth-child(1) {
    top: 0px;
    left: 0px;
    width: 76px;
    height: 51px;
  }

  .radio-layout:has(.radio-layout__input[value='grid']:checked) .radio-layout__tile:nth-child(2) {
    top: 0px;
    left: 84px;
    width: 76px;
    height: 51px;
  }

  .radio-layout:has(.radio-layout__input[value='grid']:checked) .radio-layout__tile:nth-child(3) {
    top: 59px;
    left: 0px;
    width: 76px;
    height: 51px;
  }

  .radio-layout:has(.radio-layout__input[value='grid']:checked) .radio-layout__tile:nth-child(4) {
    top: 59px;
    left: 84px;
    width: 76px;
    height: 51px;
  }

  .radio-layout:has(.radio-layout__input[value='list']:checked) .radio-layout__tile:nth-child(1) {
    top: 0px;
    left: 0px;
    width: 160px;
    height: 22px;
  }

  .radio-layout:has(.radio-layout__input[value='list']:checked) .radio-layout__tile:nth-child(2) {
    top: 29px;
    left: 0px;
    width: 160px;
    height: 22px;
  }

  .radio-layout:has(.radio-layout__input[value='list']:checked) .radio-layout__tile:nth-child(3) {
    top: 58px;
    left: 0px;
    width: 160px;
    height: 22px;
  }

  .radio-layout:has(.radio-layout__input[value='list']:checked) .radio-layout__tile:nth-child(4) {
    top: 87px;
    left: 0px;
    width: 160px;
    height: 22px;
  }

  .radio-layout:has(.radio-layout__input[value='feature']:checked) .radio-layout__tile:nth-child(1) {
    top: 0px;
    left: 0px;
    width: 160px;
    height: 64px;
  }

  .radio-layout:has(.radio-layout__input[value='feature']:checked) .radio-layout__tile:nth-child(2) {
    top: 72px;
    left: 0px;
    width: 49px;
    height: 38px;
  }

  .radio-layout:has(.radio-layout__input[value='feature']:checked) .radio-layout__tile:nth-child(3) {
    top: 72px;
    left: 55.5px;
    width: 49px;
    height: 38px;
  }

  .radio-layout:has(.radio-layout__input[value='feature']:checked) .radio-layout__tile:nth-child(4) {
    top: 72px;
    left: 111px;
    width: 49px;
    height: 38px;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-layout__tile {
      transition: none;
    }
  }
`;

export function LayoutRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-layout">
        <div className="radio-layout__preview" aria-hidden="true">
          <span className="radio-layout__tile" style={{ '--radio-layout-i': 0 } as CSSProperties} />
          <span className="radio-layout__tile" style={{ '--radio-layout-i': 1 } as CSSProperties} />
          <span className="radio-layout__tile" style={{ '--radio-layout-i': 2 } as CSSProperties} />
          <span className="radio-layout__tile" style={{ '--radio-layout-i': 3 } as CSSProperties} />
        </div>
        <div className="radio-layout__row" role="radiogroup" aria-label="Layout">
          <label className="radio-layout__option">
            <input className="radio-layout__input" type="radio" name={name} value="grid" aria-label="Grid" defaultChecked />
            <svg className="radio-layout__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
          </label>
          <label className="radio-layout__option">
            <input className="radio-layout__input" type="radio" name={name} value="list" aria-label="List" />
            <svg className="radio-layout__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="4" rx="1.5" /><rect x="3" y="10" width="18" height="4" rx="1.5" /><rect x="3" y="16" width="18" height="4" rx="1.5" /></svg>
          </label>
          <label className="radio-layout__option">
            <input className="radio-layout__input" type="radio" name={name} value="feature" aria-label="Feature" />
            <svg className="radio-layout__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="10" rx="1.5" /><rect x="3" y="16" width="5" height="5" rx="1" /><rect x="9.5" y="16" width="5" height="5" rx="1" /><rect x="16" y="16" width="5" height="5" rx="1" /></svg>
          </label>
        </div>
      </div>
    </>
  );
}
