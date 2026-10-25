"use client";

import { useEffect, useRef, type CSSProperties } from 'react';

const css = `
  .btn-goo {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 168px;
    height: 56px;
    padding: 0;
    border: 0;
    background: none;
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-goo:focus-visible {
    outline: 2px solid light-dark(#42454c, #e5e6e9);
    outline-offset: 6px;
    border-radius: 999px;
  }

  /* Everything inside is blurred, then the alpha is thresholded back to a hard
     edge: shapes that come near each other melt into one. */
  .btn-goo__blobs {
    position: absolute;
    inset: 0;
    filter: url(#btn-goo-filter);
  }

  .btn-goo__body {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: light-dark(#42454c, #e5e6e9);
    transition: scale 0.5s cubic-bezier(0.3, 1.6, 0.5, 1);
  }

  .btn-goo:hover .btn-goo__body {
    scale: 1.03 1.06;
  }

  .btn-goo__drop,
  .btn-goo__shot {
    position: absolute;
    top: 50%;
    border-radius: 50%;
    background: light-dark(#42454c, #e5e6e9);
  }

  .btn-goo__drop {
    left: var(--btn-goo-x);
    width: var(--btn-goo-s);
    height: var(--btn-goo-s);
    margin: calc(var(--btn-goo-s) / -2) 0 0 calc(var(--btn-goo-s) / -2);
    transition: translate 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) var(--btn-goo-d);
    animation: btn-goo-bob 1.8s ease-in-out var(--btn-goo-d) infinite alternate;
  }

  .btn-goo:hover .btn-goo__drop,
  .btn-goo:focus-visible .btn-goo__drop {
    translate: var(--btn-goo-dx) var(--btn-goo-dy);
  }

  .btn-goo__shot {
    left: calc(100% - 30px);
    width: 26px;
    height: 26px;
    margin: -13px 0 0 -13px;
    scale: 0;
  }

  .btn-goo__label {
    position: relative;
    pointer-events: none;
  }

  .btn-goo__defs {
    position: absolute;
    width: 0;
    height: 0;
  }

  .btn-goo--fire .btn-goo__shot {
    animation: btn-goo-shot 0.9s cubic-bezier(0.3, 0.6, 0.3, 1);
  }

  .btn-goo--fire .btn-goo__body {
    animation: btn-goo-gulp 0.6s cubic-bezier(0.3, 1.5, 0.5, 1);
  }

  @keyframes btn-goo-bob {
    from {
      scale: 0.8;
    }
    to {
      scale: 1.15;
    }
  }

  @keyframes btn-goo-shot {
    0% {
      translate: 0 0;
      scale: 0.6;
    }
    35% {
      translate: 46px 0;
      scale: 1.1 0.9;
    }
    100% {
      translate: 96px -14px;
      scale: 0;
    }
  }

  @keyframes btn-goo-gulp {
    0% {
      scale: 1;
    }
    30% {
      scale: 0.94 1.08;
    }
    100% {
      scale: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-goo *,
    .btn-goo *::before,
    .btn-goo *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

const DROPS = [
  { x: '20%', s: '20px', dx: '0px', dy: '-34px', d: '0ms' },
  { x: '44%', s: '24px', dx: '4px', dy: '36px', d: '70ms' },
  { x: '66%', s: '16px', dx: '-2px', dy: '-32px', d: '140ms' },
  { x: '9%', s: '18px', dx: '-30px', dy: '8px', d: '40ms' },
  { x: '84%', s: '18px', dx: '6px', dy: '32px', d: '100ms' },
];

export function GooButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // Replay the shot on every click: drop the class, force a reflow, add it back.
    const fire = () => {
      root.classList.remove('btn-goo--fire');
      void root.offsetWidth;
      root.classList.add('btn-goo--fire');
    };
    const done = (e: AnimationEvent) => {
      if (e.animationName === 'btn-goo-shot') root.classList.remove('btn-goo--fire');
    };
    root.addEventListener('click', fire);
    root.addEventListener('animationend', done);
    return () => {
      root.removeEventListener('click', fire);
      root.removeEventListener('animationend', done);
    };
  }, []);
  return (
    <>
      <style>{css}</style>
      <button ref={ref} className="btn-goo" type="button">
        <span className="btn-goo__blobs" aria-hidden="true">
          <span className="btn-goo__body" />
          {DROPS.map((d) => (
            <span
              key={d.x}
              className="btn-goo__drop"
              style={{ '--btn-goo-x': d.x, '--btn-goo-s': d.s, '--btn-goo-dx': d.dx, '--btn-goo-dy': d.dy, '--btn-goo-d': d.d } as CSSProperties}
            />
          ))}
          <span className="btn-goo__shot" />
        </span>
        <span className="btn-goo__label">Send it</span>
        <svg className="btn-goo__defs" aria-hidden="true" focusable="false">
          <filter id="btn-goo-filter" x="-60%" y="-150%" width="220%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
        </svg>
      </button>
    </>
  );
}
