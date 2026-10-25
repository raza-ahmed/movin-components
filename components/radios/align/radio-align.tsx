"use client";

import { useId, type CSSProperties } from 'react';

const css = `
  /* --k is how far across each line sits (0 left, 0.5 centre, 1 right); --j
     switches justify on, which stretches every line but the last. */
  .radio-align {
    --radio-align-k: 0;
    --radio-align-j: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }

  .radio-align:has(.radio-align__input[value='center']:checked) {
    --radio-align-k: 0.5;
  }

  .radio-align:has(.radio-align__input[value='right']:checked) {
    --radio-align-k: 1;
  }

  .radio-align:has(.radio-align__input[value='justify']:checked) {
    --radio-align-j: 1;
  }

  .radio-align__text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 140px;
    box-sizing: content-box; /* the lines are measured against a 140px CONTENT box */
    padding: 14px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
  }

  .radio-align__line {
    display: block;
    width: calc(var(--radio-align-w) * 1px);
    height: 6px;
    border-radius: 3px;
    background: light-dark(#6d7179, #7d8087);
    transform-origin: 0 50%;
    transform: translateX(calc((140px - var(--radio-align-w) * 1px) * var(--radio-align-k))) scaleX(calc(1 + (140 / var(--radio-align-w) - 1) * var(--radio-align-j)));
    transition: transform 0.45s cubic-bezier(0.3, 1.2, 0.5, 1);
    transition-delay: calc(var(--radio-align-i) * 35ms);
  }

  .radio-align__line:first-child {
    background: light-dark(#42454c, #e5e6e9);
  }

  /* A justified paragraph leaves its last line alone. */
  .radio-align__line:last-child {
    transform: translateX(calc((140px - var(--radio-align-w) * 1px) * var(--radio-align-k)));
  }

  .radio-align__row {
    display: flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
  }

  .radio-align__option {
    position: relative;
    display: grid;
    place-items: center;
    width: 34px;
    height: 30px;
    border-radius: 7px;
    color: light-dark(#6d7179, #7d8087);
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  .radio-align__option:hover {
    color: light-dark(#50535b, #c6c8cd);
  }

  .radio-align__option:has(.radio-align__input:checked) {
    background: light-dark(#42454c, #e5e6e9);
    color: light-dark(#fbfcfd, #121417);
  }

  .radio-align__option:has(.radio-align__input:focus-visible) {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  .radio-align__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-align__icon {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-align__line {
      transition: none;
    }
  }
`;

export function AlignRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-align">
        <div className="radio-align__text" aria-hidden="true">
          <span className="radio-align__line" style={{ '--radio-align-i': 0, '--radio-align-w': 140 } as CSSProperties} />
          <span className="radio-align__line" style={{ '--radio-align-i': 1, '--radio-align-w': 112 } as CSSProperties} />
          <span className="radio-align__line" style={{ '--radio-align-i': 2, '--radio-align-w': 128 } as CSSProperties} />
          <span className="radio-align__line" style={{ '--radio-align-i': 3, '--radio-align-w': 92 } as CSSProperties} />
          <span className="radio-align__line" style={{ '--radio-align-i': 4, '--radio-align-w': 56 } as CSSProperties} />
        </div>
        <div className="radio-align__row" role="radiogroup" aria-label="Text alignment">
          <label className="radio-align__option">
            <input className="radio-align__input" type="radio" name={name} value="left" aria-label="Align left" defaultChecked />
            <svg className="radio-align__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 10h10M4 14h16M4 18h8" /></svg>
          </label>
          <label className="radio-align__option">
            <input className="radio-align__input" type="radio" name={name} value="center" aria-label="Align centre" />
            <svg className="radio-align__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 10h10M4 14h16M8 18h8" /></svg>
          </label>
          <label className="radio-align__option">
            <input className="radio-align__input" type="radio" name={name} value="right" aria-label="Align right" />
            <svg className="radio-align__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M10 10h10M4 14h16M12 18h8" /></svg>
          </label>
          <label className="radio-align__option">
            <input className="radio-align__input" type="radio" name={name} value="justify" aria-label="Justify" />
            <svg className="radio-align__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 10h16M4 14h16M4 18h8" /></svg>
          </label>
        </div>
      </div>
    </>
  );
}
