"use client";

import { useEffect, useRef } from 'react';

const css = `
  .field-caret {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 320px;
    color: #a7a7a7;
    font-size: 13px;
  }

  .field-caret__box {
    --field-caret-x: 0px;
    position: relative;
    display: block;
    overflow: hidden;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    background: #202020;
    transition: border-color 0.2s;
  }

  .field-caret__box:focus-within {
    border-color: #a7a7a7;
  }

  /* The native caret is hidden; the custom one stands in for it. */
  .field-caret__input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 46px;
    margin: 0;
    padding: 0 14px;
    border: 0;
    outline: none;
    background: transparent;
    color: #f6f6f6;
    font: inherit;
    font-size: 16px;
    caret-color: transparent;
  }

  .field-caret__input::selection {
    background: #4d4d4d;
  }

  .field-caret__head,
  .field-caret__tail {
    position: absolute;
    top: 50%;
    left: 0;
    height: 20px;
    margin-top: -10px;
    border-radius: 1px;
    background: #ededed;
    pointer-events: none;
  }

  .field-caret__head {
    width: 2px;
    opacity: 0;
    transform: translateX(var(--field-caret-x));
    transition: transform 0.09s cubic-bezier(0.2, 0, 0, 1), opacity 0.1s;
  }

  /* The streak is 1px wide; the script stretches it between the old and new spot. */
  .field-caret__tail {
    width: 1px;
    height: 14px;
    margin-top: -7px;
    background: linear-gradient(90deg, rgba(237, 237, 237, 0), rgba(237, 237, 237, 0.6));
    opacity: 0;
    transform-origin: 0 50%;
  }

  /* Moving left, the bright end leads on the left. */
  .field-caret__tail--left {
    background: linear-gradient(270deg, rgba(237, 237, 237, 0), rgba(237, 237, 237, 0.6));
  }

  .field-caret--on .field-caret__head {
    opacity: 1;
    animation: field-caret-blink 1.06s steps(1) 0.5s infinite;
  }

  .field-caret--moving .field-caret__head {
    animation: none;
  }

  @keyframes field-caret-blink {
    50% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .field-caret__head {
      transition: none;
    }
    .field-caret__tail {
      display: none;
    }
  }
`;

export function SmoothCaretInput() {
  const ref = useRef<HTMLLabelElement>(null);
  useEffect(() => (ref.current ? initCaret(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <label ref={ref} className="field-caret">
        <span className="field-caret__name">Display name</span>
        <span className="field-caret__box">
          <input className="field-caret__input" type="text" defaultValue="Smooth operator" spellCheck={false} autoComplete="off" />
          <span className="field-caret__tail" aria-hidden="true" />
          <span className="field-caret__head" aria-hidden="true" />
        </span>
      </label>
    </>
  );
}

// The native caret is transparent. Its x (padding + width of the text before
// it, measured with a canvas in the input's font, minus scroll) drives a
// custom caret; a 1px streak stretched between the old and new spot shrinks
// into it. It blinks only once it rests.
function initCaret(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.field-caret__input');
  const box = root.querySelector<HTMLElement>('.field-caret__box');
  const tail = root.querySelector<HTMLElement>('.field-caret__tail');
  const ctx = document.createElement('canvas').getContext('2d');
  if (!input || !box || !ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let x: number | null = null;
  let timer = 0;

  const measure = () => {
    const cs = getComputedStyle(input);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const pl = parseFloat(cs.paddingLeft);
    const text = input.value.slice(0, input.selectionEnd ?? 0);
    const at = pl + ctx.measureText(text).width - input.scrollLeft;
    return Math.max(pl - 1, Math.min(input.clientWidth - parseFloat(cs.paddingRight), at));
  };
  const update = () => {
    const on = document.activeElement === input && input.selectionStart === input.selectionEnd;
    root.classList.toggle('field-caret--on', on);
    if (!on) return;
    const nx = measure();
    if (nx === x) return;
    if (x !== null && tail && !reduce && Math.abs(nx - x) > 3) {
      tail.classList.toggle('field-caret__tail--left', nx < x);
      tail.animate(
        [
          { opacity: 1, transform: `translateX(${Math.min(x, nx)}px) scaleX(${Math.abs(nx - x)})` },
          { opacity: 0, transform: `translateX(${nx}px) scaleX(1)` },
        ],
        { duration: 260, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
      );
    }
    x = nx;
    box.style.setProperty('--field-caret-x', `${nx.toFixed(1)}px`);
    root.classList.add('field-caret--moving');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => root.classList.remove('field-caret--moving'), 500);
  };
  const selection = () => {
    if (document.activeElement === input) update();
  };
  const blur = () => {
    x = null;
    update();
  };

  input.addEventListener('input', update);
  input.addEventListener('focus', update);
  input.addEventListener('blur', blur);
  input.addEventListener('scroll', update);
  document.addEventListener('selectionchange', selection);
  return () => {
    window.clearTimeout(timer);
    input.removeEventListener('input', update);
    input.removeEventListener('focus', update);
    input.removeEventListener('blur', blur);
    input.removeEventListener('scroll', update);
    document.removeEventListener('selectionchange', selection);
  };
}
