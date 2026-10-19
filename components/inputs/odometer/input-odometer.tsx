"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-odometer {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #ededed;
    font-size: 13px;
  }

  .field-odometer__label {
    color: #a7a7a7;
  }

  .field-odometer__control {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border: 1px solid #3a3a3a;
    border-radius: 999px;
    background: #202020;
  }

  .field-odometer__step {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #282828;
    color: #ededed;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s, scale 0.15s;
  }

  .field-odometer__step:hover {
    background: #3a3a3a;
  }

  .field-odometer__step:active {
    scale: 0.9;
  }

  .field-odometer__step[aria-disabled='true'] {
    background: #202020;
    color: #4d4d4d;
    cursor: default;
  }

  .field-odometer__step:focus-visible,
  .field-odometer__value:focus-visible {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .field-odometer__step svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  /* Each wheel is a one-figure window over a strip of 0-9. */
  .field-odometer__value {
    display: flex;
    justify-content: center;
    min-width: 64px;
    border-radius: 8px;
    font-size: 34px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    line-height: 1.2;
    cursor: ew-resize;
    touch-action: none;
    user-select: none;
  }

  .field-odometer__digit {
    --field-odometer-d: 0;
    display: block;
    width: 0.62em;
    height: 1.2em;
    overflow: hidden;
    mask-image: linear-gradient(transparent, rgba(0, 0, 0, 1) 22%, rgba(0, 0, 0, 1) 78%, transparent);
    transition: width 0.35s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.25s;
  }

  .field-odometer__strip {
    display: block;
    text-align: center;
    transform: translateY(calc(var(--field-odometer-d) * -1.2em));
    transition: transform 0.55s cubic-bezier(0.3, 1.25, 0.5, 1);
  }

  .field-odometer__strip > span {
    display: block;
    height: 1.2em;
  }

  .field-odometer__digit--tens .field-odometer__strip {
    transition-delay: 0.06s;
  }

  /* Below ten the tens wheel folds away. */
  .field-odometer--single .field-odometer__digit--tens {
    width: 0;
    opacity: 0;
  }

  .field-odometer--limit .field-odometer__value {
    animation: field-odometer-bump 0.3s ease-out;
  }

  @keyframes field-odometer-bump {
    30% {
      transform: translateX(var(--field-odometer-dir, 4px));
    }
  }

  .field-odometer__hint {
    color: #7c7c7c;
    font-size: 11px;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-odometer *,
    .field-odometer--limit .field-odometer__value {
      transition-duration: 0s !important;
      animation: none !important;
    }
  }
`;

export function OdometerInput() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initOdometer(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="field-odometer">
        <span className="field-odometer__label">Guests</span>
        <div className="field-odometer__control">
          <button className="field-odometer__step" type="button" data-field-odometer-step="-1" aria-label="Fewer guests">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8h9" />
            </svg>
          </button>
          <div className="field-odometer__value" role="spinbutton" tabIndex={0} aria-label="Guests" aria-valuemin={1} aria-valuemax={99} aria-valuenow={8} data-unit="guests">
            <span className="field-odometer__digit field-odometer__digit--tens" aria-hidden="true" />
            <span className="field-odometer__digit" aria-hidden="true" />
          </div>
          <button className="field-odometer__step" type="button" data-field-odometer-step="1" aria-label="More guests">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8h9M8 3.5v9" />
            </svg>
          </button>
        </div>
        <span className="field-odometer__hint">Drag the number to scrub</span>
      </div>
    </>
  );
}

// Each wheel is a window over a 0-9 strip; --field-odometer-d picks the figure.
// Steps come from the buttons, the arrow keys, or 14px of sideways drag each.
function initOdometer(root: HTMLElement): (() => void) | undefined {
  const value = root.querySelector<HTMLElement>('.field-odometer__value');
  const wheels = Array.from(root.querySelectorAll<HTMLElement>('.field-odometer__digit'));
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-field-odometer-step]'));
  if (!value || wheels.length !== 2) return;
  const min = Number(value.getAttribute('aria-valuemin')) || 0;
  const max = Number(value.getAttribute('aria-valuemax')) || 99;
  const unit = value.dataset.unit ?? '';
  let n = Number(value.getAttribute('aria-valuenow')) || min;
  let drag: { x: number; from: number; at: number } | null = null;

  wheels.forEach((w) => {
    const strip = document.createElement('span');
    strip.className = 'field-odometer__strip';
    for (let i = 0; i < 10; i++) {
      const d = document.createElement('span');
      d.textContent = String(i);
      strip.appendChild(d);
    }
    w.appendChild(strip);
  });

  // Pushing past either end nudges the number toward the way it was pushed.
  const limit = (dir: number) => {
    root.style.setProperty('--field-odometer-dir', `${dir * 4}px`);
    root.classList.remove('field-odometer--limit');
    void root.offsetWidth;
    root.classList.add('field-odometer--limit');
  };
  const set = (v: number) => {
    const c = Math.max(min, Math.min(max, v));
    if (c !== v) limit(v > c ? 1 : -1);
    n = c;
    value.setAttribute('aria-valuenow', String(n));
    value.setAttribute('aria-valuetext', unit ? `${n} ${unit}` : String(n));
    wheels[0].style.setProperty('--field-odometer-d', String(Math.floor(n / 10) % 10));
    wheels[1].style.setProperty('--field-odometer-d', String(n % 10));
    root.classList.toggle('field-odometer--single', n < 10);
    steps.forEach((b) => {
      const s = Number(b.dataset.fieldOdometerStep);
      b.setAttribute('aria-disabled', String(s < 0 ? n <= min : n >= max));
    });
  };
  const click = (e: MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-field-odometer-step]');
    if (b) set(n + Number(b.dataset.fieldOdometerStep));
  };
  const keys: Record<string, () => number> = {
    ArrowUp: () => n + 1,
    ArrowRight: () => n + 1,
    ArrowDown: () => n - 1,
    ArrowLeft: () => n - 1,
    PageUp: () => n + 10,
    PageDown: () => n - 10,
    Home: () => min,
    End: () => max,
  };
  const key = (e: KeyboardEvent) => {
    const to = keys[e.key];
    if (!to) return;
    e.preventDefault();
    set(to());
  };
  const down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, from: n, at: n };
    value.setPointerCapture(e.pointerId);
    value.focus();
  };
  const move = (e: PointerEvent) => {
    if (!drag) return;
    const to = drag.from + Math.trunc((e.clientX - drag.x) / 14);
    if (to !== drag.at) {
      drag.at = to;
      set(to);
    }
  };
  const up = () => {
    drag = null;
  };

  root.addEventListener('click', click);
  value.addEventListener('keydown', key);
  value.addEventListener('pointerdown', down);
  value.addEventListener('pointermove', move);
  value.addEventListener('pointerup', up);
  value.addEventListener('pointercancel', up);
  set(n);
  return () => {
    root.removeEventListener('click', click);
    value.removeEventListener('keydown', key);
    value.removeEventListener('pointerdown', down);
    value.removeEventListener('pointermove', move);
    value.removeEventListener('pointerup', up);
    value.removeEventListener('pointercancel', up);
    wheels.forEach((w) => (w.textContent = ''));
  };
}
