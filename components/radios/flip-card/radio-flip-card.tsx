"use client";

import { useId } from 'react';

const css = `
  .radio-flip-card {
    display: inline-flex;
    gap: 8px;
  }

  .radio-flip-card__option {
    position: relative;
    display: block;
    width: 86px;
    height: 108px;
    perspective: 500px;
    cursor: pointer;
  }

  .radio-flip-card__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-flip-card__sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .radio-flip-card__card {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.3, 1.3, 0.5, 1);
  }

  .radio-flip-card__face {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 2px;
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid #3a3a3a;
    border-radius: 12px;
    background: #202020;
    backface-visibility: hidden;
  }

  .radio-flip-card__face--back {
    justify-content: space-between;
    border-color: #ededed;
    background: #ededed;
    color: #111111;
    transform: rotateY(180deg);
  }

  .radio-flip-card__face--back svg {
    width: 22px;
    height: 22px;
    padding: 3px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #111111;
    fill: none;
    stroke: #ededed;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .radio-flip-card__name {
    color: #ededed;
    font-size: 14px;
    font-weight: 600;
  }

  .radio-flip-card__price {
    color: #7c7c7c;
    font-size: 12px;
  }

  .radio-flip-card__face--back .radio-flip-card__name {
    color: #111111;
    margin-top: auto;
  }

  .radio-flip-card__face--back .radio-flip-card__price {
    color: #4d4d4d;
  }

  .radio-flip-card__option:hover .radio-flip-card__face--front {
    border-color: #7c7c7c;
  }

  .radio-flip-card__option:has(.radio-flip-card__input:checked) .radio-flip-card__card {
    transform: rotateY(180deg);
  }

  .radio-flip-card__option:has(.radio-flip-card__input:focus-visible) .radio-flip-card__face {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-flip-card__card {
      transition: none;
    }
  }
`;

export function FlipCardRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-flip-card" role="radiogroup" aria-label="Plan">
        <label className="radio-flip-card__option">
          <input className="radio-flip-card__input" type="radio" name={name} value="Starter" />
          <span className="radio-flip-card__card" aria-hidden="true">
            <span className="radio-flip-card__face radio-flip-card__face--front"><span className="radio-flip-card__name">Starter</span><span className="radio-flip-card__price">Free</span></span>
            <span className="radio-flip-card__face radio-flip-card__face--back"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.5 3.5 6.5-8" /></svg><span className="radio-flip-card__name">Starter</span><span className="radio-flip-card__price">Free · Selected</span></span>
          </span>
          <span className="radio-flip-card__sr">Starter, Free</span>
        </label>
        <label className="radio-flip-card__option">
          <input className="radio-flip-card__input" type="radio" name={name} value="Pro" defaultChecked />
          <span className="radio-flip-card__card" aria-hidden="true">
            <span className="radio-flip-card__face radio-flip-card__face--front"><span className="radio-flip-card__name">Pro</span><span className="radio-flip-card__price">$12</span></span>
            <span className="radio-flip-card__face radio-flip-card__face--back"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.5 3.5 6.5-8" /></svg><span className="radio-flip-card__name">Pro</span><span className="radio-flip-card__price">$12 · Selected</span></span>
          </span>
          <span className="radio-flip-card__sr">Pro, $12</span>
        </label>
        <label className="radio-flip-card__option">
          <input className="radio-flip-card__input" type="radio" name={name} value="Team" />
          <span className="radio-flip-card__card" aria-hidden="true">
            <span className="radio-flip-card__face radio-flip-card__face--front"><span className="radio-flip-card__name">Team</span><span className="radio-flip-card__price">$29</span></span>
            <span className="radio-flip-card__face radio-flip-card__face--back"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.5 3.5 6.5-8" /></svg><span className="radio-flip-card__name">Team</span><span className="radio-flip-card__price">$29 · Selected</span></span>
          </span>
          <span className="radio-flip-card__sr">Team, $29</span>
        </label>
      </div>
    </>
  );
}
