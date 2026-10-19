"use client";

import { useEffect, useRef } from 'react';

const css = `
  .card-holo {
    --card-holo-rx: 0deg;
    --card-holo-ry: 0deg;
    --card-holo-x: 50%;
    --card-holo-y: 50%;
    --card-holo-o: 0;
    display: inline-block;
    perspective: 700px;
  }

  .card-holo__card {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 150px;
    height: 204px;
    padding: 8px;
    overflow: hidden;
    border: 1px solid #4d4d4d;
    border-radius: 12px;
    background: linear-gradient(160deg, #282828, #111111);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transform: rotateX(var(--card-holo-ry)) rotateY(var(--card-holo-rx));
    transition: transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1), box-shadow 0.4s;
  }

  /* While the cursor drives it, follow closely; the spring is for letting go. */
  .card-holo--active .card-holo__card {
    box-shadow: 0 22px 50px rgba(0, 0, 0, 0.55);
    transition: transform 0.08s linear, box-shadow 0.4s;
  }

  .card-holo__art {
    position: relative;
    flex: 1;
    overflow: hidden;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    background: radial-gradient(circle at 50% 45%, #3a3a3a, #202020 70%);
  }

  .card-holo__emblem {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 52px;
    height: 52px;
    margin: -26px 0 0 -26px;
    border: 2px solid #a7a7a7;
    border-radius: 50%;
    background: radial-gradient(circle, #ededed 0 6px, transparent 7px);
    box-shadow: 0 0 0 8px #282828, 0 0 0 9px #4d4d4d, inset 0 0 0 10px #3a3a3a;
  }

  .card-holo__body {
    padding: 0 2px 2px;
  }

  .card-holo__title {
    color: #ededed;
    font-size: 13px;
    font-weight: 600;
  }

  .card-holo__text {
    margin-top: 2px;
    color: #a7a7a7;
    font-size: 11px;
  }

  /* Light bands + a sparkle screen, dodged onto the card; they slide with the tilt. */
  .card-holo__foil {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: repeating-linear-gradient(115deg, rgba(246, 246, 246, 0) 0%, rgba(246, 246, 246, 0.5) 4%, rgba(246, 246, 246, 0) 8%, rgba(167, 167, 167, 0.3) 12%, rgba(246, 246, 246, 0) 16%), radial-gradient(circle, rgba(246, 246, 246, 0.28) 0.5px, transparent 0.9px);
    background-position: var(--card-holo-x) var(--card-holo-y), 0 0;
    background-size: 400% 400%, 5px 5px;
    mix-blend-mode: color-dodge;
    opacity: var(--card-holo-o);
    transition: opacity 0.4s;
  }

  .card-holo__glare {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at var(--card-holo-x) var(--card-holo-y), rgba(246, 246, 246, 0.45), transparent 55%);
    mix-blend-mode: overlay;
    opacity: var(--card-holo-o);
    transition: opacity 0.4s;
  }

  @media (prefers-reduced-motion: reduce) {
    .card-holo__card,
    .card-holo--active .card-holo__card {
      transition: none;
    }
  }
`;

export function HoloCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initHolo(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="card-holo">
        <div className="card-holo__card">
          <div className="card-holo__art" aria-hidden="true">
            <span className="card-holo__emblem" />
          </div>
          <div className="card-holo__body">
            <div className="card-holo__title">Rare Find</div>
            <div className="card-holo__text">No. 001 of 250</div>
          </div>
          <div className="card-holo__foil" aria-hidden="true" />
          <div className="card-holo__glare" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

// The pointer drives the tilt, the foil's background position and the glare
// through CSS variables; leaving springs it flat on the CSS transition.
function initHolo(root: HTMLElement): (() => void) | undefined {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const set = (k: string, v: string) => root.style.setProperty(`--card-holo-${k}`, v);

  const move = (e: PointerEvent) => {
    const box = root.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
    const py = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
    root.classList.add('card-holo--active');
    set('rx', `${((px - 0.5) * 28).toFixed(2)}deg`);
    set('ry', `${((0.5 - py) * 28).toFixed(2)}deg`);
    set('x', `${(px * 100).toFixed(1)}%`);
    set('y', `${(py * 100).toFixed(1)}%`);
    set('o', '1');
  };

  const leave = () => {
    root.classList.remove('card-holo--active');
    set('rx', '0deg');
    set('ry', '0deg');
    set('o', '0');
  };

  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return () => {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    leave();
  };
}
