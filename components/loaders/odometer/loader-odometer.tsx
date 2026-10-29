"use client";

import { useEffect, useState } from 'react';

const css = `
  .loader-odometer {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .loader-odometer__window {
    display: flex;
    gap: 2px;
    padding: 4px;
    border-radius: 8px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), inset 0 6px 8px -6px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
  }
  .loader-odometer__reel {
    position: relative;
    width: 20px;
    height: 30px;
    overflow: hidden;
    border-radius: 4px;
    background: light-dark(#f3f4f7, #1a1c1f);
    /* Shade top and bottom like a drum curving away. */
    mask-image: linear-gradient(transparent, #000 22%, #000 78%, transparent);
  }
  .loader-odometer__strip {
    display: flex;
    flex-direction: column;
    transition: transform 0.32s cubic-bezier(0.34, 1.3, 0.64, 1);
  }
  .loader-odometer__strip span {
    display: grid;
    place-items: center;
    height: 30px;
    color: light-dark(#373a40, #f1f2f3);
    font-size: 18px;
    font-weight: 600;
  }
  .loader-odometer__unit { align-self: center; padding: 0 3px 0 4px; color: light-dark(#5f626a, #a7abb2); font-size: 14px; }
  .loader-odometer__label { font-size: 9px; letter-spacing: 0.3em; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) { .loader-odometer__strip { transition: none; } }
`;

// Each reel carries 0–9 and a second 0, so 9 → 0 can roll forward before snapping back.
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

function Reel({ value }: { value: number }) {
  return (
    <span className="loader-odometer__reel">
      <span className="loader-odometer__strip" style={{ transform: `translateY(${-value * 30}px)` }}>
        {DIGITS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
    </span>
  );
}

export function OdometerLoader() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(42);
    // Count in uneven jumps, like a real transfer, then hold at 100 and start again.
    const id = window.setInterval(() => setN((v) => (v >= 100 ? 0 : Math.min(100, v + 1 + Math.floor(Math.random() * 4)))), 140);
    return () => clearInterval(id);
  }, []);

  const digits = String(n).padStart(3, '0').split('').map(Number);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-odometer" role="status" aria-label="Loading">
        <span className="loader-odometer__label" aria-hidden="true">
          LOADING
        </span>
        <span className="loader-odometer__window" aria-hidden="true">
          {digits.map((d, i) => (
            <Reel key={i} value={d} />
          ))}
          <span className="loader-odometer__unit">%</span>
        </span>
      </div>
    </>
  );
}
