"use client";

import { useEffect, useRef } from 'react';

const css = `
  @property --card-lenticular-t {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }

  .card-lenticular {
    --card-lenticular-t: 0;
    --card-lenticular-r: 0deg;
    --card-lenticular-x: 50%;
    display: inline-flex;
    flex-direction: column;
    gap: 10px;
    outline: none;
    perspective: 600px;
    transition: --card-lenticular-t 0.18s linear;
  }

  .card-lenticular__card {
    position: relative;
    width: 176px;
    height: 128px;
    overflow: hidden;
    border: 1px solid #4d4d4d;
    border-radius: 12px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
    transform: rotateY(var(--card-lenticular-r));
    transition: transform 0.5s cubic-bezier(0.3, 1.3, 0.5, 1);
  }

  .card-lenticular:focus-visible .card-lenticular__card {
    outline: 2px solid #ededed;
    outline-offset: 4px;
  }

  .card-lenticular__scene {
    position: absolute;
    inset: 0;
  }

  .card-lenticular__scene--day {
    background: linear-gradient(180deg, #c9c9c9, #ededed 70%);
  }

  /* Night shows through strips that widen with t: 0 = all day, 1 = all night,
     in between the interleaved flicker of a real lenticular print. */
  .card-lenticular__scene--night {
    background: linear-gradient(180deg, #111111, #282828 75%);
    -webkit-mask-image: repeating-linear-gradient(90deg, #000 0 calc(var(--card-lenticular-t) * 6px), transparent calc(var(--card-lenticular-t) * 6px) 6px);
    mask-image: repeating-linear-gradient(90deg, #000 0 calc(var(--card-lenticular-t) * 6px), transparent calc(var(--card-lenticular-t) * 6px) 6px);
  }

  .card-lenticular__sun {
    position: absolute;
    top: 26px;
    left: 50%;
    width: 34px;
    height: 34px;
    margin-left: -17px;
    border-radius: 50%;
    background: #f6f6f6;
    box-shadow: 0 0 0 6px rgba(246, 246, 246, 0.5), 0 0 0 14px rgba(246, 246, 246, 0.25);
  }

  .card-lenticular__moon {
    position: absolute;
    top: 24px;
    left: 50%;
    width: 34px;
    height: 34px;
    margin-left: -17px;
    border-radius: 50%;
    box-shadow: inset -9px 4px 0 0 #ededed;
  }

  .card-lenticular__stars {
    position: absolute;
    inset: 0 0 40% 0;
    background-image: radial-gradient(circle, #c9c9c9 0.8px, transparent 1.3px), radial-gradient(circle, #7c7c7c 0.7px, transparent 1.2px);
    background-position: 3px 5px, 14px 17px;
    background-size: 23px 19px, 31px 23px;
  }

  .card-lenticular__hill {
    position: absolute;
    right: -20%;
    bottom: -46px;
    left: -20%;
    height: 90px;
    border-radius: 50%;
  }

  .card-lenticular__scene--day .card-lenticular__hill {
    background: #7c7c7c;
  }

  .card-lenticular__scene--night .card-lenticular__hill {
    background: #3a3a3a;
  }

  /* The plastic: fine ridges, plus a sheen that slides along them. */
  .card-lenticular__ridges {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(100deg, transparent calc(var(--card-lenticular-x) - 18%), rgba(246, 246, 246, 0.22) var(--card-lenticular-x), transparent calc(var(--card-lenticular-x) + 18%)), repeating-linear-gradient(90deg, rgba(246, 246, 246, 0.07) 0 1px, transparent 1px 3px, rgba(17, 17, 17, 0.12) 3px 4px, transparent 4px 6px);
  }

  .card-lenticular__caption {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 4px;
  }

  .card-lenticular__title {
    color: #ededed;
    font-size: 13px;
    font-weight: 600;
  }

  .card-lenticular__text {
    color: #a7a7a7;
    font-size: 11px;
  }

  /* Keyboard: focus flips it to night. */
  .card-lenticular:focus-visible {
    --card-lenticular-t: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .card-lenticular,
    .card-lenticular__card {
      transition: none;
    }
  }
`;

export function LenticularCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initLenticular(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="card-lenticular" tabIndex={0} aria-label="Lenticular card: day turns to night as it tilts">
        <div className="card-lenticular__card">
          <div className="card-lenticular__scene card-lenticular__scene--day" aria-hidden="true">
            <span className="card-lenticular__sun" />
            <span className="card-lenticular__hill" />
          </div>
          <div className="card-lenticular__scene card-lenticular__scene--night" aria-hidden="true">
            <span className="card-lenticular__stars" />
            <span className="card-lenticular__moon" />
            <span className="card-lenticular__hill" />
          </div>
          <div className="card-lenticular__ridges" aria-hidden="true" />
        </div>
        <div className="card-lenticular__caption">
          <span className="card-lenticular__title">Day &amp; Night</span>
          <span className="card-lenticular__text">Move across to tilt</span>
        </div>
      </div>
    </>
  );
}

// Cursor x -> t (0 day, 1 night) through a narrow smoothstep, like a real
// lenticular flipping over a few degrees; the night strips widen with t.
function initLenticular(root: HTMLElement): () => void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const move = (e: PointerEvent) => {
    const box = root.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
    const k = Math.max(0, Math.min(1, (px - 0.38) / 0.24));
    root.style.setProperty('--card-lenticular-t', (k * k * (3 - 2 * k)).toFixed(3));
    root.style.setProperty('--card-lenticular-x', `${(px * 100).toFixed(1)}%`);
    if (!reduce) root.style.setProperty('--card-lenticular-r', `${((px - 0.5) * 22).toFixed(2)}deg`);
  };
  const leave = () => {
    root.style.removeProperty('--card-lenticular-t');
    root.style.removeProperty('--card-lenticular-x');
    root.style.removeProperty('--card-lenticular-r');
  };
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  return () => {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    leave();
  };
}
