"use client";

import * as React from "react";
import { useMemo, useState } from 'react';

const css = `
  .card-qr-assemble {
    display: grid;
    justify-items: center;
    gap: 10px;
    width: 176px;
    padding: 14px 14px 12px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    cursor: pointer;
  }
  .card-qr-assemble:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-qr-assemble__code {
    position: relative;
    display: grid;
    grid-template-columns: repeat(21, 5px);
    grid-auto-rows: 5px;
    padding: 6px;
    border-radius: 8px;
    background: light-dark(#fbfcfd, #121417);
  }
  .card-qr-assemble__m {
    background: light-dark(#373a40, #f1f2f3);
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.3s ease var(--d), transform 0.3s cubic-bezier(0.34, 1.5, 0.64, 1) var(--d);
  }
  .card-qr-assemble__m[data-on] { opacity: 1; transform: none; }
  .card-qr-assemble__finder {
    position: absolute;
    width: 35px;
    height: 35px;
    box-shadow: inset 0 0 0 5px light-dark(#373a40, #f1f2f3);
    opacity: 0;
    transform: scale(1.6) rotate(45deg);
    transition: opacity 0.3s ease, transform 0.45s cubic-bezier(0.34, 1.5, 0.64, 1);
  }
  .card-qr-assemble__finder::after {
    content: '';
    position: absolute;
    inset: 10px;
    background: light-dark(#373a40, #f1f2f3);
  }
  .card-qr-assemble[data-ready] .card-qr-assemble__finder { opacity: 1; transform: none; transition-delay: 0.45s; }
  .card-qr-assemble__label { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-qr-assemble__hint { color: light-dark(#5f626a, #a7abb2); font-size: 11px; margin-top: -8px; }
  @media (prefers-reduced-motion: reduce) {
    .card-qr-assemble__m, .card-qr-assemble__finder { transition: none; }
  }
`;

const N = 21;
const inFinder = (x: number, y: number) =>
  (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);

export function QrAssembleCard() {
  const [ready, setReady] = useState(false);
  // Two seeded fields: the noise it shows at rest and the code it settles into.
  const { noise, code, delay } = useMemo(() => {
    let seed = 17;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const noise: boolean[] = [];
    const code: boolean[] = [];
    const delay: number[] = [];
    for (let i = 0; i < N * N; i++) {
      const x = i % N;
      const y = Math.floor(i / N);
      // Finder corners are drawn separately; keep a clear ring round them in the code.
      const finderZone = (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
      noise.push(!inFinder(x, y) && rand() > 0.62);
      code.push(!finderZone && (rand() > 0.5 || (y === 6 && x % 2 === 0) || (x === 6 && y % 2 === 0)));
      delay.push(rand() * 0.4);
    }
    return { noise, code, delay };
  }, []);

  const field = ready ? code : noise;
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="card-qr-assemble"
        data-ready={ready || undefined}
        tabIndex={0}
        role="group"
        aria-label="Event ticket QR code"
        onPointerEnter={() => setReady(true)}
        onPointerLeave={() => setReady(false)}
        onFocus={() => setReady(true)}
        onBlur={() => setReady(false)}
      >
        <div className="card-qr-assemble__code" aria-hidden="true">
          {field.map((on, i) => (
            <span
              key={i}
              className="card-qr-assemble__m"
              data-on={on || undefined}
              style={{ '--d': `${delay[i].toFixed(2)}s` } as React.CSSProperties}
            />
          ))}
          <span className="card-qr-assemble__finder" style={{ left: 6, top: 6 }} />
          <span className="card-qr-assemble__finder" style={{ right: 6, top: 6 }} />
          <span className="card-qr-assemble__finder" style={{ left: 6, bottom: 6 }} />
        </div>
        <span className="card-qr-assemble__label">{ready ? 'Ready to scan' : 'Generating…'}</span>
        <span className="card-qr-assemble__hint">Gate B · Row 12</span>
      </div>
    </>
  );
}
