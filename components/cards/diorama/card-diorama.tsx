"use client";

import { useEffect, useRef } from 'react';

const css = `
  .card-diorama {
    --card-diorama-rx: 0deg;
    --card-diorama-ry: 0deg;
    --card-diorama-z: 0px;
    display: inline-block;
    outline: none;
    perspective: 800px;
  }

  .card-diorama__card {
    position: relative;
    width: 172px;
    height: 136px;
    transform: rotateX(var(--card-diorama-rx)) rotateY(var(--card-diorama-ry));
    transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.3, 1.3, 0.5, 1);
  }

  .card-diorama:hover,
  .card-diorama:focus-visible {
    --card-diorama-rx: 16deg;
    --card-diorama-ry: -22deg;
    --card-diorama-z: 24px;
  }

  /* While the cursor steers, follow it quickly. */
  .card-diorama--steer .card-diorama__card {
    transition: transform 0.15s ease-out;
  }

  .card-diorama__layer {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    transition: transform 0.7s cubic-bezier(0.3, 1.3, 0.5, 1);
  }

  .card-diorama__layer--sky {
    overflow: hidden;
    background: linear-gradient(180deg, light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529));
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
  }

  .card-diorama__layer--far {
    filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.35));
    transform: translateZ(var(--card-diorama-z));
  }

  .card-diorama__layer--near {
    filter: drop-shadow(0 -3px 5px rgba(0, 0, 0, 0.45));
    transform: translateZ(calc(var(--card-diorama-z) * 2));
  }

  .card-diorama__layer--frame {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 1px;
    padding: 0 12px 7px;
    border: 8px solid light-dark(#42454c, #e5e6e9);
    border-bottom-width: 34px;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
    transform: translateZ(calc(var(--card-diorama-z) * 3));
  }

  .card-diorama__shape {
    position: absolute;
    inset: 0;
    border-radius: 12px;
  }

  .card-diorama__layer--far .card-diorama__shape {
    background: light-dark(#6d7179, #7d8087);
    clip-path: polygon(0 62%, 14% 44%, 26% 54%, 42% 30%, 58% 50%, 70% 38%, 86% 52%, 100% 40%, 100% 100%, 0 100%);
  }

  .card-diorama__layer--near .card-diorama__shape {
    background: light-dark(#f3f4f7, #1a1c1f);
    clip-path: polygon(0 74%, 18% 62%, 34% 72%, 52% 58%, 70% 70%, 84% 62%, 100% 70%, 100% 100%, 0 100%);
  }

  .card-diorama__sun {
    position: absolute;
    top: 18px;
    right: 34px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: light-dark(#50535b, #c6c8cd);
  }

  /* The text sits in the frame's deep bottom border. */
  .card-diorama__title,
  .card-diorama__text {
    position: relative;
    margin: 0 -12px;
    transform: translateY(34px);
    /* The border's own colour, so the text has a real background behind it. */
    background: light-dark(#42454c, #e5e6e9);
  }

  .card-diorama__title {
    color: light-dark(#fbfcfd, #121417);
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
  }

  .card-diorama__text {
    color: light-dark(#cbced3, #393c41);
    font-size: 10px;
    line-height: 1.2;
  }

  .card-diorama:focus-visible .card-diorama__layer--sky {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    .card-diorama__card,
    .card-diorama__layer {
      transition: none;
    }
  }
`;

export function DioramaCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Around the hover pose, the cursor steers the turn a little more each way.
    const move = (e: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const px = (e.clientX - box.left) / box.width - 0.5;
      const py = (e.clientY - box.top) / box.height - 0.5;
      root.classList.add('card-diorama--steer');
      root.style.setProperty('--card-diorama-rx', `${(16 - py * 18).toFixed(2)}deg`);
      root.style.setProperty('--card-diorama-ry', `${(-22 + px * 30).toFixed(2)}deg`);
    };
    const leave = () => {
      root.classList.remove('card-diorama--steer');
      root.style.removeProperty('--card-diorama-rx');
      root.style.removeProperty('--card-diorama-ry');
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    return () => {
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      leave();
    };
  }, []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="card-diorama" tabIndex={0}>
        <div className="card-diorama__card">
          <div className="card-diorama__layer card-diorama__layer--sky" aria-hidden="true">
            <span className="card-diorama__sun" />
          </div>
          <div className="card-diorama__layer card-diorama__layer--far" aria-hidden="true">
            <span className="card-diorama__shape" />
          </div>
          <div className="card-diorama__layer card-diorama__layer--near" aria-hidden="true">
            <span className="card-diorama__shape" />
          </div>
          <div className="card-diorama__layer card-diorama__layer--frame">
            <span className="card-diorama__title">Highlands</span>
            <span className="card-diorama__text">Four layers deep</span>
          </div>
        </div>
      </div>
    </>
  );
}
