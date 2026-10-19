"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-peek {
    position: relative;
    display: flex;
    align-items: flex-end;
    width: 100%;
    max-width: 300px;
    box-sizing: border-box;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background: #202020;
    transition: border-color 0.2s;
  }

  .field-peek:focus-within {
    border-color: #a7a7a7;
  }

  .field-peek__label {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: 9px 0 9px 14px;
    cursor: text;
  }

  .field-peek__name {
    color: #7c7c7c;
    font-size: 11px;
  }

  .field-peek__input {
    width: 100%;
    margin: 2px 0 0;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: #f6f6f6;
    font: inherit;
    font-size: 15px;
    letter-spacing: 0.02em;
  }

  .field-peek__toggle {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 44px;
    height: 52px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0 10px 10px 0;
    background: none;
    color: #a7a7a7;
    cursor: pointer;
  }

  .field-peek__toggle:focus-visible {
    outline: 2px solid #a7a7a7;
    outline-offset: -4px;
  }

  .field-peek__toggle svg {
    width: 24px;
    height: 24px;
    overflow: visible;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* The open eye squeezes shut to a line; the lashed lid takes over as it closes. */
  .field-peek__open {
    transform: scaleY(0.05);
    transform-origin: 12px 12px;
    opacity: 0;
    transition: transform 0.18s ease-in, opacity 0s 0.18s;
  }

  .field-peek__white {
    fill: #282828;
  }

  .field-peek__pupil {
    fill: #ededed;
    stroke: none;
    transform: translateX(var(--field-peek-x, 0px));
    transition: transform 0.12s ease-out;
  }

  .field-peek__shut {
    transition: opacity 0.1s 0.12s;
  }

  .field-peek--shown .field-peek__open {
    opacity: 1;
    transform: scaleY(1);
    transition: transform 0.32s cubic-bezier(0.3, 1.5, 0.5, 1), opacity 0s;
  }

  .field-peek--shown .field-peek__shut {
    opacity: 0;
    transition: opacity 0.06s;
  }

  .field-peek--shown .field-peek__toggle {
    color: #ededed;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-peek *,
    .field-peek--shown * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  }
`;

export function PeekInput() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initPeek(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="field-peek">
        <label className="field-peek__label">
          <span className="field-peek__name">Password</span>
          <input className="field-peek__input" type="password" autoComplete="new-password" spellCheck={false} defaultValue="motion-is-fun" />
        </label>
        <button className="field-peek__toggle" type="button" aria-label="Show password" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <g className="field-peek__open">
              <path className="field-peek__white" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
              <circle className="field-peek__pupil" cx="12" cy="12" r="3.2" />
            </g>
            <path className="field-peek__shut" d="M2.5 11.5S6 16.5 12 16.5s9.5-5 9.5-5M5.5 14.6 4 16.6M9.3 16.2l-.7 2.3M14.7 16.2l.7 2.3M18.5 14.6l1.5 2" />
          </svg>
        </button>
      </div>
    </>
  );
}

// The toggle flips the input type; while shown, the pupil's x follows the
// caret, measured with a canvas in the input's own font.
function initPeek(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.field-peek__input');
  const toggle = root.querySelector<HTMLButtonElement>('.field-peek__toggle');
  if (!input || !toggle) return;
  const ctx = document.createElement('canvas').getContext('2d');

  const look = () => {
    if (!ctx || input.type === 'password' || document.activeElement !== input) {
      root.style.setProperty('--field-peek-x', '0px');
      return;
    }
    const cs = getComputedStyle(input);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const text = input.value.slice(0, input.selectionEnd ?? 0);
    const spacing = parseFloat(cs.letterSpacing) || 0;
    const x = ctx.measureText(text).width + spacing * text.length - input.scrollLeft;
    const t = Math.max(0, Math.min(1, x / input.clientWidth)) * 2 - 1;
    root.style.setProperty('--field-peek-x', `${(t * 4.5).toFixed(2)}px`);
  };
  // Switching the type resets the selection in some browsers; keep it.
  const flip = () => {
    const a = input.selectionStart;
    const b = input.selectionEnd;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    root.classList.toggle('field-peek--shown', show);
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    input.focus();
    if (a !== null && b !== null) input.setSelectionRange(a, b);
    look();
  };
  const selection = () => {
    if (document.activeElement === input) look();
  };
  // Keep focus in the field when the eye is pressed with a pointer.
  const down = (e: PointerEvent) => e.preventDefault();

  toggle.addEventListener('click', flip);
  toggle.addEventListener('pointerdown', down);
  input.addEventListener('input', look);
  input.addEventListener('blur', look);
  input.addEventListener('scroll', look);
  document.addEventListener('selectionchange', selection);
  return () => {
    toggle.removeEventListener('click', flip);
    toggle.removeEventListener('pointerdown', down);
    input.removeEventListener('input', look);
    input.removeEventListener('blur', look);
    input.removeEventListener('scroll', look);
    document.removeEventListener('selectionchange', selection);
  };
}
