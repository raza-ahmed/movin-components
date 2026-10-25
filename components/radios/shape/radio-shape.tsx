"use client";

import { useId } from 'react';

const css = `
  .radio-shape {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }

  /* Every shape has the same 20 points in the same order, so clip-path can
     tween between any two of them. */
  .radio-shape__preview {
    display: block;
    width: 84px;
    height: 84px;
    background: linear-gradient(150deg, light-dark(#373a40, #f1f2f3), light-dark(#6d7179, #7d8087));
    transition: clip-path 0.6s cubic-bezier(0.3, 1.3, 0.5, 1);
  }

  .radio-shape__row {
    display: flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
  }

  .radio-shape__option {
    position: relative;
    cursor: pointer;
  }

  .radio-shape__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-shape__option {
    display: grid;
    place-items: center;
    width: 36px;
    height: 30px;
    border-radius: 7px;
    color: light-dark(#6d7179, #7d8087);
    transition: background-color 0.2s, color 0.2s;
  }

  .radio-shape__option:hover {
    color: light-dark(#50535b, #c6c8cd);
  }

  .radio-shape__option:has(.radio-shape__input:checked) {
    background: light-dark(#42454c, #e5e6e9);
    color: light-dark(#fbfcfd, #121417);
  }

  .radio-shape__option:has(.radio-shape__input:focus-visible) {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  .radio-shape__icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  /* The four outlines. */
  .radio-shape:has(.radio-shape__input[value='circle']:checked) .radio-shape__preview {
    clip-path: polygon(50.0% 0.0%, 65.5% 2.4%, 79.4% 9.5%, 90.5% 20.6%, 97.6% 34.5%, 100.0% 50.0%, 97.6% 65.5%, 90.5% 79.4%, 79.4% 90.5%, 65.5% 97.6%, 50.0% 100.0%, 34.5% 97.6%, 20.6% 90.5%, 9.5% 79.4%, 2.4% 65.5%, 0.0% 50.0%, 2.4% 34.5%, 9.5% 20.6%, 20.6% 9.5%, 34.5% 2.4%);
  }

  .radio-shape:has(.radio-shape__input[value='square']:checked) .radio-shape__preview {
    clip-path: polygon(50.0% 3.0%, 68.8% 3.0%, 87.6% 3.0%, 97.0% 12.4%, 97.0% 31.2%, 97.0% 50.0%, 97.0% 68.8%, 97.0% 87.6%, 87.6% 97.0%, 68.8% 97.0%, 50.0% 97.0%, 31.2% 97.0%, 12.4% 97.0%, 3.0% 87.6%, 3.0% 68.8%, 3.0% 50.0%, 3.0% 31.2%, 3.0% 12.4%, 12.4% 3.0%, 31.2% 3.0%);
  }

  .radio-shape:has(.radio-shape__input[value='triangle']:checked) .radio-shape__preview {
    clip-path: polygon(50.0% 4.0%, 57.1% 16.8%, 64.3% 29.6%, 71.4% 42.4%, 78.6% 55.2%, 85.7% 68.0%, 92.8% 80.7%, 93.9% 90.0%, 79.3% 90.0%, 64.6% 90.0%, 50.0% 90.0%, 35.4% 90.0%, 20.7% 90.0%, 6.1% 90.0%, 7.2% 80.7%, 14.3% 68.0%, 21.4% 55.2%, 28.6% 42.4%, 35.7% 29.6%, 42.9% 16.8%);
  }

  .radio-shape:has(.radio-shape__input[value='star']:checked) .radio-shape__preview {
    clip-path: polygon(50.0% 4.0%, 56.2% 20.5%, 62.3% 37.0%, 79.9% 37.8%, 97.6% 38.5%, 83.8% 49.5%, 70.0% 60.5%, 74.7% 77.5%, 79.4% 94.5%, 64.7% 84.7%, 50.0% 75.0%, 35.3% 84.7%, 20.6% 94.5%, 25.3% 77.5%, 30.0% 60.5%, 16.2% 49.5%, 2.4% 38.5%, 20.1% 37.8%, 37.7% 37.0%, 43.8% 20.5%);
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-shape__preview {
      transition: none;
    }
  }
`;

export function ShapeRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-shape">
        <span className="radio-shape__preview" aria-hidden="true" />
        <div className="radio-shape__row" role="radiogroup" aria-label="Shape">
          <label className="radio-shape__option">
            <input className="radio-shape__input" type="radio" name={name} value="circle" aria-label="Circle" defaultChecked />
            <svg className="radio-shape__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /></svg>
          </label>
          <label className="radio-shape__option">
            <input className="radio-shape__input" type="radio" name={name} value="square" aria-label="Square" />
            <svg className="radio-shape__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="4.5" width="15" height="15" rx="1" /></svg>
          </label>
          <label className="radio-shape__option">
            <input className="radio-shape__input" type="radio" name={name} value="triangle" aria-label="Triangle" />
            <svg className="radio-shape__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5 20 19H4Z" /></svg>
          </label>
          <label className="radio-shape__option">
            <input className="radio-shape__input" type="radio" name={name} value="star" aria-label="Star" />
            <svg className="radio-shape__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.5 5.2 5.6.7-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.7Z" /></svg>
          </label>
        </div>
      </div>
    </>
  );
}
