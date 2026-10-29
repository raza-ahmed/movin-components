"use client";

import { useEffect, useState } from 'react';

const css = `
  .loader-binary {
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .loader-binary__bits { display: flex; gap: 4px; }
  .loader-binary__bit {
    display: grid;
    place-items: center;
    width: 14px;
    height: 22px;
    border-radius: 3px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#cbced3, #393c41);
    font-size: 11px;
    transition: background-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
  }
  .loader-binary__bit:nth-child(4) { margin-right: 4px; }
  .loader-binary__bit[data-on] {
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    box-shadow: 0 0 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 22%, transparent);
  }
  .loader-binary__hex { font-size: 10px; letter-spacing: 0.12em; color: light-dark(#5f626a, #a7abb2); }
  .loader-binary__hex b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
`;

export function BinaryLoader() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(0x2a);
    const id = window.setInterval(() => setN((v) => (v + 1) % 256), 110);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-binary" role="status" aria-label="Loading">
        <span className="loader-binary__bits" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => {
            const on = (n >> (7 - i)) & 1;
            return (
              <span key={i} className="loader-binary__bit" data-on={on || undefined}>
                {on}
              </span>
            );
          })}
        </span>
        <span className="loader-binary__hex" aria-hidden="true">
          0x<b>{n.toString(16).toUpperCase().padStart(2, '0')}</b> · {String(n).padStart(3, '0')}
        </span>
      </div>
    </>
  );
}
