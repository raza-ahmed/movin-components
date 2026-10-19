"use client";

import { useEffect, useRef } from 'react';

const css = `
  @property --btn-halftone-r {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  .btn-halftone {
    --btn-halftone-x: 50%;
    --btn-halftone-y: 50%;
    --btn-halftone-wx: 50%;
    --btn-halftone-wy: 50%;
    position: relative;
    display: inline-grid;
    place-items: center;
    height: 56px;
    padding: 0 32px;
    overflow: hidden;
    isolation: isolate;
    border: 1px solid #3a3a3a;
    border-radius: 12px;
    background: #202020;
    color: #ededed;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.3s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-halftone:hover {
    border-color: #7c7c7c;
  }

  .btn-halftone:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  /* Three screens on the same 7px grid, so a dot can only ever grow in place. */
  .btn-halftone__dots,
  .btn-halftone__torch,
  .btn-halftone__wave {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-position: 3px 3px;
    background-size: 7px 7px;
  }

  .btn-halftone__dots {
    background-image: radial-gradient(circle, #3a3a3a 0.9px, transparent 1.4px);
  }

  .btn-halftone__torch {
    background-image: radial-gradient(circle, #a7a7a7 1.7px, transparent 2.2px);
    -webkit-mask-image: radial-gradient(circle 72px at var(--btn-halftone-x) var(--btn-halftone-y), #000 10%, transparent);
    mask-image: radial-gradient(circle 72px at var(--btn-halftone-x) var(--btn-halftone-y), #000 10%, transparent);
    opacity: 0;
    transition: opacity 0.35s;
  }

  .btn-halftone:hover .btn-halftone__torch {
    opacity: 1;
  }

  .btn-halftone__wave {
    background-image: radial-gradient(circle, #f6f6f6 2.3px, transparent 2.9px);
    -webkit-mask-image: radial-gradient(circle at var(--btn-halftone-wx) var(--btn-halftone-wy), transparent max(0px, calc(var(--btn-halftone-r) - 30px)), #000 max(0px, calc(var(--btn-halftone-r) - 8px)), transparent var(--btn-halftone-r));
    mask-image: radial-gradient(circle at var(--btn-halftone-wx) var(--btn-halftone-wy), transparent max(0px, calc(var(--btn-halftone-r) - 30px)), #000 max(0px, calc(var(--btn-halftone-r) - 8px)), transparent var(--btn-halftone-r));
    opacity: 0;
  }

  .btn-halftone--wave .btn-halftone__wave {
    animation: btn-halftone-wave 1.3s cubic-bezier(0.35, 0.4, 0.45, 1);
  }

  .btn-halftone__label {
    position: relative;
    text-shadow: 0 0 10px #202020, 0 0 4px #202020;
  }

  @keyframes btn-halftone-wave {
    0% {
      --btn-halftone-r: 0px;
      opacity: 1;
    }
    65% {
      opacity: 1;
    }
    100% {
      --btn-halftone-r: 260px;
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-halftone,
    .btn-halftone__torch {
      transition: none;
    }
    .btn-halftone--wave .btn-halftone__wave {
      animation: none;
    }
  }
`;

export function HalftoneButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const local = (e: MouseEvent): [number, number] => {
      const box = root.getBoundingClientRect();
      // A keyboard press has no pointer: start from the centre.
      return e.type === 'click' && e.detail === 0 ? [box.width / 2, box.height / 2] : [e.clientX - box.left, e.clientY - box.top];
    };
    const move = (e: MouseEvent) => {
      const [x, y] = local(e);
      root.style.setProperty('--btn-halftone-x', `${x}px`);
      root.style.setProperty('--btn-halftone-y', `${y}px`);
    };
    const wave = (e: MouseEvent) => {
      const [x, y] = local(e);
      root.style.setProperty('--btn-halftone-wx', `${x}px`);
      root.style.setProperty('--btn-halftone-wy', `${y}px`);
      root.classList.remove('btn-halftone--wave');
      void root.offsetWidth; // restart the ring
      root.classList.add('btn-halftone--wave');
    };
    const done = (e: AnimationEvent) => {
      if (e.animationName === 'btn-halftone-wave') root.classList.remove('btn-halftone--wave');
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerenter', move);
    root.addEventListener('pointerenter', wave);
    root.addEventListener('click', wave);
    root.addEventListener('animationend', done);
    return () => {
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerenter', move);
      root.removeEventListener('pointerenter', wave);
      root.removeEventListener('click', wave);
      root.removeEventListener('animationend', done);
    };
  }, []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-halftone" type="button">
        <span className="btn-halftone__dots" aria-hidden="true" />
        <span className="btn-halftone__torch" aria-hidden="true" />
        <span className="btn-halftone__wave" aria-hidden="true" />
        <span className="btn-halftone__label">Get started</span>
      </button>
    </>
  );
}
