"use client";

import { useEffect, useId, useRef } from 'react';

const css = `
  /* The cube turns to bring the chosen face to the front; --spin adds a
     whole extra turn per roll so it tumbles rather than just rotating. */
  .radio-die {
    --radio-die-rx: 0deg;
    --radio-die-ry: 0deg;
    --radio-die-spin: 0deg;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .radio-die:has(.radio-die__input[value='2']:checked) {
    --radio-die-ry: -90deg;
  }

  .radio-die:has(.radio-die__input[value='3']:checked) {
    --radio-die-rx: -90deg;
  }

  .radio-die:has(.radio-die__input[value='4']:checked) {
    --radio-die-rx: 90deg;
  }

  .radio-die:has(.radio-die__input[value='5']:checked) {
    --radio-die-ry: 90deg;
  }

  .radio-die:has(.radio-die__input[value='6']:checked) {
    --radio-die-ry: 180deg;
  }

  .radio-die__stage {
    position: relative;
    display: grid;
    place-items: center;
    width: 120px;
    height: 104px;
    perspective: 420px;
  }

  .radio-die__toss {
    transform-style: preserve-3d;
  }

  .radio-die--rolling .radio-die__toss {
    animation: radio-die-hop 0.7s cubic-bezier(0.3, 0, 0.4, 1);
  }

  @keyframes radio-die-hop {
    40% {
      transform: translateY(-30px);
    }
    78% {
      transform: translateY(0) scale(1.06, 0.92);
    }
    100% {
      transform: none;
    }
  }

  .radio-die__cube {
    position: relative;
    width: 52px;
    height: 52px;
    transform-style: preserve-3d;
    transform: rotateX(-18deg) rotateY(24deg) rotateX(var(--radio-die-rx)) rotateY(calc(var(--radio-die-ry) + var(--radio-die-spin)));
    transition: transform 0.7s cubic-bezier(0.3, 1.1, 0.5, 1);
  }

  .radio-die__face {
    position: absolute;
    inset: 0;
    border-radius: 9px;
    box-shadow: inset 0 0 0 1px light-dark(rgba(251, 252, 253, 0.15), rgba(18, 20, 23, 0.15));
  }

  .radio-die__face--1 {
    transform: translateZ(26px);
  }

  .radio-die__face--6 {
    transform: rotateY(180deg) translateZ(26px);
  }

  .radio-die__face--2 {
    transform: rotateY(90deg) translateZ(26px);
  }

  .radio-die__face--5 {
    transform: rotateY(-90deg) translateZ(26px);
  }

  .radio-die__face--3 {
    transform: rotateX(90deg) translateZ(26px);
  }

  .radio-die__face--4 {
    transform: rotateX(-90deg) translateZ(26px);
  }

  .radio-die__shadow {
    position: absolute;
    bottom: 6px;
    left: 50%;
    width: 56px;
    height: 10px;
    margin-left: -28px;
    border-radius: 50%;
    background: radial-gradient(light-dark(#fbfcfd, #121417), transparent 70%);
    opacity: 0.8;
  }

  .radio-die--rolling .radio-die__shadow {
    animation: radio-die-shadow 0.7s cubic-bezier(0.3, 0, 0.4, 1);
  }

  @keyframes radio-die-shadow {
    40% {
      opacity: 0.35;
      transform: scale(0.6);
    }
  }

  /* Pips. */
  .radio-die__face--1 {
    background: radial-gradient(circle at 50% 50%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), linear-gradient(145deg, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
  }

  .radio-die__face--2 {
    background: radial-gradient(circle at 28% 28%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 72%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), linear-gradient(145deg, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
  }

  .radio-die__face--3 {
    background: radial-gradient(circle at 28% 28%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 50% 50%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 72%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), linear-gradient(145deg, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
  }

  .radio-die__face--4 {
    background: radial-gradient(circle at 28% 28%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 28%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 28% 72%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 72%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), linear-gradient(145deg, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
  }

  .radio-die__face--5 {
    background: radial-gradient(circle at 28% 28%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 28%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 50% 50%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 28% 72%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 72%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), linear-gradient(145deg, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
  }

  .radio-die__face--6 {
    background: radial-gradient(circle at 28% 25%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 25%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 28% 50%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 50%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 28% 75%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), radial-gradient(circle at 72% 75%, light-dark(#fbfcfd, #121417) 0 4.5px, transparent 5px), linear-gradient(145deg, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd));
  }

  .radio-die__row {
    display: flex;
    gap: 4px;
  }

  .radio-die__option {
    position: relative;
    cursor: pointer;
  }

  .radio-die__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-die__chip {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#5f626a, #a7abb2);
    font-size: 13px;
    font-weight: 600;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  }

  .radio-die__option:hover .radio-die__chip {
    border-color: light-dark(#6d7179, #7d8087);
  }

  .radio-die__input:checked + .radio-die__chip {
    border-color: light-dark(#42454c, #e5e6e9);
    background: light-dark(#42454c, #e5e6e9);
    color: light-dark(#fbfcfd, #121417);
  }

  .radio-die__input:focus-visible + .radio-die__chip {
    outline: 2px solid light-dark(#5f626a, #a7abb2);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-die__cube {
      transition: none;
    }
    .radio-die--rolling .radio-die__toss,
    .radio-die--rolling .radio-die__shadow {
      animation: none;
    }
  }
`;

export function DieRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initDie(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div className="radio-die" ref={ref}>
        <div className="radio-die__stage" aria-hidden="true">
          <div className="radio-die__toss">
            <div className="radio-die__cube">
            <span className="radio-die__face radio-die__face--1" />
            <span className="radio-die__face radio-die__face--2" />
            <span className="radio-die__face radio-die__face--3" />
            <span className="radio-die__face radio-die__face--4" />
            <span className="radio-die__face radio-die__face--5" />
            <span className="radio-die__face radio-die__face--6" />
            </div>
          </div>
          <span className="radio-die__shadow" />
        </div>
        <div className="radio-die__row" role="radiogroup" aria-label="Roll">
          <label className="radio-die__option">
            <input className="radio-die__input" type="radio" name={name} value="1" defaultChecked />
            <span className="radio-die__chip">1</span>
          </label>
          <label className="radio-die__option">
            <input className="radio-die__input" type="radio" name={name} value="2" />
            <span className="radio-die__chip">2</span>
          </label>
          <label className="radio-die__option">
            <input className="radio-die__input" type="radio" name={name} value="3" />
            <span className="radio-die__chip">3</span>
          </label>
          <label className="radio-die__option">
            <input className="radio-die__input" type="radio" name={name} value="4" />
            <span className="radio-die__chip">4</span>
          </label>
          <label className="radio-die__option">
            <input className="radio-die__input" type="radio" name={name} value="5" />
            <span className="radio-die__chip">5</span>
          </label>
          <label className="radio-die__option">
            <input className="radio-die__input" type="radio" name={name} value="6" />
            <span className="radio-die__chip">6</span>
          </label>
        </div>
      </div>
    </>
  );
}

// Every roll adds a whole turn (--radio-die-spin), so the die tumbles to its
// face instead of just rotating back, and replays the hop.
function initDie(root: HTMLElement): (() => void) | undefined {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let turns = 0;

  const roll = () => {
    if (reduce) return;
    turns += 1;
    root.style.setProperty('--radio-die-spin', `${turns * 360}deg`);
    root.classList.remove('radio-die--rolling');
    void root.offsetWidth;
    root.classList.add('radio-die--rolling');
  };

  root.addEventListener('change', roll);
  return () => {
    root.removeEventListener('change', roll);
    root.classList.remove('radio-die--rolling');
  };
}
