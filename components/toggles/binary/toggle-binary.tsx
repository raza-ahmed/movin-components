"use client";

import * as React from "react";
const css = `
  .toggle-binary { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-binary__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-binary__track {
    position: relative;
    display: flex;
    gap: 2px;
    padding: 4px;
    border-radius: 7px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .toggle-binary__input:focus-visible + .toggle-binary__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-binary__bit { position: relative; width: 10px; height: 18px; perspective: 60px; }
  .toggle-binary__flip {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    /* Turning off, the bits fall back from the right. */
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) calc((7 - var(--i)) * 0.04s);
  }
  .toggle-binary__face {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border-radius: 2px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#6d7179, #7d8087);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    font-weight: 600;
    backface-visibility: hidden;
  }
  .toggle-binary__face--one { transform: rotateX(180deg); background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  .toggle-binary__input:checked + .toggle-binary__track .toggle-binary__flip { transform: rotateX(180deg); transition-delay: calc(var(--i) * 0.05s); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-binary__flip { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function BinaryToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-binary">
        <input className="toggle-binary__input" type="checkbox" role="switch" />
        <span className="toggle-binary__track" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="toggle-binary__bit">
              <span className="toggle-binary__flip" style={{ '--i': i } as React.CSSProperties}>
                <span className="toggle-binary__face">0</span>
                <span className="toggle-binary__face toggle-binary__face--one">1</span>
              </span>
            </span>
          ))}
        </span>
        Debug flag
      </label>
    </>
  );
}
