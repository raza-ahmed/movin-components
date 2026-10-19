"use client";

import { useId, type CSSProperties } from 'react';

const css = `
  .radio-fan {
    position: relative;
    display: inline-block;
    width: 180px;
    height: 120px;
  }

  /* Every card pivots about a point well below the hand, so they fan out. */
  .radio-fan__option {
    --radio-fan-turn: calc((var(--radio-fan-i) - 1.5) * 14deg);
    position: absolute;
    bottom: 8px;
    left: 50%;
    width: 52px;
    height: 74px;
    margin-left: -26px;
    cursor: pointer;
    transform: rotate(var(--radio-fan-turn));
    transform-origin: 50% 170%;
    transition: transform 0.45s cubic-bezier(0.3, 1.4, 0.5, 1);
  }

  .radio-fan__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-fan__card {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 6px 7px;
    border: 1px solid #4d4d4d;
    border-radius: 7px;
    background: #282828;
    color: #a7a7a7;
    box-shadow: -2px 3px 8px rgba(0, 0, 0, 0.45);
    transition: background-color 0.25s, color 0.25s, border-color 0.25s, transform 0.25s;
  }

  .radio-fan__rank {
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
  }

  .radio-fan__suit {
    align-self: flex-end;
    font-size: 20px;
    line-height: 1;
  }

  .radio-fan__option:hover .radio-fan__card {
    transform: translateY(-5px);
  }

  /* Chosen: lifted out of the hand and half straightened. */
  .radio-fan__option:has(.radio-fan__input:checked) {
    z-index: 1;
    transform: translateY(-18px) rotate(calc(var(--radio-fan-turn) * 0.4));
  }

  .radio-fan__option:has(.radio-fan__input:checked) .radio-fan__card {
    border-color: #ededed;
    background: #ededed;
    color: #111111;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  }

  .radio-fan__option:has(.radio-fan__input:focus-visible) .radio-fan__card {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-fan__option,
    .radio-fan__card {
      transition: none;
    }
  }
`;

export function FanRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  return (
    <>
      <style>{css}</style>
      <div className="radio-fan" role="radiogroup" aria-label="Pick a card">
        <label className="radio-fan__option" style={{ '--radio-fan-i': 0 } as CSSProperties}>
          <input className="radio-fan__input" type="radio" name={name} value="A♠" aria-label="Ace of spades" />
          <span className="radio-fan__card" aria-hidden="true"><span className="radio-fan__rank">A</span><span className="radio-fan__suit">♠</span></span>
        </label>
        <label className="radio-fan__option" style={{ '--radio-fan-i': 1 } as CSSProperties}>
          <input className="radio-fan__input" type="radio" name={name} value="K♥" aria-label="King of hearts" defaultChecked />
          <span className="radio-fan__card" aria-hidden="true"><span className="radio-fan__rank">K</span><span className="radio-fan__suit">♥</span></span>
        </label>
        <label className="radio-fan__option" style={{ '--radio-fan-i': 2 } as CSSProperties}>
          <input className="radio-fan__input" type="radio" name={name} value="Q♦" aria-label="Queen of diamonds" />
          <span className="radio-fan__card" aria-hidden="true"><span className="radio-fan__rank">Q</span><span className="radio-fan__suit">♦</span></span>
        </label>
        <label className="radio-fan__option" style={{ '--radio-fan-i': 3 } as CSSProperties}>
          <input className="radio-fan__input" type="radio" name={name} value="J♣" aria-label="Jack of clubs" />
          <span className="radio-fan__card" aria-hidden="true"><span className="radio-fan__rank">J</span><span className="radio-fan__suit">♣</span></span>
        </label>
      </div>
    </>
  );
}
