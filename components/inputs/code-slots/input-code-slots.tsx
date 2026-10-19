"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-code-slots {
    display: inline-flex;
    flex-direction: column;
    gap: 10px;
    color: #ededed;
    font-size: 13px;
  }

  .field-code-slots__label {
    color: #a7a7a7;
  }

  .field-code-slots__wrap {
    position: relative;
    display: flex;
    align-items: center;
    align-self: flex-start;
  }

  /* The real input sits invisibly over the cells and takes every keystroke,
     paste and autofill; the cells only draw its value. */
  .field-code-slots__input {
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    opacity: 0;
    font-size: 16px;
    cursor: text;
  }

  .field-code-slots__cells {
    display: flex;
    gap: 8px;
    transition: gap 0.45s cubic-bezier(0.5, 0, 0.2, 1);
  }

  .field-code-slots__cell {
    position: relative;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: 40px;
    height: 48px;
    overflow: hidden;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background: #202020;
    font-size: 20px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    transition: border-color 0.2s, border-radius 0.45s cubic-bezier(0.5, 0, 0.2, 1), background-color 0.3s;
  }

  .field-code-slots__cell > span {
    animation: field-code-slots-in 0.35s cubic-bezier(0.3, 1.4, 0.5, 1);
  }

  @keyframes field-code-slots-in {
    from {
      opacity: 0;
      transform: translateY(80%);
    }
  }

  .field-code-slots__input:focus-visible ~ .field-code-slots__cells .field-code-slots__cell--active,
  .field-code-slots__cell--active {
    border-color: #a7a7a7;
  }

  .field-code-slots__cell--active::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 20px;
    border-radius: 1px;
    background: #ededed;
    animation: field-code-slots-blink 1s steps(1) infinite;
  }

  @keyframes field-code-slots-blink {
    50% {
      opacity: 0;
    }
  }

  /* Complete: the gaps close and the cells hand their borders to one pill
     drawn on the row, so no seams show between them. */
  .field-code-slots__cells {
    position: relative;
  }

  .field-code-slots__cells::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid #ededed;
    border-radius: 12px;
    background: #282828;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .field-code-slots--done .field-code-slots__cells {
    gap: 0;
  }

  .field-code-slots--done .field-code-slots__cells::before {
    opacity: 1;
    transition: opacity 0.25s 0.25s;
  }

  .field-code-slots--done .field-code-slots__cell {
    border-color: transparent;
    border-radius: 0;
    background: transparent;
    transition-delay: 0s, 0s, 0.25s;
  }

  .field-code-slots--done .field-code-slots__input:focus-visible ~ .field-code-slots__cells {
    border-radius: 14px;
    outline: 2px solid #7c7c7c;
    outline-offset: 3px;
  }

  .field-code-slots__tick {
    position: absolute;
    left: 100%;
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    margin-left: 12px;
    border-radius: 50%;
    background: #ededed;
    transform: scale(0);
    transition: transform 0.2s ease-in;
  }

  .field-code-slots__tick svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: #111111;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .field-code-slots__tick path {
    stroke-dasharray: 100 102;
    stroke-dashoffset: 101;
    transition: stroke-dashoffset 0.15s;
  }

  .field-code-slots--done .field-code-slots__tick {
    transform: scale(1);
    transition: transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1) 0.3s;
  }

  .field-code-slots--done .field-code-slots__tick path {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.3s ease-out 0.5s;
  }

  .field-code-slots__status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-code-slots *,
    .field-code-slots--done * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
    .field-code-slots__cell > span {
      animation: none;
    }
  }
`;

const LENGTH = 6;

export function CodeSlotsInput() {
  const ref = useRef<HTMLLabelElement>(null);
  useEffect(() => (ref.current ? initCodeSlots(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <label ref={ref} className="field-code-slots">
        <span className="field-code-slots__label">Verification code</span>
        <span className="field-code-slots__wrap">
          <input className="field-code-slots__input" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={LENGTH} spellCheck={false} />
          <span className="field-code-slots__cells" aria-hidden="true">
            {Array.from({ length: LENGTH }, (_, i) => (
              <span key={i} className="field-code-slots__cell" />
            ))}
          </span>
          <span className="field-code-slots__tick" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path pathLength={100} d="M5 10.5l3.5 3.5 6.5-8" />
            </svg>
          </span>
        </span>
        <span className="field-code-slots__status" aria-live="polite" />
      </label>
    </>
  );
}

// One real input takes every keystroke, paste and autofill; the cells only
// draw its value. A digit that changed gets a new span, so only it rolls in.
function initCodeSlots(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.field-code-slots__input');
  const cells = Array.from(root.querySelectorAll<HTMLElement>('.field-code-slots__cell'));
  const status = root.querySelector<HTMLElement>('.field-code-slots__status');
  if (!input || !cells.length) return;

  const render = () => {
    const v = input.value.replace(/\D/g, '').slice(0, cells.length);
    if (v !== input.value) input.value = v;
    const focused = document.activeElement === input;
    const done = v.length === cells.length;
    cells.forEach((cell, i) => {
      const ch = v[i] ?? '';
      if (cell.textContent !== ch) {
        cell.textContent = '';
        if (ch) {
          const s = document.createElement('span');
          s.textContent = ch;
          cell.appendChild(s);
        }
      }
      cell.classList.toggle('field-code-slots__cell--active', focused && !done && i === v.length);
    });
    root.classList.toggle('field-code-slots--done', done);
    if (status) status.textContent = done ? 'Code complete' : '';
  };
  // The caret always lives at the end, like typing into the next box.
  const toEnd = () => input.setSelectionRange(input.value.length, input.value.length);
  const key = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) e.preventDefault();
  };
  const focus = () => {
    toEnd();
    render();
  };

  input.addEventListener('input', render);
  input.addEventListener('focus', focus);
  input.addEventListener('blur', render);
  input.addEventListener('click', toEnd);
  input.addEventListener('keydown', key);
  render();
  return () => {
    input.removeEventListener('input', render);
    input.removeEventListener('focus', focus);
    input.removeEventListener('blur', render);
    input.removeEventListener('click', toEnd);
    input.removeEventListener('keydown', key);
  };
}
