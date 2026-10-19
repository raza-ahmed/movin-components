"use client";

import { useEffect, useRef } from 'react';

const css = `
  .toggle-fan {
    --toggle-fan-v: 0;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .toggle-fan__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* The cage: a ring with a grille, and a blur disc whose strength is the speed. */
  .toggle-fan__fan {
    position: relative;
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border: 2px solid #4d4d4d;
    border-radius: 50%;
    box-sizing: border-box;
    background: repeating-radial-gradient(circle, transparent 0 6px, #282828 6px 7px);
  }

  .toggle-fan__fan::after {
    content: '';
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201, 201, 201, 0.35) 30%, rgba(201, 201, 201, 0.1) 70%, transparent 72%);
    opacity: calc(var(--toggle-fan-v) * 0.9);
  }

  .toggle-fan__blades {
    width: 44px;
    height: 44px;
    fill: #a7a7a7;
    opacity: calc(1 - var(--toggle-fan-v) * 0.55);
  }

  .toggle-fan__hub {
    position: absolute;
    z-index: 1;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ededed;
  }

  /* A plain switch beside it shows the state. */
  .toggle-fan__switch {
    position: relative;
    width: 40px;
    height: 22px;
    border-radius: 9999px;
    background: #3a3a3a;
    transition: background-color 0.25s;
  }

  .toggle-fan__knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ededed;
    transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1);
  }

  .toggle-fan__input:checked ~ .toggle-fan__switch {
    background: #c9c9c9;
  }

  .toggle-fan__input:checked ~ .toggle-fan__switch .toggle-fan__knob {
    background: #111111;
    transform: translateX(18px);
  }

  .toggle-fan__input:focus-visible ~ .toggle-fan__switch {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle-fan__knob {
      transition: none;
    }
  }
`;

export function FanToggle() {
  const ref = useRef<HTMLLabelElement>(null);
  useEffect(() => (ref.current ? initFan(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <label className="toggle-fan" ref={ref}>
        <input className="toggle-fan__input" type="checkbox" role="switch" />
        <span className="toggle-fan__fan" aria-hidden="true">
          <svg className="toggle-fan__blades" viewBox="0 0 40 40">
            <ellipse cx="20" cy="10.5" rx="5" ry="9" />
            <ellipse cx="20" cy="10.5" rx="5" ry="9" transform="rotate(120 20 20)" />
            <ellipse cx="20" cy="10.5" rx="5" ry="9" transform="rotate(240 20 20)" />
          </svg>
          <span className="toggle-fan__hub" />
        </span>
        <span className="toggle-fan__switch" aria-hidden="true"><span className="toggle-fan__knob" /></span>
        <span className="toggle-fan__label">Fan</span>
      </label>
    </>
  );
}

// Speed eases toward its target: quicker spinning up than coasting down.
// The angle just accumulates, so the blades stop wherever they happen to be.
function initFan(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.toggle-fan__input');
  const blades = root.querySelector<SVGElement>('.toggle-fan__blades');
  if (!input || !blades) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX = 900; // degrees per second at full speed
  let v = 0; // 0..1 of full speed
  let angle = 0;
  let last = 0;
  let frame = 0;

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const target = input.checked ? 1 : 0;
    const tau = target ? 0.45 : 1.1;
    v += (target - v) * (1 - Math.exp(-dt / tau));
    if (!target && v < 0.004) v = 0;
    angle = (angle + v * MAX * dt) % 360;
    blades.style.transform = `rotate(${angle.toFixed(2)}deg)`;
    root.style.setProperty('--toggle-fan-v', v.toFixed(3));
    frame = v || target ? requestAnimationFrame(tick) : 0;
  };

  const change = () => {
    if (reduce || frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  input.addEventListener('change', change);
  return () => {
    cancelAnimationFrame(frame);
    input.removeEventListener('change', change);
  };
}
