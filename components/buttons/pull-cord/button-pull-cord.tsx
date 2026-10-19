"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-pull-cord {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 64px;
  }

  .btn-pull-cord__button {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 168px;
    height: 56px;
    padding: 0;
    border: 1px solid #3a3a3a;
    border-radius: 14px;
    background: #202020;
    color: #a7a7a7;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.35s, color 0.35s, border-color 0.35s, box-shadow 0.6s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-pull-cord__button:focus-visible {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  .btn-pull-cord__button > span {
    grid-area: 1 / 1;
    transition: opacity 0.3s, translate 0.3s;
  }

  .btn-pull-cord__on {
    opacity: 0;
    translate: 0 6px;
  }

  .btn-pull-cord__button[aria-pressed='true'] {
    border-color: #ededed;
    background: #ededed;
    box-shadow: 0 0 48px 6px rgba(237, 237, 237, 0.26), 0 20px 70px rgba(237, 237, 237, 0.16);
    color: #111111;
  }

  .btn-pull-cord__button[aria-pressed='true'] .btn-pull-cord__off {
    opacity: 0;
    translate: 0 -6px;
  }

  .btn-pull-cord__button[aria-pressed='true'] .btn-pull-cord__on {
    opacity: 1;
    translate: 0 0;
  }

  .btn-pull-cord__cord {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }

  .btn-pull-cord__line {
    fill: none;
    stroke: #7c7c7c;
    stroke-width: 1.5;
    stroke-linecap: round;
  }

  .btn-pull-cord__bead {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border-radius: 50%;
    background: #c9c9c9;
    box-shadow: inset 0 -2px 0 rgba(17, 17, 17, 0.3);
    cursor: grab;
    touch-action: none;
    transform: translate(var(--btn-pull-cord-x, 84px), var(--btn-pull-cord-y, 100px));
    transition: background-color 0.2s, scale 0.2s;
  }

  .btn-pull-cord__bead:active {
    cursor: grabbing;
  }

  /* Pulled far enough: letting go now will switch it. */
  .btn-pull-cord--armed .btn-pull-cord__bead {
    background: #f6f6f6;
    scale: 1.2;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-pull-cord__button,
    .btn-pull-cord__button > span,
    .btn-pull-cord__bead {
      transition: none;
    }
  }
`;

export function PullCordButton() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initPullCord(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="btn-pull-cord">
        <button className="btn-pull-cord__button" type="button" aria-pressed="false">
          <span className="btn-pull-cord__off">Lights off</span>
          <span className="btn-pull-cord__on">Lights on</span>
        </button>
        <svg className="btn-pull-cord__cord" aria-hidden="true" focusable="false">
          <path className="btn-pull-cord__line" />
        </svg>
        <span className="btn-pull-cord__bead" aria-hidden="true" />
      </div>
    </>
  );
}

// The bead hangs on a spring below the button. Drag it down past PULL and let
// go to toggle aria-pressed; it springs back and sways. Clicking the button
// toggles too (and tugs the cord), so keyboard users get the same switch.
function initPullCord(root: HTMLElement): (() => void) | undefined {
  const button = root.querySelector<HTMLButtonElement>('.btn-pull-cord__button');
  const bead = root.querySelector<HTMLElement>('.btn-pull-cord__bead');
  const line = root.querySelector<SVGPathElement>('.btn-pull-cord__line');
  if (!button || !bead || !line) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LENGTH = 44;
  const PULL = 34;
  const anchor = { x: 0, y: 0 };
  const p = { x: 0, y: 0 };
  const v = { x: 0, y: 0 };
  let grab: { x: number; y: number; t: number } | null = null;
  let raf = 0;
  let last = 0;

  const draw = () => {
    // The cord sags sideways against the bead's swing.
    const cx = (anchor.x + p.x) / 2 - v.x * 0.04;
    const cy = (anchor.y + p.y) / 2;
    line.setAttribute('d', `M${anchor.x} ${anchor.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
    root.style.setProperty('--btn-pull-cord-x', `${p.x.toFixed(1)}px`);
    root.style.setProperty('--btn-pull-cord-y', `${p.y.toFixed(1)}px`);
    root.classList.toggle('btn-pull-cord--armed', !!grab && p.y - anchor.y - LENGTH > PULL);
  };

  const tick = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    const rx = anchor.x;
    const ry = anchor.y + LENGTH;
    v.x += (160 * (rx - p.x) - 5 * v.x) * dt; // a loose pendulum
    v.y += (420 * (ry - p.y) - 14 * v.y) * dt;
    p.x += v.x * dt;
    p.y += v.y * dt;
    draw();
    if (Math.abs(v.x) + Math.abs(v.y) > 0.5 || Math.abs(rx - p.x) + Math.abs(ry - p.y) > 0.1) raf = requestAnimationFrame(tick);
    else {
      raf = 0;
      p.x = rx;
      p.y = ry;
      draw();
    }
  };

  const kick = () => {
    if (reduce) {
      p.x = anchor.x;
      p.y = anchor.y + LENGTH;
      v.x = v.y = 0;
      draw();
      return;
    }
    if (!raf && !grab) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };

  const toggle = () => button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');

  const local = (e: PointerEvent) => {
    const box = root.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const down = (e: PointerEvent) => {
    const at = local(e);
    grab = { x: at.x - p.x, y: at.y - p.y, t: performance.now() };
    bead.setPointerCapture(e.pointerId);
    cancelAnimationFrame(raf);
    raf = 0;
    v.x = v.y = 0;
  };

  const move = (e: PointerEvent) => {
    if (!grab) return;
    const at = local(e);
    let nx = at.x - grab.x;
    let ny = Math.max(anchor.y + 12, at.y - grab.y);
    // The cord stretches, but only so far.
    const dx = nx - anchor.x;
    const dy = ny - anchor.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    const max = LENGTH + 80;
    if (d > max) {
      nx = anchor.x + (dx / d) * max;
      ny = anchor.y + (dy / d) * max;
    }
    const now = performance.now();
    const ms = Math.max(8, now - grab.t);
    v.x = ((nx - p.x) / ms) * 1000;
    v.y = ((ny - p.y) / ms) * 1000;
    grab.t = now;
    p.x = nx;
    p.y = ny;
    draw();
  };

  const up = () => {
    if (!grab) return;
    const pulled = p.y - anchor.y - LENGTH > PULL;
    grab = null;
    root.classList.remove('btn-pull-cord--armed');
    if (pulled) toggle();
    kick();
  };

  const click = () => {
    toggle();
    v.y += 320; // a tug on the cord
    kick();
  };

  const measure = () => {
    anchor.x = button.offsetLeft + button.offsetWidth / 2;
    anchor.y = button.offsetTop + button.offsetHeight;
    if (!raf && !grab) {
      p.x = anchor.x;
      p.y = anchor.y + LENGTH;
    }
    draw();
  };

  const ro = new ResizeObserver(measure);
  ro.observe(root);
  measure();
  bead.addEventListener('pointerdown', down);
  bead.addEventListener('pointermove', move);
  bead.addEventListener('pointerup', up);
  bead.addEventListener('pointercancel', up);
  button.addEventListener('click', click);

  return () => {
    ro.disconnect();
    cancelAnimationFrame(raf);
    bead.removeEventListener('pointerdown', down);
    bead.removeEventListener('pointermove', move);
    bead.removeEventListener('pointerup', up);
    bead.removeEventListener('pointercancel', up);
    button.removeEventListener('click', click);
  };
}
