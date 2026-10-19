"use client";

import { useEffect, useRef } from 'react';

const css = `
  @property --btn-swipe-confirm-p {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }

  .btn-swipe-confirm {
    --btn-swipe-confirm-p: 0;
    --btn-swipe-confirm-travel: 200px;
    position: relative;
    box-sizing: border-box;
    width: 260px;
    height: 60px;
    overflow: hidden;
    border: 1px solid #3a3a3a;
    border-radius: 999px;
    background: #202020;
    font-size: 15px;
    font-weight: 600;
    user-select: none;
    -webkit-user-select: none;
    transition: --btn-swipe-confirm-p 0.55s cubic-bezier(0.3, 1.45, 0.5, 1);
  }

  /* While dragging, the knob follows the finger exactly. */
  .btn-swipe-confirm--drag {
    transition: none;
  }

  .btn-swipe-confirm__fill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: calc(56px + var(--btn-swipe-confirm-p) * var(--btn-swipe-confirm-travel));
    border-radius: 999px;
    background: #3a3a3a;
    transition: background-color 0.35s;
  }

  .btn-swipe-confirm__hint,
  .btn-swipe-confirm__done {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding-left: 44px;
  }

  .btn-swipe-confirm__hint {
    background: linear-gradient(90deg, #7c7c7c 40%, #f6f6f6 50%, #7c7c7c 60%) 0 0 / 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    opacity: calc(1 - var(--btn-swipe-confirm-p) * 1.8);
    animation: btn-swipe-confirm-shine 2.4s linear infinite;
  }

  .btn-swipe-confirm__done {
    padding-left: 0;
    color: #111111;
    opacity: 0;
    transition: opacity 0.3s 0.15s;
  }

  .btn-swipe-confirm__knob {
    position: absolute;
    top: 3px;
    left: 3px;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: #ededed;
    color: #111111;
    cursor: grab;
    touch-action: none;
    translate: calc(var(--btn-swipe-confirm-p) * var(--btn-swipe-confirm-travel)) 0;
    transition: background-color 0.35s, color 0.35s, scale 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-swipe-confirm__knob:active {
    cursor: grabbing;
    scale: 0.94;
  }

  .btn-swipe-confirm__knob:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 3px;
  }

  .btn-swipe-confirm__knob svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .btn-swipe-confirm__arrow {
    transition: opacity 0.2s;
  }

  .btn-swipe-confirm__check {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    transition: stroke-dashoffset 0.4s 0.25s cubic-bezier(0.6, 0, 0.3, 1);
  }

  .btn-swipe-confirm--done .btn-swipe-confirm__fill {
    background: #ededed;
  }

  .btn-swipe-confirm--done .btn-swipe-confirm__done {
    opacity: 1;
  }

  .btn-swipe-confirm--done .btn-swipe-confirm__knob {
    background: #111111;
    color: #ededed;
  }

  .btn-swipe-confirm--done .btn-swipe-confirm__arrow {
    opacity: 0;
  }

  .btn-swipe-confirm--done .btn-swipe-confirm__check {
    stroke-dashoffset: 0;
  }

  @keyframes btn-swipe-confirm-shine {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: -150% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-swipe-confirm,
    .btn-swipe-confirm *,
    .btn-swipe-confirm *::before,
    .btn-swipe-confirm *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export function SwipeConfirmButton({ onConfirm }: { onConfirm?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const confirmRef = useRef(onConfirm);
  confirmRef.current = onConfirm;
  useEffect(() => (ref.current ? initSwipeConfirm(ref.current, () => confirmRef.current?.()) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="btn-swipe-confirm">
        <span className="btn-swipe-confirm__fill" aria-hidden="true" />
        <span className="btn-swipe-confirm__hint" aria-hidden="true">
          Slide to confirm
        </span>
        <span className="btn-swipe-confirm__done" aria-hidden="true">
          Confirmed
        </span>
        <button className="btn-swipe-confirm__knob" type="button" aria-label="Confirm">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path className="btn-swipe-confirm__arrow" d="M5 12h13m-5-5 5 5-5 5" />
            <path className="btn-swipe-confirm__check" d="m6 12.5 4 4 8-9" />
          </svg>
        </button>
      </div>
    </>
  );
}

// One number drives everything: --btn-swipe-confirm-p (0..1) positions the
// knob, widens the fill and fades the hint. Dragging writes it directly; on
// release a registered-property transition springs it home or to the end.
function initSwipeConfirm(root: HTMLElement, onConfirm: () => void): (() => void) | undefined {
  const knob = root.querySelector<HTMLButtonElement>('.btn-swipe-confirm__knob');
  if (!knob) return;
  let travel = 0;
  let p = 0;
  let start: number | null = null; // pointer x at p = 0 while dragging
  let moved = false;
  let done = false;
  let nudge = 0;

  const set = (v: number) => {
    p = v;
    root.style.setProperty('--btn-swipe-confirm-p', v.toFixed(4));
  };

  const measure = () => {
    travel = root.clientWidth - knob.offsetWidth - 2 * knob.offsetLeft;
    root.style.setProperty('--btn-swipe-confirm-travel', `${travel}px`);
  };

  const confirm = () => {
    done = true;
    set(1);
    root.classList.add('btn-swipe-confirm--done');
    knob.setAttribute('aria-label', 'Confirmed. Activate to reset');
    onConfirm();
  };

  const reset = () => {
    done = false;
    set(0);
    root.classList.remove('btn-swipe-confirm--done');
    knob.setAttribute('aria-label', 'Confirm');
  };

  const down = (e: PointerEvent) => {
    if (done) return;
    start = e.clientX - p * travel;
    moved = false;
    knob.setPointerCapture(e.pointerId);
    root.classList.add('btn-swipe-confirm--drag');
  };

  const move = (e: PointerEvent) => {
    if (start === null) return;
    const raw = (e.clientX - start) / travel;
    if (Math.abs(raw - p) * travel > 2) moved = true;
    set(Math.max(0, Math.min(1, raw)));
  };

  const up = () => {
    if (start === null) return;
    start = null;
    root.classList.remove('btn-swipe-confirm--drag');
    if (p > 0.9) confirm();
    else set(0); // springs home: the transition is back on
  };

  // A tap without a drag: keyboard slides it, a pointer gets a nudge as a hint.
  const click = (e: MouseEvent) => {
    if (moved) {
      moved = false;
      return;
    }
    if (done) return reset();
    if (e.detail === 0) return confirm();
    clearTimeout(nudge);
    set(0.18);
    nudge = window.setTimeout(() => {
      if (!done) set(0);
    }, 180);
  };

  const ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  knob.addEventListener('pointerdown', down);
  knob.addEventListener('pointermove', move);
  knob.addEventListener('pointerup', up);
  knob.addEventListener('pointercancel', up);
  knob.addEventListener('click', click);

  return () => {
    ro.disconnect();
    clearTimeout(nudge);
    knob.removeEventListener('pointerdown', down);
    knob.removeEventListener('pointermove', move);
    knob.removeEventListener('pointerup', up);
    knob.removeEventListener('pointercancel', up);
    knob.removeEventListener('click', click);
    reset();
  };
}
