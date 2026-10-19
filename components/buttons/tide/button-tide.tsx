"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-tide {
    --btn-tide-tilt: 0deg;
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 176px;
    height: 56px;
    padding: 0;
    overflow: hidden;
    isolation: isolate;
    border: 1px solid #4d4d4d;
    border-radius: 14px;
    background: #202020;
    color: #ededed;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-tide:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  /* Wider than the button, so tilting never shows a corner. */
  .btn-tide__liquid {
    position: absolute;
    top: 0;
    left: -25%;
    width: 150%;
    height: 100%;
    background: #ededed;
    translate: 0 calc(100% + 16px);
    rotate: var(--btn-tide-tilt);
    transition: translate 1s cubic-bezier(0.3, 1.25, 0.5, 1);
  }

  .btn-tide:hover .btn-tide__liquid,
  .btn-tide:focus-visible .btn-tide__liquid {
    translate: 0 46%;
  }

  .btn-tide:active .btn-tide__liquid {
    translate: 0 -12%;
    transition-duration: 0.45s;
  }

  .btn-tide__wave {
    position: absolute;
    bottom: calc(100% - 1px);
    left: 0;
    width: 200%;
    height: 12px;
    fill: #ededed;
    animation: btn-tide-roll 2.4s linear infinite;
  }

  .btn-tide__wave--back {
    height: 15px;
    opacity: 0.45;
    animation-duration: 3.7s;
    animation-direction: reverse;
  }

  /* Over the dark button it reads light, over the liquid it reads dark. */
  .btn-tide__label {
    position: relative;
    mix-blend-mode: difference;
    pointer-events: none;
  }

  @keyframes btn-tide-roll {
    to {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-tide__liquid {
      transition: none;
    }
    .btn-tide__wave {
      animation: none;
    }
  }
`;

const WAVE = 'M0 6Q15 0 30 6T60 6T90 6T120 6T150 6T180 6T210 6T240 6V12H0Z';

export function TideButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => (ref.current ? initTide(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-tide" type="button">
        <span className="btn-tide__liquid" aria-hidden="true">
          <svg className="btn-tide__wave btn-tide__wave--back" viewBox="0 0 240 12" preserveAspectRatio="none" focusable="false">
            <path d={WAVE} />
          </svg>
          <svg className="btn-tide__wave btn-tide__wave--front" viewBox="0 0 240 12" preserveAspectRatio="none" focusable="false">
            <path d={WAVE} />
          </svg>
        </span>
        <span className="btn-tide__label">Dive in</span>
      </button>
    </>
  );
}

// A fast swipe tips the water against the walls: horizontal pointer speed
// becomes a push that decays, and a spring tilts the liquid after it.
function initTide(root: HTMLElement): (() => void) | undefined {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let tilt = 0;
  let v = 0;
  let push = 0;
  let lastX: number | null = null;
  let lastT = 0;
  let raf = 0;

  const tick = () => {
    push *= 0.9;
    v = (v + (push - tilt) * 0.08) * 0.88;
    tilt += v;
    root.style.setProperty('--btn-tide-tilt', `${tilt.toFixed(2)}deg`);
    if (Math.abs(tilt) + Math.abs(v) + Math.abs(push) > 0.02) raf = requestAnimationFrame(tick);
    else {
      raf = 0;
      root.style.setProperty('--btn-tide-tilt', '0deg');
    }
  };

  const move = (e: PointerEvent) => {
    const now = performance.now();
    if (lastX !== null) {
      const vx = (e.clientX - lastX) / Math.max(8, now - lastT); // px per ms
      // Moving right piles the water up on the left: tilt counter-clockwise.
      push = Math.max(-10, Math.min(10, push - vx * 5));
    }
    lastX = e.clientX;
    lastT = now;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const leave = () => {
    lastX = null;
  };

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return () => {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    cancelAnimationFrame(raf);
    root.style.removeProperty('--btn-tide-tilt');
  };
}
