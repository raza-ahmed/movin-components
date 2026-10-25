"use client";

import { useEffect, useId, useRef } from 'react';

const css = `
  .radio-seat {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 11px;
  }

  /* The screen: a soft curved bar of light. */
  .radio-seat__screen {
    width: 140px;
    padding-top: 8px;
    border-top: 2px solid light-dark(#6d7179, #7d8087);
    border-radius: 50% 50% 0 0 / 10px 10px 0 0;
    color: light-dark(#6d7179, #7d8087);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-align: center;
    text-transform: uppercase;
  }

  .radio-seat__grid {
    display: grid;
    grid-template-columns: 26px 26px 10px 26px 26px;
    gap: 8px 6px;
  }

  /* The middle column is the aisle: the third seat of each row skips it. */
  .radio-seat__option:nth-child(4n + 3) {
    grid-column-start: 4;
  }

  .radio-seat__option {
    position: relative;
    display: block;
    cursor: pointer;
  }

  .radio-seat__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-seat__seat {
    position: relative;
    display: block;
    width: 26px;
    height: 22px;
    box-sizing: border-box;
    border: 1.5px solid light-dark(#cbced3, #393c41);
    border-radius: 8px 8px 4px 4px;
    background: light-dark(#ebedf0, #232529);
    transition: background-color 0.2s, border-color 0.2s, transform 0.35s cubic-bezier(0.3, 1.8, 0.5, 1);
  }

  /* The seat cushion. */
  .radio-seat__seat::after {
    content: '';
    position: absolute;
    right: 3px;
    bottom: 3px;
    left: 3px;
    height: 4px;
    border-radius: 2px;
    background: light-dark(#dbdde1, #2e3035);
    transition: background-color 0.2s;
  }

  .radio-seat__option:hover .radio-seat__input:not(:disabled) + .radio-seat__seat {
    border-color: light-dark(#5f626a, #a7abb2);
  }

  .radio-seat__input:checked + .radio-seat__seat {
    border-color: light-dark(#42454c, #e5e6e9);
    background: light-dark(#42454c, #e5e6e9);
    transform: translateY(-3px) scale(1.08);
  }

  .radio-seat__input:checked + .radio-seat__seat::after {
    background: light-dark(#5f626a, #a7abb2);
  }

  .radio-seat__input:focus-visible + .radio-seat__seat {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  /* Taken: dark and crossed out. */
  .radio-seat__option:has(.radio-seat__input:disabled) {
    cursor: not-allowed;
  }

  .radio-seat__input:disabled + .radio-seat__seat {
    border-color: light-dark(#ebedf0, #232529);
    background:
      linear-gradient(45deg, transparent 46%, light-dark(#cbced3, #393c41) 46% 54%, transparent 54%),
      linear-gradient(-45deg, transparent 46%, light-dark(#cbced3, #393c41) 46% 54%, transparent 54%),
      light-dark(#f3f4f7, #1a1c1f);
  }

  .radio-seat__input:disabled + .radio-seat__seat::after {
    display: none;
  }

  .radio-seat__ticket {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 6px 14px;
    border: 1px dashed light-dark(#cbced3, #393c41);
    border-radius: 8px;
  }

  .radio-seat__ticket-label {
    color: light-dark(#6d7179, #7d8087);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* The code rolls: the new one comes up from below as the old one leaves. */
  .radio-seat__code {
    position: relative;
    display: inline-block;
    min-width: 2.4em;
    height: 20px;
    overflow: hidden;
    color: light-dark(#373a40, #f1f2f3);
    font-size: 16px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    line-height: 20px;
  }

  .radio-seat__code > span {
    position: absolute;
    inset: 0;
  }

  .radio-seat__code-in {
    animation: radio-seat-in 0.35s cubic-bezier(0.3, 1.3, 0.5, 1);
  }

  .radio-seat__code-out {
    animation: radio-seat-out 0.25s ease-in forwards;
  }

  @keyframes radio-seat-in {
    from {
      transform: translateY(100%);
    }
  }

  @keyframes radio-seat-out {
    to {
      opacity: 0;
      transform: translateY(-100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-seat__seat {
      transition: none;
    }
    .radio-seat__code-in,
    .radio-seat__code-out {
      animation: none;
    }
  }
`;

export function SeatRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initSeat(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div className="radio-seat" ref={ref}>
        <span className="radio-seat__screen" aria-hidden="true">Screen</span>
        <div className="radio-seat__grid" role="radiogroup" aria-label="Seat">
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="A1" aria-label="Row A, seat 1" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="A2" aria-label="Row A, seat 2" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="A3" aria-label="Row A, seat 3" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="A4" aria-label="Row A, seat 4, taken" disabled />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="B1" aria-label="Row B, seat 1" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="B2" aria-label="Row B, seat 2, taken" disabled />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="B3" aria-label="Row B, seat 3" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="B4" aria-label="Row B, seat 4" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="C1" aria-label="Row C, seat 1, taken" disabled />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="C2" aria-label="Row C, seat 2" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="C3" aria-label="Row C, seat 3" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
          <label className="radio-seat__option">
            <input className="radio-seat__input" type="radio" name={name} value="C4" aria-label="Row C, seat 4" />
            <span className="radio-seat__seat" aria-hidden="true" />
          </label>
        </div>
        <div className="radio-seat__ticket" aria-hidden="true">
          <span className="radio-seat__ticket-label">Seat</span>
          <span className="radio-seat__code"><span>–</span></span>
        </div>
      </div>
    </>
  );
}

// The ticket rolls to the new seat: the old code leaves upward as the new
// one rises in.
function initSeat(root: HTMLElement): (() => void) | undefined {
  const code = root.querySelector<HTMLElement>('.radio-seat__code');
  if (!code) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const roll = () => {
    const input = root.querySelector<HTMLInputElement>('.radio-seat__input:checked');
    if (!input) return;
    Array.from(code.children).forEach((old) => {
      if (reduce) return old.remove();
      old.className = 'radio-seat__code-out';
      window.setTimeout(() => old.remove(), 260);
    });
    const next = document.createElement('span');
    next.className = 'radio-seat__code-in';
    next.textContent = input.value;
    code.appendChild(next);
  };

  root.addEventListener('change', roll);
  return () => root.removeEventListener('change', roll);
}
