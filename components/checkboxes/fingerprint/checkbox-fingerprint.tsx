"use client";

import { useEffect, useRef, type CSSProperties } from 'react';

const css = `
  .cb-fingerprint {
    --cb-fingerprint-hold: 700ms;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
  }

  .cb-fingerprint__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .cb-fingerprint__pad {
    position: relative;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border: 1px solid #3a3a3a;
    border-radius: 50%;
    background: #202020;
    transition: border-color 0.3s, scale 0.2s;
  }

  .cb-fingerprint__input:focus-visible + .cb-fingerprint__pad {
    outline: 2px solid #a7a7a7;
    outline-offset: 3px;
  }

  .cb-fingerprint__pad > svg {
    width: 34px;
    height: 34px;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  /* Each ridge lights after the one inside it: the delay is its ring number. */
  .cb-fingerprint__ridge {
    stroke: #4d4d4d;
    transition: stroke 0.25s ease-in;
  }

  .cb-fingerprint--holding .cb-fingerprint__pad {
    scale: 0.95;
  }

  .cb-fingerprint--holding .cb-fingerprint__ridge,
  .cb-fingerprint__input:checked + .cb-fingerprint__pad .cb-fingerprint__ridge {
    stroke: #ededed;
    transition: stroke 0.12s ease-out calc(var(--cb-fingerprint-i) * var(--cb-fingerprint-hold) / 7);
  }

  .cb-fingerprint__input:checked + .cb-fingerprint__pad {
    border-color: #7c7c7c;
  }

  .cb-fingerprint__badge {
    position: absolute;
    right: -3px;
    bottom: -3px;
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border: 2px solid #111111;
    border-radius: 50%;
    background: #ededed;
    transform: scale(0);
    transition: transform 0.15s ease-in;
  }

  .cb-fingerprint__badge svg {
    width: 11px;
    height: 11px;
    fill: none;
    stroke: #111111;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cb-fingerprint__input:checked + .cb-fingerprint__pad .cb-fingerprint__badge {
    transform: scale(1);
    transition: transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1);
  }

  .cb-fingerprint__label {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cb-fingerprint__hint {
    color: #7c7c7c;
    font-size: 12px;
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-fingerprint__pad,
    .cb-fingerprint__badge,
    .cb-fingerprint__ridge,
    .cb-fingerprint--holding .cb-fingerprint__ridge {
      transition-duration: 0s !important;
    }
  }
`;

// Ridges from the centre outwards; the index sets when each one lights.
const RIDGES = [
  'M20 22v4',
  'M16 25c0-3 1-7 4-7s4 3 4 6',
  'M13 27c-1-6 1-12 7-12s8 5 7 11',
  'M10 25c-1-8 3-14 10-14s11 6 10 13',
  'M8 19c2-6 6-10 12-10s10 4 12 10',
  'M11 8c3-2 6-3 9-3s6 1 9 3',
  'M17 33c2-2 3-5 3-8M23 33c1-2 1-4 1-6',
];

export function FingerprintCheckbox() {
  const ref = useRef<HTMLLabelElement>(null);
  useEffect(() => (ref.current ? initFingerprint(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <label ref={ref} className="cb-fingerprint">
        <input className="cb-fingerprint__input" type="checkbox" />
        <span className="cb-fingerprint__pad" aria-hidden="true">
          <svg viewBox="0 0 40 40">
            {RIDGES.map((d, i) => (
              <path key={i} className="cb-fingerprint__ridge" style={{ '--cb-fingerprint-i': i } as CSSProperties} d={d} />
            ))}
          </svg>
          <span className="cb-fingerprint__badge">
            <svg viewBox="0 0 12 12">
              <path d="M2.5 6.2l2.2 2.2 4.8-5" />
            </svg>
          </span>
        </span>
        <span className="cb-fingerprint__label">
          <span className="cb-fingerprint__title">Confirm payment</span>
          <span className="cb-fingerprint__hint">Press and hold</span>
        </span>
      </label>
    </>
  );
}

// Holding for --cb-fingerprint-hold toggles it and fires change like a click.
// A pointer click alone does nothing; keyboard clicks (detail 0) pass through.
function initFingerprint(root: HTMLElement): (() => void) | undefined {
  const input = root.querySelector<HTMLInputElement>('.cb-fingerprint__input');
  if (!input) return;
  let timer = 0;
  let holding = false;

  const hold = () => {
    const ms = parseFloat(getComputedStyle(root).getPropertyValue('--cb-fingerprint-hold')) || 700;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms;
  };
  const stop = () => {
    window.clearTimeout(timer);
    holding = false;
    root.classList.remove('cb-fingerprint--holding');
  };
  const down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    holding = true;
    root.classList.add('cb-fingerprint--holding');
    timer = window.setTimeout(() => {
      stop();
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, hold());
  };
  const click = (e: MouseEvent) => {
    if (e.detail !== 0) e.preventDefault();
  };
  // A long press must not open the touch context menu mid-hold.
  const menu = (e: Event) => {
    if (holding) e.preventDefault();
  };

  root.addEventListener('pointerdown', down);
  root.addEventListener('pointerup', stop);
  root.addEventListener('pointerleave', stop);
  root.addEventListener('pointercancel', stop);
  root.addEventListener('click', click);
  root.addEventListener('contextmenu', menu);
  return () => {
    stop();
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointerup', stop);
    root.removeEventListener('pointerleave', stop);
    root.removeEventListener('pointercancel', stop);
    root.removeEventListener('click', click);
    root.removeEventListener('contextmenu', menu);
  };
}
