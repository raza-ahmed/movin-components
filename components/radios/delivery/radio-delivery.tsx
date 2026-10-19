"use client";

import { useEffect, useId, useRef } from 'react';

const css = `
  .radio-delivery {
    --radio-delivery-x: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 280px;
    color: #ededed;
    font-size: 13px;
  }

  /* A one-week road: a day tick every seventh of the way. */
  .radio-delivery__road {
    position: relative;
    height: 46px;
    background:
      repeating-linear-gradient(90deg, #4d4d4d 0 1px, transparent 1px calc((100% - 1px) / 7)) 0 30px / 100% 5px no-repeat,
      linear-gradient(#3a3a3a, #3a3a3a) 0 30px / 100% 1px no-repeat;
  }

  .radio-delivery__mark {
    position: absolute;
    bottom: 0;
    left: 0;
    color: #7c7c7c;
    font-size: 10px;
  }

  .radio-delivery__mark--end {
    right: 0;
    left: auto;
  }

  .radio-delivery__truck {
    position: absolute;
    top: 7px;
    left: calc(var(--radio-delivery-x) * (100% - 34px));
    width: 34px;
    height: 22px;
  }

  .radio-delivery--ready .radio-delivery__truck {
    transition: left 0.8s cubic-bezier(0.5, 0, 0.3, 1);
  }

  .radio-delivery__truck svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    transition: transform 0.2s;
  }

  .radio-delivery--back .radio-delivery__truck svg {
    transform: scaleX(-1);
  }

  .radio-delivery__body {
    fill: #ededed;
  }

  .radio-delivery__window {
    fill: #3a3a3a;
  }

  .radio-delivery__wheel {
    fill: #202020;
    stroke: #a7a7a7;
    stroke-width: 1.4;
    transform-box: fill-box;
    transform-origin: center;
  }

  /* While it drives: wheels spin and the body bobs. */
  .radio-delivery--moving .radio-delivery__wheel {
    animation: radio-delivery-spin 0.3s linear infinite;
  }

  .radio-delivery--moving .radio-delivery__body,
  .radio-delivery--moving .radio-delivery__window {
    animation: radio-delivery-bob 0.2s ease-in-out infinite alternate;
  }

  @keyframes radio-delivery-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes radio-delivery-bob {
    to {
      transform: translateY(-1px);
    }
  }

  .radio-delivery__list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .radio-delivery__option {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    align-items: center;
    column-gap: 10px;
    padding: 9px 12px;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background: #202020;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .radio-delivery__option:hover {
    border-color: #7c7c7c;
  }

  .radio-delivery__option:has(.radio-delivery__input:checked) {
    border-color: #ededed;
  }

  .radio-delivery__option:has(.radio-delivery__input:focus-visible) {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .radio-delivery__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-delivery__dot {
    grid-row: 1 / 3;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 2px solid #4d4d4d;
    border-radius: 50%;
    transition: border-width 0.25s cubic-bezier(0.3, 1.6, 0.5, 1), border-color 0.2s;
  }

  .radio-delivery__input:checked + .radio-delivery__dot {
    border-width: 5px;
    border-color: #ededed;
  }

  .radio-delivery__name {
    font-weight: 600;
  }

  .radio-delivery__eta {
    grid-column: 2;
    color: #7c7c7c;
    font-size: 12px;
  }

  .radio-delivery__price {
    grid-row: 1 / 3;
    grid-column: 3;
    color: #a7a7a7;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-delivery--ready .radio-delivery__truck,
    .radio-delivery__dot {
      transition: none;
    }
    .radio-delivery--moving .radio-delivery__wheel,
    .radio-delivery--moving .radio-delivery__body,
    .radio-delivery--moving .radio-delivery__window {
      animation: none;
    }
  }
`;

export function DeliveryRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initDelivery(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div className="radio-delivery" ref={ref}>
        <div className="radio-delivery__road" aria-hidden="true">
          <span className="radio-delivery__truck"><svg viewBox="0 0 34 22"><path className="radio-delivery__body" d="M1 3.5h20v13H1zM21 7.5h6.5l4.5 5v4h-11z" /><path className="radio-delivery__window" d="M23 9.5h3.6l2.6 3H23z" /><g className="radio-delivery__wheel"><circle cx="7" cy="17.5" r="3" /><path d="M7 15.5v4" /></g><g className="radio-delivery__wheel"><circle cx="26" cy="17.5" r="3" /><path d="M26 15.5v4" /></g></svg></span>
          <span className="radio-delivery__mark">Today</span>
          <span className="radio-delivery__mark radio-delivery__mark--end">+7 days</span>
        </div>
        <div className="radio-delivery__list" role="radiogroup" aria-label="Delivery">
          <label className="radio-delivery__option">
            <input className="radio-delivery__input" type="radio" name={name} value="standard" data-days="6" defaultChecked />
            <span className="radio-delivery__dot" aria-hidden="true" />
            <span className="radio-delivery__name">Standard</span>
            <span className="radio-delivery__eta">5–7 days</span>
            <span className="radio-delivery__price">Free</span>
          </label>
          <label className="radio-delivery__option">
            <input className="radio-delivery__input" type="radio" name={name} value="express" data-days="2" />
            <span className="radio-delivery__dot" aria-hidden="true" />
            <span className="radio-delivery__name">Express</span>
            <span className="radio-delivery__eta">2 days</span>
            <span className="radio-delivery__price">$9</span>
          </label>
          <label className="radio-delivery__option">
            <input className="radio-delivery__input" type="radio" name={name} value="overnight" data-days="1" />
            <span className="radio-delivery__dot" aria-hidden="true" />
            <span className="radio-delivery__name">Overnight</span>
            <span className="radio-delivery__eta">Tomorrow</span>
            <span className="radio-delivery__price">$19</span>
          </label>
        </div>
      </div>
    </>
  );
}

// The truck parks at the arrival day (data-days / 7 of the road); while it
// moves it gets a class that spins its wheels, and it faces the way it goes.
function initDelivery(root: HTMLElement): (() => void) | undefined {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let x: number | null = null;
  let timer = 0;

  const place = () => {
    const input = root.querySelector<HTMLInputElement>('.radio-delivery__input:checked');
    if (!input) return;
    const nx = Math.min(1, Number(input.dataset.days) / 7);
    if (x !== null && nx !== x) {
      root.classList.toggle('radio-delivery--back', nx < x);
      root.classList.add('radio-delivery--moving');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove('radio-delivery--moving'), reduce ? 0 : 800);
    }
    x = nx;
    root.style.setProperty('--radio-delivery-x', String(nx));
  };

  root.addEventListener('change', place);
  place();
  // Park without driving on mount; animate from then on.
  const frame = requestAnimationFrame(() => root.classList.add('radio-delivery--ready'));
  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
    root.removeEventListener('change', place);
  };
}
