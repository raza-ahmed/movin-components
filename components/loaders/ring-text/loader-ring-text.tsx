"use client";

import type { CSSProperties } from 'react';

const css = `
  .loader-ring-text {
    --loader-ring-text-t: 10s;
    position: relative;
    display: inline-block;
    width: 76px;
    height: 76px;
  }

  /* Breathing centre dot. */
  .loader-ring-text::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
    border-radius: 50%;
    background: #ededed;
    animation: loader-ring-text-breathe 1.6s ease-in-out infinite;
  }

  .loader-ring-text__ring {
    position: absolute;
    inset: 0;
    animation: loader-ring-text-turn var(--loader-ring-text-t) linear infinite;
  }

  /* Every letter starts at the centre, turns to its slot and steps out to the rim. */
  .loader-ring-text__ring span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 12px;
    margin: -6px 0 0 -5px;
    color: #4d4d4d;
    font-size: 9.5px;
    font-weight: 600;
    line-height: 12px;
    text-align: center;
    transform: rotate(calc(var(--loader-ring-text-i) * 360deg / var(--loader-ring-text-n))) translateY(-31px);
    animation: loader-ring-text-chase 2s linear infinite;
    animation-delay: calc(var(--loader-ring-text-i) * -2s / var(--loader-ring-text-n));
  }

  @keyframes loader-ring-text-turn {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes loader-ring-text-chase {
    0% {
      color: #f6f6f6;
    }
    30%,
    100% {
      color: #4d4d4d;
    }
  }

  @keyframes loader-ring-text-breathe {
    50% {
      transform: scale(0.6);
      opacity: 0.6;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-ring-text__ring,
    .loader-ring-text__ring span,
    .loader-ring-text::after {
      animation: none;
    }
    .loader-ring-text__ring span {
      color: #a7a7a7;
    }
  }
`;

const TEXT = 'LOADING · PLEASE WAIT · ';

export function RingTextLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-ring-text" role="status" aria-label="Loading">
        <div className="loader-ring-text__ring" style={{ '--loader-ring-text-n': TEXT.length } as CSSProperties} aria-hidden="true">
          {TEXT.split('').map((c, i) => (
            <span key={i} style={{ '--loader-ring-text-i': i } as CSSProperties}>
              {c === ' ' ? '\u00a0' : c}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
