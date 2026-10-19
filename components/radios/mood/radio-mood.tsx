"use client";

import { useId } from 'react';

const css = `
  .radio-mood {
    display: inline-flex;
    gap: 6px;
    padding-bottom: 20px;
  }

  .radio-mood__option {
    position: relative;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
  }

  .radio-mood__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-mood__option:has(.radio-mood__input:focus-visible) {
    outline: 2px solid #a7a7a7;
  }

  .radio-mood__face {
    width: 34px;
    height: 34px;
    overflow: visible;
    transition: transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1);
  }

  .radio-mood__head {
    fill: #202020;
    stroke: #4d4d4d;
    stroke-width: 1.5;
    transition: fill 0.25s, stroke 0.25s;
  }

  .radio-mood__eye {
    fill: #7c7c7c;
    transition: fill 0.25s;
  }

  .radio-mood__mouth {
    fill: none;
    stroke: #7c7c7c;
    stroke-width: 1.8;
    stroke-linecap: round;
    transform-box: fill-box;
    transform-origin: center;
    transition: stroke 0.25s;
  }

  .radio-mood__option:hover .radio-mood__face {
    transform: scale(1.08);
  }

  .radio-mood__option:hover .radio-mood__head {
    stroke: #7c7c7c;
  }

  /* Chosen: bigger, lit, features dark, and the mouth bounces once. */
  .radio-mood__option:has(.radio-mood__input:checked) .radio-mood__face {
    transform: scale(1.25);
  }

  .radio-mood__option:has(.radio-mood__input:checked) .radio-mood__head {
    fill: #ededed;
    stroke: #ededed;
  }

  .radio-mood__option:has(.radio-mood__input:checked) .radio-mood__eye {
    fill: #111111;
  }

  .radio-mood__option:has(.radio-mood__input:checked) .radio-mood__mouth {
    stroke: #111111;
    animation: radio-mood-bounce 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) 0.1s;
  }

  @keyframes radio-mood-bounce {
    0% {
      transform: scale(0.6, 1.6);
    }
    100% {
      transform: none;
    }
  }

  .radio-mood__name {
    position: absolute;
    top: 100%;
    left: 50%;
    margin-top: 4px;
    color: #ededed;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transform: translate(-50%, -4px);
    transition: opacity 0.2s, transform 0.3s;
  }

  .radio-mood__option:has(.radio-mood__input:checked) .radio-mood__name {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-mood__face,
    .radio-mood__name {
      transition: none;
    }
    .radio-mood__option:has(.radio-mood__input:checked) .radio-mood__mouth {
      animation: none;
    }
  }
`;

export function MoodRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-mood" role="radiogroup" aria-label="How was it?">
        <label className="radio-mood__option">
          <input className="radio-mood__input" type="radio" name={name} value="Awful" />
          <svg className="radio-mood__face" viewBox="0 0 32 32" aria-hidden="true"><circle className="radio-mood__head" cx="16" cy="16" r="14" /><circle className="radio-mood__eye" cx="11.5" cy="13" r="1.6" /><circle className="radio-mood__eye" cx="20.5" cy="13" r="1.6" /><path className="radio-mood__mouth" d="M10.5 21.5q5.5-5 11 0" /></svg>
          <span className="radio-mood__name">Awful</span>
        </label>
        <label className="radio-mood__option">
          <input className="radio-mood__input" type="radio" name={name} value="Bad" />
          <svg className="radio-mood__face" viewBox="0 0 32 32" aria-hidden="true"><circle className="radio-mood__head" cx="16" cy="16" r="14" /><circle className="radio-mood__eye" cx="11.5" cy="13" r="1.6" /><circle className="radio-mood__eye" cx="20.5" cy="13" r="1.6" /><path className="radio-mood__mouth" d="M10.5 20.5q5.5-2.5 11 0" /></svg>
          <span className="radio-mood__name">Bad</span>
        </label>
        <label className="radio-mood__option">
          <input className="radio-mood__input" type="radio" name={name} value="Okay" />
          <svg className="radio-mood__face" viewBox="0 0 32 32" aria-hidden="true"><circle className="radio-mood__head" cx="16" cy="16" r="14" /><circle className="radio-mood__eye" cx="11.5" cy="13" r="1.6" /><circle className="radio-mood__eye" cx="20.5" cy="13" r="1.6" /><path className="radio-mood__mouth" d="M11 20h10" /></svg>
          <span className="radio-mood__name">Okay</span>
        </label>
        <label className="radio-mood__option">
          <input className="radio-mood__input" type="radio" name={name} value="Good" defaultChecked />
          <svg className="radio-mood__face" viewBox="0 0 32 32" aria-hidden="true"><circle className="radio-mood__head" cx="16" cy="16" r="14" /><circle className="radio-mood__eye" cx="11.5" cy="13" r="1.6" /><circle className="radio-mood__eye" cx="20.5" cy="13" r="1.6" /><path className="radio-mood__mouth" d="M10.5 19q5.5 3 11 0" /></svg>
          <span className="radio-mood__name">Good</span>
        </label>
        <label className="radio-mood__option">
          <input className="radio-mood__input" type="radio" name={name} value="Great" />
          <svg className="radio-mood__face" viewBox="0 0 32 32" aria-hidden="true"><circle className="radio-mood__head" cx="16" cy="16" r="14" /><circle className="radio-mood__eye" cx="11.5" cy="13" r="1.6" /><circle className="radio-mood__eye" cx="20.5" cy="13" r="1.6" /><path className="radio-mood__mouth" d="M10 18.5q6 6.5 12 0" /></svg>
          <span className="radio-mood__name">Great</span>
        </label>
      </div>
    </>
  );
}
