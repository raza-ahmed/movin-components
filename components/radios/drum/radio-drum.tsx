"use client";

import { useEffect, useId, useRef, type CSSProperties } from 'react';

const css = `
  /* Each option sits on a cylinder (a step of 22deg at radius 78px fits 30px
     rows); the wheel turns so the chosen option faces you in the band. */
  .radio-drum {
    --radio-drum-sel: 0;
    --radio-drum-step: 22deg;
    --radio-drum-r: 78px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #a7a7a7;
    font-size: 12px;
  }

  .radio-drum__window {
    position: relative;
    width: 160px;
    height: 156px;
    overflow: hidden;
    border-radius: 14px;
    background: #202020;
    perspective: 480px;
    cursor: ns-resize;
    touch-action: none;
    user-select: none;
    mask-image: linear-gradient(transparent, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 70%, transparent);
  }

  .radio-drum__band {
    position: absolute;
    top: 50%;
    left: 8px;
    right: 8px;
    height: 32px;
    margin-top: -16px;
    border-radius: 8px;
    background: #3a3a3a;
  }

  .radio-drum__window:has(.radio-drum__input:focus-visible) .radio-drum__band {
    outline: 2px solid #a7a7a7;
  }

  .radio-drum__wheel {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: translateZ(calc(var(--radio-drum-r) * -1)) rotateX(calc(var(--radio-drum-sel) * var(--radio-drum-step)));
  }

  .radio-drum--ready .radio-drum__wheel {
    transition: transform 0.45s cubic-bezier(0.3, 1.25, 0.5, 1);
  }

  .radio-drum__option {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: grid;
    place-items: center;
    height: 30px;
    margin-top: -15px;
    backface-visibility: hidden;
    cursor: pointer;
    transform: rotateX(calc(var(--radio-drum-i) * var(--radio-drum-step) * -1)) translateZ(var(--radio-drum-r));
  }

  .radio-drum__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .radio-drum__text {
    color: #7c7c7c;
    font-size: 16px;
    transition: color 0.2s;
  }

  .radio-drum__input:checked + .radio-drum__text {
    color: #f6f6f6;
    font-weight: 600;
  }

  @media (prefers-reduced-motion: reduce) {
    .radio-drum--ready .radio-drum__wheel {
      transition: none;
    }
  }
`;

export function DrumRadio() {
  // Each instance gets its own group name, so two on one page stay separate.
  const name = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initDrum(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div className="radio-drum" ref={ref}>
        <span className="radio-drum__title" aria-hidden="true">Remind me in</span>
        <div className="radio-drum__window" role="radiogroup" aria-label="Remind me in">
          <span className="radio-drum__band" aria-hidden="true" />
          <div className="radio-drum__wheel">
            <label className="radio-drum__option" style={{ '--radio-drum-i': 0 } as CSSProperties}>
              <input className="radio-drum__input" type="radio" name={name} value="15 min" />
              <span className="radio-drum__text">15 min</span>
            </label>
            <label className="radio-drum__option" style={{ '--radio-drum-i': 1 } as CSSProperties}>
              <input className="radio-drum__input" type="radio" name={name} value="30 min" />
              <span className="radio-drum__text">30 min</span>
            </label>
            <label className="radio-drum__option" style={{ '--radio-drum-i': 2 } as CSSProperties}>
              <input className="radio-drum__input" type="radio" name={name} value="45 min" />
              <span className="radio-drum__text">45 min</span>
            </label>
            <label className="radio-drum__option" style={{ '--radio-drum-i': 3 } as CSSProperties}>
              <input className="radio-drum__input" type="radio" name={name} value="1 hour" defaultChecked />
              <span className="radio-drum__text">1 hour</span>
            </label>
            <label className="radio-drum__option" style={{ '--radio-drum-i': 4 } as CSSProperties}>
              <input className="radio-drum__input" type="radio" name={name} value="2 hours" />
              <span className="radio-drum__text">2 hours</span>
            </label>
            <label className="radio-drum__option" style={{ '--radio-drum-i': 5 } as CSSProperties}>
              <input className="radio-drum__input" type="radio" name={name} value="4 hours" />
              <span className="radio-drum__text">4 hours</span>
            </label>
            <label className="radio-drum__option" style={{ '--radio-drum-i': 6 } as CSSProperties}>
              <input className="radio-drum__input" type="radio" name={name} value="Tomorrow" />
              <span className="radio-drum__text">Tomorrow</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

// --radio-drum-sel turns the wheel to the checked option. The wheel and a
// vertical drag step through options by checking them (firing change), so
// arrow keys, clicks, wheel and drag all go through the same radios.
function initDrum(root: HTMLElement): (() => void) | undefined {
  const win = root.querySelector<HTMLElement>('.radio-drum__window');
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('.radio-drum__input'));
  if (!win || !inputs.length) return;
  let wheelAcc = 0;
  let drag: { y: number; from: number; moved: boolean } | null = null;

  const index = () => Math.max(0, inputs.findIndex((i) => i.checked));
  const turn = () => root.style.setProperty('--radio-drum-sel', String(index()));
  const pick = (i: number) => {
    const c = Math.max(0, Math.min(inputs.length - 1, i));
    if (inputs[c].checked) return;
    inputs[c].checked = true;
    inputs[c].dispatchEvent(new Event('change', { bubbles: true }));
  };
  // One row per 40px of wheel travel, whichever device sends it.
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) < 40) return;
    pick(index() + (wheelAcc > 0 ? 1 : -1));
    wheelAcc = 0;
  };
  // Drag: one row per 30px; a drag never also counts as a click.
  const swallow = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const down = (e: PointerEvent) => {
    if (e.button === 0) drag = { y: e.clientY, from: index(), moved: false };
  };
  const move = (e: PointerEvent) => {
    if (!drag) return;
    const rows = Math.round((drag.y - e.clientY) / 30);
    if (rows !== 0 && !drag.moved) {
      drag.moved = true;
      win.setPointerCapture(e.pointerId);
    }
    if (drag.moved) pick(drag.from + rows);
  };
  const up = () => {
    if (drag?.moved) {
      win.addEventListener('click', swallow, { capture: true, once: true });
      window.setTimeout(() => win.removeEventListener('click', swallow, { capture: true }), 0);
    }
    drag = null;
  };

  root.addEventListener('change', turn);
  win.addEventListener('wheel', wheel, { passive: false });
  win.addEventListener('pointerdown', down);
  win.addEventListener('pointermove', move);
  win.addEventListener('pointerup', up);
  win.addEventListener('pointercancel', up);
  turn();
  const frame = requestAnimationFrame(() => root.classList.add('radio-drum--ready'));
  return () => {
    cancelAnimationFrame(frame);
    root.removeEventListener('change', turn);
    win.removeEventListener('wheel', wheel);
    win.removeEventListener('pointerdown', down);
    win.removeEventListener('pointermove', move);
    win.removeEventListener('pointerup', up);
    win.removeEventListener('pointercancel', up);
  };
}
